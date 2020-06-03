package rest

import (
	"encoding/json"
	"net/http"

	"github.com/njehyde/issue-tracker/libraries/responsebuilder"
	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/checking"
)

func checkAuthenticated() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		rb := responsebuilder.New()

		json.NewEncoder(w).Encode(
			rb.SuccessWithoutResult().Build(),
		)
	}
}

func checkHealth(service checking.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		status := service.CheckHealth()

		type HealthResult struct {
			Status interface{} `json:"status,omitempty"`
		}

		result := HealthResult{Status: status}

		rb := responsebuilder.New()
		json.NewEncoder(w).Encode(
			rb.Success(result).Build(),
		)
	}
}

func checkProjectExistsByKey(service checking.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		key := r.FormValue("key")

		exists, err := service.CheckProjectExistsByKey(&key)
		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if !exists {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		return
	}
}

func checkUserExistsByEmail(service checking.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")

		exists, err := service.CheckUserExistsByEmail(&email)
		if err != nil {
			slog.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if !exists {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		return
	}
}
