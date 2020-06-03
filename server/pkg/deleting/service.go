package deleting

import (
	"encoding/json"

	"github.com/njehyde/issue-tracker/pkg/http/ws"
)

// Service provides entity deletion operations
type Service interface {
	// DeleteIssue attempts to delete an issue entity.
	DeleteIssue(*string, string) error
	// DeleteIssueComment attempts to delete an issue comment entity.
	DeleteIssueComment(*string, *string, *string) error
	// DeleteProject attempts to delete a project entity.
	DeleteProject(*string, string) error
	// DeleteProjectBoardSprint attempts to project board sprint entity.
	DeleteProjectBoardSprint(*string, *string, *string, *string) error
}

// Repository provides access to the deleting repository
type Repository interface {
	// DeleteIssue attempts to delete an issue entity from the repository.
	DeleteIssue(string) error
	// DeleteIssueComment attempts to delete an issue comment entity from the repository.
	DeleteIssueComment(*string, *string) error
	// DeleteProject attempts to delete a project entity from the repository.
	DeleteProject(string) error
	// DeleteProjectBoardSprint attempts to delete a sprint entity from the repository.
	DeleteProjectBoardSprint(*string, *string, *string) error
}

type service struct {
	repo Repository
	hub  *ws.Hub
}

// NewService creates a deletion service with the necessary dependencies
func NewService(r Repository, hub *ws.Hub) Service {
	return &service{r, hub}
}

func (s *service) DeleteIssue(userID *string, issueID string) error {
	// TODO: Validation for DeleteIssue
	err := s.repo.DeleteIssue(issueID)
	if err != nil {
		return err
	}

	// TODO: Implement projectId in delete issue path
	payload := IssueDeletedPayload{*userID, "", issueID}
	err = s.broadcastEvent(IssueDeleted, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteIssueComment(userID *string, issueID *string, commentID *string) error {
	// TODO: Validation for DeleteIssueComment
	err := s.repo.DeleteIssueComment(issueID, commentID)
	if err != nil {
		return err
	}

	payload := IssueCommentDeletedPayload{*userID, *issueID, *commentID}
	err = s.broadcastEvent(IssueCommentDeleted, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteProject(userID *string, projectID string) error {
	// TODO: Validation for DeleteProject
	err := s.repo.DeleteProject(projectID)
	if err != nil {
		return err
	}

	payload := ProjectDeletedPayload{*userID, projectID}
	err = s.broadcastEvent(ProjectDeleted, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteProjectBoardSprint(userID *string, projectID *string, boardID *string, sprintID *string) error {
	// TODO: Validation for DeleteProjectBoardSprint
	err := s.repo.DeleteProjectBoardSprint(projectID, boardID, sprintID)
	if err != nil {
		return err
	}

	payload := ProjectBoardSprintDeletedPayload{*userID, *projectID, *boardID, *sprintID}
	err = s.broadcastEvent(ProjectBoardSprintDeleted, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) broadcastEvent(eventType EventType, payload interface{}) error {
	m := Message{Type: eventType, Payload: payload}
	b, err := json.Marshal(m)
	if err != nil {
		return err
	}

	s.hub.Broadcast <- b

	return nil
}
