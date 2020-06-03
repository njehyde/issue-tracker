package rest

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/njehyde/issue-tracker/pkg/deleting"
)

func deleteIssue(service deleting.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		issueID := vars["id"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.DeleteIssue(userID, issueID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue deleted successfully", w)
	}
}

func deleteIssueComment(service deleting.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		issueID := vars["issueId"]
		commentID := vars["commentId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.DeleteIssueComment(userID, &issueID, &commentID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue comment deleted successfully", w)
	}
}

func deleteProject(service deleting.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["id"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.DeleteProject(userID, projectID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Project deleted successfully", w)
	}
}

func deleteProjectBoardSprint(service deleting.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		boardID := vars["boardId"]
		sprintID := vars["sprintId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.DeleteProjectBoardSprint(userID, &projectID, &boardID, &sprintID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Sprint deleted successfully", w)
	}
}
