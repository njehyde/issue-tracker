package rest

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/njehyde/issue-tracker/pkg/adding"
)

func addIssue(service adding.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var i adding.Issue

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = json.NewDecoder(r.Body).Decode(&i)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.AddIssue(userID, &i)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue added successfully", w)
	}
}

func addIssueComment(service adding.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var ic adding.IssueComment

		vars := mux.Vars(r)
		issueID := vars["issueId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = json.NewDecoder(r.Body).Decode(&ic)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.AddIssueComment(userID, &issueID, &ic)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Comment added successfully", w)
	}
}

func addIssueStatus(service adding.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var is adding.IssueStatus

		err := json.NewDecoder(r.Body).Decode(&is)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.AddIssueStatus(&is)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue status added successfully", w)
	}
}

func addPriorityType(service adding.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var pt adding.PriorityType

		err := json.NewDecoder(r.Body).Decode(&pt)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.AddPriorityType(&pt)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Priority type added successfully", w)
	}
}

func addProject(service adding.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var p adding.Project

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.AddProject(userID, &p)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Project added successfully", w)
	}
}

func addProjectBoardSprint(service adding.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		boardID := vars["boardId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.AddProjectBoardSprint(userID, &projectID, &boardID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Sprint added successfully", w)
	}
}

// func addUser(a authenticating.Service) func(w http.ResponseWriter, r *http.Request) {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		var u authenticating.User
// 		rb := responsebuilder.New()

// 		err := json.NewDecoder(r.Body).Decode(&u)
// 		if err != nil {
// 			slog.Error(err)
// 			w.WriteHeader(http.StatusBadRequest)
// 			json.NewEncoder(w).Encode(
// 				rb.Fail("Invalid request").Build(),
// 			)
// 			return
// 		}

// 		err = a.AddUser(&u)
// 		if err != nil {
// 			slog.Error(err)
// 			w.WriteHeader(http.StatusBadRequest)
// 			json.NewEncoder(w).Encode(
// 				rb.Fail(err.Error()).Build(),
// 			)
// 			return
// 		}

// 		accessToken := a.GetAccessToken(u.ID.Hex())
// 		refreshToken := a.GetRefreshToken(u.ID.Hex())

// 		type AddUserResult struct {
// 			User         authenticating.User `json:"user"`
// 			AccessToken  string    `json:"accessToken"`
// 			RefreshToken string    `json:"refreshToken"`
// 		}

// 		result := AddUserResult{User: u, AccessToken: accessToken, RefreshToken: refreshToken}

// 		json.NewEncoder(w).Encode(
// 			rb.Success(result).Build(),
// 		)
// 	}
// }
