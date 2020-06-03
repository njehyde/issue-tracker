package authenticating

import (
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/njehyde/issue-tracker/libraries/slog"
)

// Service provides user authentication operations
type Service interface {
	// GetAccessToken attempts to grant an access token for a user
	GetAccessToken(string) string
	// GetRefreshToken attempts to grant a refresh token for a user
	GetRefreshToken(string) string
	// GetUserByID returns a user for a given ID.
	GetUserByID(string) (*User, error)
	// Login attempts to authenticate a user and return a set of authentication tokens.
	Login(*LoginCredentials) (User, error)
	// RegisterUser attempts to register a new user and return a set of authentication tokens.
	RegisterUser(*RegisterUser) (User, error)
}

// Repository provides access to the authenticating repository
type Repository interface {
	// GetUserByID ...
	GetUserByID(string) (*User, error)
	// Login ...
	Login(*LoginCredentials) (User, error)
	// RegisterUser ...
	RegisterUser(*RegisterUser) (User, error)
}

type service struct {
	repo Repository
}

// NewService creates an authentication service with the necessary dependencies
func NewService(r Repository) Service {
	return &service{r}
}

func (s *service) GetAccessToken(id string) string {
	atk := &Token{}
	atk.Subject = id

	expiresDelay, err := strconv.ParseInt(os.Getenv("ACCESS_TOKEN_EXPIRY_DELAY"), 10, 64)
	if err != nil {
		expiresDelay = 30
		slog.Errorf("Failed to parse access token expiry to int64, defaulting to %v", expiresDelay)
	}

	atk.ExpiresAt = time.Now().Add(time.Minute * time.Duration(expiresDelay)).Unix()

	newAtk := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), atk)
	accessToken, _ := newAtk.SignedString([]byte(os.Getenv("ACCESS_TOKEN_PASSWORD")))

	return "Bearer " + accessToken
}

func (s *service) GetRefreshToken(id string) string {
	rtk := &Token{}
	rtk.Subject = id

	expiresDelay, err := strconv.ParseInt(os.Getenv("REFRESH_TOKEN_EXPIRY_DELAY"), 10, 64)
	if err != nil {
		expiresDelay = 30
		slog.Errorf("Failed to parse refresh token expiry to int64, defaulting to %v", expiresDelay)
	}

	rtk.ExpiresAt = time.Now().Add(time.Minute * time.Duration(expiresDelay)).Unix()

	newRtk := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), rtk)
	refreshToken, _ := newRtk.SignedString([]byte(os.Getenv("REFRESH_TOKEN_PASSWORD")))

	return refreshToken
}

func (s *service) GetUserByID(id string) (*User, error) {
	return s.repo.GetUserByID(id)
}

func (s *service) Login(lc *LoginCredentials) (User, error) {
	var u User
	var err error

	// Validate user
	err = validateLogin(lc)
	if err != nil {
		return u, err
	}

	// Attempt login
	u, err = s.repo.Login(lc)
	if err != nil {
		return u, err
	}

	return u, nil
}

func (s *service) RegisterUser(ru *RegisterUser) (User, error) {
	var u User
	var err error

	// Validate user
	err = validateRegisterUser(ru)
	if err != nil {
		return u, err
	}

	// Add the user
	u, err = s.repo.RegisterUser(ru)
	if err != nil {
		return u, err
	}

	return u, nil
}
