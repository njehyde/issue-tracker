package rest

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/listing"
)

func getBoardTypes(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		boardTypes, err := service.GetBoardTypes()
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetBoardTypesResult struct {
			BoardTypes []listing.BoardType `json:"boardTypes"`
		}

		result := GetBoardTypesResult{BoardTypes: boardTypes}
		sendResultResponse(result, w)
	}
}

func getCategories(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		categories, err := service.GetCategories()
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetCategoriesResult struct {
			Categories []listing.Category `json:"categories"`
		}

		result := GetCategoriesResult{Categories: categories}
		sendResultResponse(result, w)
	}
}

func getIssue(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		issue, err := service.GetIssue(id)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetIssueResult struct {
			Issue listing.Issue `json:"issue"`
		}

		result := GetIssueResult{Issue: issue}
		sendResultResponse(result, w)
	}
}

func getIssues(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		v := r.URL.Query()
		pageSize := v.Get("pageSize")
		cursor := v.Get("cursor")

		if len(pageSize) == 0 {
			pageSize = "10"
		}

		i, err := strconv.Atoi(pageSize)
		if err != nil {
			handleRequestError(err, w)
		}
		pagination := listing.Pagination{PageSize: i, Cursor: cursor}

		issues, count, err := service.GetIssues(&pagination)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetIssuesResult struct {
			Issues   []listing.Issue  `json:"issues"`
			Metadata listing.Metadata `json:"metadata"`
		}

		metadata := listing.Metadata{Pagination: &pagination, Count: count}
		result := GetIssuesResult{Issues: issues, Metadata: metadata}
		sendResultResponse(result, w)
	}
}

func getIssueComments(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		issueID := vars["issueId"]

		v := r.URL.Query()
		pageSize := v.Get("pageSize")
		cursor := v.Get("cursor")

		if len(pageSize) == 0 {
			pageSize = "10"
		}

		i, err := strconv.Atoi(pageSize)
		if err != nil {
			handleRequestError(err, w)
		}
		pagination := listing.Pagination{PageSize: i, Cursor: cursor}

		issueComments, count, err := service.GetIssueComments(&issueID, &pagination)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetIssuesResult struct {
			IssueComments []listing.IssueComment `json:"issueComments"`
			Metadata      listing.Metadata       `json:"metadata"`
		}

		metadata := listing.Metadata{Pagination: &pagination, Count: count}
		result := GetIssuesResult{IssueComments: issueComments, Metadata: metadata}
		sendResultResponse(result, w)
	}
}

func getIssueStatuses(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		term := r.FormValue("term")

		issueStatuses, err := service.GetIssueStatuses(&term)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetIssueStatusesResult struct {
			IssueStatuses []listing.IssueStatus `json:"issueStatuses"`
		}

		result := GetIssueStatusesResult{IssueStatuses: issueStatuses}
		sendResultResponse(result, w)
	}
}

func getIssueTypes(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		issueTypes, err := service.GetIssueTypes()
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetIssueTypesResult struct {
			IssueTypes []listing.IssueType `json:"issueTypes"`
		}

		result := GetIssueTypesResult{IssueTypes: issueTypes}
		sendResultResponse(result, w)
	}
}

func getLabels(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		term := r.FormValue("term")

		labels, err := service.GetLabels(&term)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetLabelsResult struct {
			Labels []listing.Label `json:"labels"`
		}

		result := GetLabelsResult{Labels: labels}
		sendResultResponse(result, w)
	}
}

func getPriorityTypes(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		priorityTypes, err := service.GetPriorityTypes()
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetPriorityTypesResult struct {
			PriorityTypes []listing.PriorityType `json:"priorityTypes"`
		}

		result := GetPriorityTypesResult{PriorityTypes: priorityTypes}
		sendResultResponse(result, w)
	}
}

func getProject(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		project, err := service.GetProject(id)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetProjectResult struct {
			Project listing.Project `json:"project"`
		}

		result := GetProjectResult{Project: project}
		sendResultResponse(result, w)
	}
}

func getProjectBacklogIssues(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]

		v := r.URL.Query()
		pageSize := v.Get("pageSize")
		cursor := v.Get("cursor")

		if len(pageSize) == 0 {
			pageSize = "10"
		}

		i, err := strconv.Atoi(pageSize)
		if err != nil {
			handleRequestError(err, w)
			return
		}
		pagination := listing.Pagination{PageSize: i, Cursor: cursor}

		issues, count, err := service.GetProjectBacklogIssues(&projectID, &pagination)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type Result struct {
			Issues   []listing.Issue  `json:"issues"`
			Metadata listing.Metadata `json:"metadata"`
		}

		metadata := listing.Metadata{Pagination: &pagination, Count: count}
		result := Result{Issues: issues, Metadata: metadata}
		sendResultResponse(result, w)
	}
}

func getProjectBoard(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		boardID := vars["boardId"]

		b, err := service.GetProjectBoard(&projectID, &boardID)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetProjectBoardResult struct {
			Board listing.Board `json:"board"`
		}

		result := GetProjectBoardResult{Board: *b}
		sendResultResponse(result, w)
	}
}

func getProjectIssues(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]

		v := r.URL.Query()
		pageSize := v.Get("pageSize")
		cursor := v.Get("cursor")

		if len(pageSize) == 0 {
			pageSize = "10"
		}

		i, err := strconv.Atoi(pageSize)
		if err != nil {
			handleRequestError(err, w)
			return
		}
		pagination := listing.Pagination{PageSize: i, Cursor: cursor}

		issues, count, err := service.GetProjectIssues(&projectID, &pagination)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		slog.Infof("issues: %v", issues)

		type Result struct {
			Issues   []listing.Issue  `json:"issues"`
			Metadata listing.Metadata `json:"metadata"`
		}

		metadata := listing.Metadata{Pagination: &pagination, Count: count}
		result := Result{Issues: issues, Metadata: metadata}

		slog.Infof("result %v", result)
		sendResultResponse(result, w)
	}
}

func getProjects(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		v := r.URL.Query()
		pageSize := v.Get("pageSize")
		cursor := v.Get("cursor")

		if len(pageSize) == 0 {
			pageSize = "10"
		}

		i, err := strconv.Atoi(pageSize)
		if err != nil {
			handleRequestError(err, w)
			return
		}
		pagination := listing.Pagination{PageSize: i, Cursor: cursor}

		projects, count, err := service.GetProjects(&pagination)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetProjectsResult struct {
			Projects []listing.Project `json:"projects"`
			Metadata listing.Metadata  `json:"metadata"`
		}

		metadata := listing.Metadata{Pagination: &pagination, Count: count}
		result := GetProjectsResult{Projects: projects, Metadata: metadata}
		sendResultResponse(result, w)
	}
}

func getProjectSprintIssues(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		sprintID := vars["sprintId"]

		v := r.URL.Query()
		pageSize := v.Get("pageSize")
		cursor := v.Get("cursor")

		if len(pageSize) == 0 {
			pageSize = "10"
		}

		i, err := strconv.Atoi(pageSize)
		if err != nil {
			handleRequestError(err, w)
			return
		}

		pagination := listing.Pagination{PageSize: i, Cursor: cursor}

		issues, count, err := service.GetProjectSprintIssues(&projectID, &sprintID, &pagination)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type Result struct {
			Issues   []listing.Issue  `json:"issues"`
			Metadata listing.Metadata `json:"metadata"`
		}

		metadata := listing.Metadata{Pagination: &pagination, Count: count}
		result := Result{Issues: issues, Metadata: metadata}
		sendResultResponse(result, w)
	}
}

func getProjectTypes(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		term := r.FormValue("term")

		projectTypes, err := service.GetProjectTypes(&term)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetProjectTypesResult struct {
			ProjectTypes []listing.ProjectType `json:"projectTypes"`
		}

		result := GetProjectTypesResult{ProjectTypes: projectTypes}
		sendResultResponse(result, w)
	}
}

func getUsers(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		term := r.FormValue("term")

		users, err := service.GetUsers(&term)
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetUsersResult struct {
			Users []listing.User `json:"users"`
		}

		result := GetUsersResult{Users: users}
		sendResultResponse(result, w)
	}
}

func getWorkflows(service listing.Service) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		workflows, err := service.GetWorkflows()
		if err != nil {
			handleServiceError(err, w)
			return
		}

		type GetWorkflowsResult struct {
			Workflows []listing.Workflow `json:"workflows"`
		}

		result := GetWorkflowsResult{Workflows: workflows}
		sendResultResponse(result, w)
	}
}
