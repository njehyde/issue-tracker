package rest

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/njehyde/issue-tracker/pkg/updating"
)

func decreaseIssueStatus(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		err := service.DecreaseIssueStatus(id)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue status decreased successfully", w)
	}
}

func decreasePriorityType(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		err := service.DecreasePriorityType(id)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Priority type decreased successfully", w)
	}
}

func increaseIssueStatus(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		err := service.IncreaseIssueStatus(id)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue status increased successfully", w)
	}
}

func increasePriorityType(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		err := service.IncreasePriorityType(id)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Priority type increased successfully", w)
	}
}

func sendIssueToSprint(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var meta updating.SendIssueToSprintMetadata

		vars := mux.Vars(r)
		projectID := vars["projectId"]
		sprintID := vars["sprintId"]
		issueID := vars["issueId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = json.NewDecoder(r.Body).Decode(&meta)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		// TODO: Wrap parameters in struct
		err = service.SendIssueToSprint(userID, &projectID, &sprintID, &issueID, &meta)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue sent to sprint successfully", w)
	}
}

func sendIssueToBottomOfBacklog(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		issueID := vars["issueId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.SendIssueToBottomOfBacklog(userID, &projectID, &issueID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue sent to bottom of backlog successfully", w)
	}
}

func sendIssueToTopOfBacklog(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		issueID := vars["issueId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.SendIssueToTopOfBacklog(userID, &projectID, &issueID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue sent to top of backlog successfully", w)
	}
}

func updateIssue(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var i updating.Issue

		vars := mux.Vars(r)
		projectID := vars["projectId"]
		issueID := vars["issueId"]

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

		err = service.UpdateIssue(userID, &projectID, &issueID, &i)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue updated successfully", w)
	}
}

func updateIssueOrdinals(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var ios updating.IssueOrdinals

		vars := mux.Vars(r)
		projectID := vars["projectId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = json.NewDecoder(r.Body).Decode(&ios)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.UpdateIssueOrdinals(userID, &projectID, ios.IssueOrdinals)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue ordinals updated successfully", w)
	}
}

func updateIssueComment(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var ic updating.IssueComment

		vars := mux.Vars(r)
		issueID := vars["issueId"]
		commentID := vars["commentId"]

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

		err = service.UpdateIssueComment(userID, &issueID, &commentID, &ic)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue comment updated successfully", w)
	}
}

func updateIssueStatus(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var is updating.IssueStatus

		vars := mux.Vars(r)
		id := vars["id"]

		err := json.NewDecoder(r.Body).Decode(&is)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.UpdateIssueStatus(id, &is)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Issue status updated successfully", w)
	}
}

func updatePriorityType(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var pt updating.PriorityType

		vars := mux.Vars(r)
		id := vars["id"]

		err := json.NewDecoder(r.Body).Decode(&pt)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.UpdatePriorityType(id, &pt)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Priority tyoe updated successfully", w)
	}
}

func updateProject(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var p updating.Project

		vars := mux.Vars(r)
		projectID := vars["id"]

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

		err = service.UpdateProject(userID, projectID, &p)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Project updated successfully", w)
	}
}

func updateProjectBoardSprint(service updating.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var s updating.Sprint

		vars := mux.Vars(r)
		projectID := vars["projectId"]
		boardID := vars["boardId"]
		sprintID := vars["sprintId"]

		userID, err := getUserFromRequestContext(r)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = json.NewDecoder(r.Body).Decode(&s)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		err = service.UpdateProjectBoardSprint(userID, &projectID, &boardID, &sprintID, &s)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		sendSuccessResponse("Sprint updated successfully", w)
	}
}
