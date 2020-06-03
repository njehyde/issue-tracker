package adding

import (
	"encoding/json"

	"github.com/njehyde/issue-tracker/pkg/http/ws"
)

// Service provides entity adding operations.
type Service interface {
	// AddIssue adds a new issue entity.
	AddIssue(*string, *Issue) error
	// AddIssueComment adds a new issue comment entity.
	AddIssueComment(*string, *string, *IssueComment) error
	// AddIssueStatus adds a new issue status entity.
	AddIssueStatus(*IssueStatus) error
	// AddPriorityType adds a new priority type entity.
	AddPriorityType(*PriorityType) error
	// AddProject adds a new project entity.
	AddProject(*string, *Project) error
	// AddProjectBoardSprint adds a new project board sprint entity.
	AddProjectBoardSprint(*string, *string, *string) error
	// AddUser(User) error
}

// Repository provides access to the adding repository.
type Repository interface {
	// AddIssue saves an issue to the repository
	AddIssue(*Issue) error
	// AddIssueComment saves a issue comment entity to the repository.
	AddIssueComment(*string, *string, *IssueComment) error
	// AddIssueStatus saves a issue status to the repository.
	AddIssueStatus(*IssueStatus) error
	// AddPriorityType saves a priority type to the repository.
	AddPriorityType(*PriorityType) error
	// AddProject saves a project to the repository
	AddProject(*Project) error
	// AddProjectBoardSprint saves a project board sprint to the repository
	AddProjectBoardSprint(*string, *string, *string) error
	// AddUser saves a user to the repository
	// AddUser(User) error
}

type service struct {
	repo Repository
	hub  *ws.Hub
}

// NewService creates an adding service with the necessary dependencies.
func NewService(r Repository, hub *ws.Hub) Service {
	return &service{r, hub}
}

func (s *service) AddIssue(userID *string, i *Issue) error {
	// TODO: Validation for AddIssue
	// err = validateAddIssue(*i)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.AddIssue(i)
	if err != nil {
		return err
	}

	payload := IssueAddedPayload{*userID, i.ProjectID}
	err = s.broadcastEvent(IssueAdded, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) AddIssueComment(userID *string, issueID *string, c *IssueComment) error {
	// TODO: Validation for AddIssueComment
	// err = validateAddIssueComment(issueID, c)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.AddIssueComment(issueID, userID, c)
	if err != nil {
		return err
	}

	payload := IssueCommentAddedPayload{*userID, *issueID}
	err = s.broadcastEvent(IssueCommentAdded, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) AddIssueStatus(i *IssueStatus) error {
	// TODO: Validation for AddIssueStatus
	// err = validateAddIssueStatus(*i)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.AddIssueStatus(i)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) AddPriorityType(pt *PriorityType) error {
	// TODO: Validation for AddPriorityType
	// err = validateAddPriorityType(*pt)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.AddPriorityType(pt)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) AddProject(userID *string, p *Project) (err error) {
	err = validateAddProject(p)
	if err != nil {
		return err
	}
	err = s.repo.AddProject(p)
	if err != nil {
		return err
	}

	payload := ProjectAddedPayload{*userID}
	err = s.broadcastEvent(ProjectAdded, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) AddProjectBoardSprint(userID *string, projectID *string, boardID *string) error {
	// TODO: Validation for AddProjectBoardSprint
	// err = validateAddProject(p)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.AddProjectBoardSprint(projectID, boardID, userID)
	if err != nil {
		return err
	}

	payload := ProjectBoardSprintAddedPayload{*userID, *projectID, *boardID}
	err = s.broadcastEvent(ProjectBoardSprintAdded, payload)
	if err != nil {
		return err
	}

	return nil
}

// func (s *service) AddUser(u *User) error {
// 	var err error

// 	// Validate user
// 	err = validateAddUser(*u)
// 	if err != nil {
// 		return err
// 	}

// 	// Add the user
// 	err = s.repo.AddUser(u)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

func (s *service) broadcastEvent(eventType EventType, payload interface{}) error {
	m := Message{Type: eventType, Payload: payload}
	b, err := json.Marshal(m)
	if err != nil {
		return err
	}

	s.hub.Broadcast <- b

	return nil
}
