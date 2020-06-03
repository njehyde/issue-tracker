package rest

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/njehyde/issue-tracker/libraries/responsebuilder"
	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/authenticating"
)

func login(a authenticating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var lc authenticating.LoginCredentials
		rb := responsebuilder.New()

		err := json.NewDecoder(r.Body).Decode(&lc)
		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(
				rb.Fail("Invalid request").Build(),
			)
			return
		}

		u, err := a.Login(&lc)
		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(
				rb.Fail(err.Error()).Build(),
			)
			return
		}

		accessToken := a.GetAccessToken(u.ID)
		refreshToken := a.GetRefreshToken(u.ID)

		type LoginResult struct {
			User interface{} `json:"user"`
		}

		result := LoginResult{User: u}

		w.Header().Add("Access-Control-Expose-Headers", "Authorization, Refresh-Token")
		w.Header().Add("Authorization", accessToken)
		w.Header().Add("Refresh-Token", refreshToken)

		json.NewEncoder(w).Encode(
			rb.Success(result).Message("Login successful").Build(),
		)
	}
}

func refreshToken(a authenticating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		type RefreshTokenRequestBody struct {
			RefreshToken string `json:"refreshToken"`
		}

		rt := r.Header.Get("Refresh-Token")

		// var rt RefreshTokenRequestBody
		var accessToken string
		var refreshToken string

		rb := responsebuilder.New()

		// err := json.NewDecoder(r.Body).Decode(&rt)
		if len(rt) == 0 {
			slog.Errorf("Refresh-Token not found in request header")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(
				rb.Fail("Invalid request").Build(),
			)
			return
		}

		// Parse the token
		token, err := jwt.Parse(rt, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("REFRESH_TOKEN_PASSWORD")), nil
		})

		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(
				rb.Fail(err.Error()).Build(),
			)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			sub := fmt.Sprintf("%v", claims["sub"])

			err := claims.Valid()
			if err != nil {
				slog.Error(err)
				w.WriteHeader(http.StatusForbidden)
				json.NewEncoder(w).Encode(
					rb.Fail(err.Error()).Build(),
				)
				return
			}

			// Check that user with id exists
			u, err := a.GetUserByID(sub)
			if err != nil || u == nil {
				errMsg := "Failed to find user associated with refresh token"
				slog.Errorf("%v %v", errMsg, err)
				w.WriteHeader(http.StatusForbidden)
				json.NewEncoder(w).Encode(
					rb.Fail(errMsg).Build(),
				)
				return
			}

			accessToken = a.GetAccessToken(u.ID)
			refreshToken = a.GetRefreshToken(u.ID)
		}

		w.Header().Add("Access-Control-Expose-Headers", "Authorization, Refresh-Token")
		w.Header().Add("Authorization", accessToken)
		w.Header().Add("Refresh-Token", refreshToken)

		json.NewEncoder(w).Encode(
			rb.SuccessWithoutResult().Build(),
		)
	}
}

func registerUser(a authenticating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var ru authenticating.RegisterUser
		rb := responsebuilder.New()

		err := json.NewDecoder(r.Body).Decode(&ru)
		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(
				rb.Fail("Invalid request").Build(),
			)
			return
		}

		u, err := a.RegisterUser(&ru)
		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(
				rb.Fail(err.Error()).Build(),
			)
			return
		}

		accessToken := a.GetAccessToken(u.ID)
		refreshToken := a.GetRefreshToken(u.ID)

		type AddUserResult struct {
			User authenticating.User `json:"user"`
		}

		result := AddUserResult{User: u}

		w.Header().Add("Access-Control-Expose-Headers", "Authorization, Refresh-Token")
		w.Header().Add("Authorization", accessToken)
		w.Header().Add("Refresh-Token", refreshToken)

		json.NewEncoder(w).Encode(
			rb.Success(result).Message("Registration successful").Build(),
		)
	}
}
