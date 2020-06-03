package rest

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/njehyde/issue-tracker/libraries/responsebuilder"
	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/adding"
	"github.com/njehyde/issue-tracker/pkg/authenticating"
	"github.com/njehyde/issue-tracker/pkg/checking"
	"github.com/njehyde/issue-tracker/pkg/deleting"
	"github.com/njehyde/issue-tracker/pkg/events"
	"github.com/njehyde/issue-tracker/pkg/http/ws"
	"github.com/njehyde/issue-tracker/pkg/listing"
	"github.com/njehyde/issue-tracker/pkg/updating"
)

type user string

const (
	userKey user = "user"
)

// Handler ...
func Handler(
	auth authenticating.Service,
	l listing.Service,
	a adding.Service,
	u updating.Service,
	d deleting.Service,
	c checking.Service,
	hub *ws.Hub,
	eb *events.EventBus) http.Handler {

	r := mux.NewRouter()
	r.Use(AddContentTypeHeader)
	r.Use(JwtAuthentication)

	r.HandleFunc("/login", login(auth)).Methods("POST")
	r.HandleFunc("/refreshToken", refreshToken(auth)).Methods("POST")
	r.HandleFunc("/register", registerUser(auth)).Methods("POST")
	r.HandleFunc("/authenticated", checkAuthenticated()).Methods("GET")
	r.HandleFunc("/health", checkHealth(c)).Methods("GET")

	r.HandleFunc("/boardTypes", getBoardTypes(l)).Methods("GET")
	r.HandleFunc("/categories", getCategories(l)).Methods("GET")
	r.HandleFunc("/issues", getIssues(l)).Methods("GET")
	r.HandleFunc("/issues/{id:[a-z0-9]+}", getIssue(l)).Methods("GET")
	r.HandleFunc("/issues", addIssue(a)).Methods("POST")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/issues/{issueId:[a-z0-9]+}", updateIssue(u)).Methods("PUT")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/issue/ordinals", updateIssueOrdinals(u)).Methods("PUT")
	r.HandleFunc("/issues/{id:[a-z0-9]+}", deleteIssue(d)).Methods("DELETE")
	r.HandleFunc("/issues/{issueId:[a-z0-9]+}/comments", getIssueComments(l)).Methods("GET")
	r.HandleFunc("/issues/{issueId:[a-z0-9]+}/comments", addIssueComment(a)).Methods("POST")
	r.HandleFunc("/issues/{issueId:[a-z0-9]+}/comments/{commentId:[a-z0-9]+}", updateIssueComment(u)).Methods("PUT")
	r.HandleFunc("/issues/{issueId:[a-z0-9]+}/comments/{commentId:[a-z0-9]+}", deleteIssueComment(d)).Methods("DELETE")
	r.HandleFunc("/issueStatuses", getIssueStatuses(l)).Methods("GET")
	r.HandleFunc("/issueStatuses", addIssueStatus(a)).Methods("POST")
	r.HandleFunc("/issueStatuses/{id:[A-Z_]+}", updateIssueStatus(u)).Methods("PUT")
	r.HandleFunc("/issueStatuses/{id:[A-Z_]+}/increase", increaseIssueStatus(u)).Methods("PUT")
	r.HandleFunc("/issueStatuses/{id:[A-Z_]+}/decrease", decreaseIssueStatus(u)).Methods("PUT")
	r.HandleFunc("/issueTypes", getIssueTypes(l)).Methods("GET")
	r.HandleFunc("/labels", getLabels(l)).Methods("GET")
	r.HandleFunc("/priorityTypes", getPriorityTypes(l)).Methods("GET")
	r.HandleFunc("/priorityTypes", addPriorityType(a)).Methods("POST")
	r.HandleFunc("/priorityTypes/{id:[A-Z_]+}", updatePriorityType(u)).Methods("PUT")
	r.HandleFunc("/priorityTypes/{id:[A-Z_]+}/increase", increasePriorityType(u)).Methods("PUT")
	r.HandleFunc("/priorityTypes/{id:[A-Z_]+}/decrease", decreasePriorityType(u)).Methods("PUT")
	r.HandleFunc("/projects", getProjects(l)).Methods("GET")
	r.HandleFunc("/projects/{id:[a-z0-9]+}", getProject(l)).Methods("GET")
	r.HandleFunc("/projects", addProject(a)).Methods("POST")
	r.HandleFunc("/projects/{id:[a-z0-9]+}", updateProject(u)).Methods("PUT")
	r.HandleFunc("/projects/{id:[a-z0-9]+}", deleteProject(d)).Methods("DELETE")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/issues", getProjectIssues(l)).Methods("GET")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/backlog/issues", getProjectBacklogIssues(l)).Methods("GET")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/backlog/issues/{issueId:[a-z0-9]+}/top", sendIssueToTopOfBacklog(u)).Methods("PUT")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/backlog/issues/{issueId:[a-z0-9]+}/bottom", sendIssueToBottomOfBacklog(u)).Methods("PUT")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/sprints/{sprintId:[a-z0-9]+}/issues", getProjectSprintIssues(l)).Methods("GET")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/sprints/{sprintId:[a-z0-9]+}/issues/{issueId:[a-z0-9]+}", sendIssueToSprint(u)).Methods("PUT")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/boards/{boardId:[a-z0-9]+}", getProjectBoard(l)).Methods("GET")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/boards/{boardId:[a-z0-9]+}/sprints", addProjectBoardSprint(a)).Methods("POST")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/boards/{boardId:[a-z0-9]+}/sprints/{sprintId:[a-z0-9]+}", updateProjectBoardSprint(u)).Methods("PUT")
	r.HandleFunc("/projects/{projectId:[a-z0-9]+}/boards/{boardId:[a-z0-9]+}/sprints/{sprintId:[a-z0-9]+}", deleteProjectBoardSprint(d)).Methods("DELETE")
	r.HandleFunc("/projectTypes", getProjectTypes(l)).Methods("GET")
	r.HandleFunc("/workflows", getWorkflows(l)).Methods("GET")
	r.HandleFunc("/users", getUsers(l)).Methods("GET")
	// r.HandleFunc("/users", addUser(a)).Methods("POST")
	// r.HandleFunc("/users", updateUser(a)).Methods("PUT")
	// r.HandleFunc("/users", deleteUser(a)).Methods("DELETE")

	r.HandleFunc("/check/projects", checkProjectExistsByKey(c)).Queries("key", "{[a-z]+}").Methods("HEAD")
	r.HandleFunc("/check/users", checkUserExistsByEmail(c)).Queries("email", "{[a-z]+}").Methods("HEAD")

	r.HandleFunc("/ws", wsEndpoint(eb, hub)).Methods("GET")

	return r
}

// AddContentTypeHeader ...
var AddContentTypeHeader = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		next.ServeHTTP(w, r)
	})
}

// JwtAuthentication ...
var JwtAuthentication = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		rb := responsebuilder.New()

		// REFACTOR: List of endpoints not requiring authentication
		notAuth := []string{
			"/register",
			"/login",
			"/refreshToken",
			"/health",
			"/check/users",
			"/ws",
		}

		// Gets the current request path
		requestPath := r.URL.Path

		// Where request doesn't require authenication, serve the request as normal
		for _, value := range notAuth {
			if value == requestPath {
				next.ServeHTTP(w, r)
				return
			}
		}

		// Get the "Authorization" token from the header
		tokenHeader := r.Header.Get("Authorization")

		// Where the token is missing, return with forbidden status code
		if tokenHeader == "" {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(
				rb.Fail("Missing auth token").Build(),
			)
			return
		}

		// Check that the token is in the format of `Bearer {token-body}`
		splitToken := strings.Split(tokenHeader, " ")
		if len(splitToken) != 2 {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(
				rb.Fail("Malformed authentication token").Build(),
			)
			return
		}

		// Get the token part
		tokenPart := splitToken[1]

		tk := &authenticating.Token{}

		token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("ACCESS_TOKEN_PASSWORD")), nil
		})

		// Where an error occurs, returns a malformed token response
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(
				rb.Fail("Invalid token").Build(),
			)
			return
		}

		// Where token is not valid, return an invalid token response
		if !token.Valid {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(
				rb.Fail("Invalid token").Build(),
			)
			return
		}

		ctx := context.WithValue(r.Context(), userKey, tk.Subject)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func getUserFromRequestContext(r *http.Request) (*string, error) {
	ctx := r.Context()
	user := ctx.Value(userKey)
	if user == nil {
		return nil, fmt.Errorf("UserID was not found in context")
	}
	userID := user.(string)
	return &userID, nil
}

func handleUserError(w http.ResponseWriter) {
	err := fmt.Errorf("Failed to get user from context")
	slog.Error(err)
	w.WriteHeader(http.StatusInternalServerError)
	rb := responsebuilder.New()
	json.NewEncoder(w).Encode(
		rb.Fail("Server error").Build(),
	)
}

func handleRequestError(err error, w http.ResponseWriter) {
	slog.Error(err)
	w.WriteHeader(http.StatusBadRequest)
	rb := responsebuilder.New()
	json.NewEncoder(w).Encode(
		rb.Fail("Invalid request").Build(),
	)
}

func handleServiceError(err error, w http.ResponseWriter) {
	slog.Error(err)
	w.WriteHeader(http.StatusInternalServerError)
	rb := responsebuilder.New()
	json.NewEncoder(w).Encode(
		rb.Fail(err.Error()).Build(),
	)
}

func sendSuccessResponse(msg string, w http.ResponseWriter) {
	rb := responsebuilder.New()
	json.NewEncoder(w).Encode(
		rb.Status(true).Message(msg).Build(),
	)
}

func sendResultResponse(result interface{}, w http.ResponseWriter) {
	rb := responsebuilder.New()
	json.NewEncoder(w).Encode(
		rb.Success(result).Build(),
	)
}
