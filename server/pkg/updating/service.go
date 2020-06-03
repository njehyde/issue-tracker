package updating

import (
	"encoding/json"

	"github.com/njehyde/issue-tracker/pkg/http/ws"
)

// Service provides entity updating operations
type Service interface {
	// DecreaseIssueStatus updates the ordinal position of an issue status entity, as well as one or more of its siblings.
	DecreaseIssueStatus(string) error
	// DecreasePriorityType updates the ordinal position of an priority type entity, as well as one or more of its siblings.
	DecreasePriorityType(string) error
	// IncreaseIssueStatus updates the ordinal position of an issue status entity, as well as one or more of its siblings.
	IncreaseIssueStatus(string) error
	// IncreasePriorityType updates the ordinal position of an priority type entity, as well as one or more of its siblings.
	IncreasePriorityType(string) error
	// SendIssueToSprint sends an issue to a sprint.
	SendIssueToSprint(*string, *string, *string, *string, *SendIssueToSprintMetadata) error
	// SendIssueToBottomOfBacklog sends an issue to the bottom of the backlog, and reassigns backlog issue ordinal positions.
	SendIssueToBottomOfBacklog(*string, *string, *string) error
	// SendIssueToTopOfBacklog sends an issue to the top of the backlog, and reassigns backlog issue ordinal positions.
	SendIssueToTopOfBacklog(*string, *string, *string) error
	// UpdateIssue updates an issue entity.
	UpdateIssue(*string, *string, *string, *Issue) error
	// UpdateIssueOrdinals ...
	UpdateIssueOrdinals(*string, *string, *[]IssueOrdinal) error
	// UpdateIssueComment updates an issue comment entity.
	UpdateIssueComment(*string, *string, *string, *IssueComment) error
	// UpdateIssueStatus updates an issue status entity.
	UpdateIssueStatus(string, *IssueStatus) error
	// UpdatePriorityType updates a priority type entity.
	UpdatePriorityType(string, *PriorityType) error
	// UpdateProject updates a project entity.
	UpdateProject(*string, string, *Project) error
	// UpdateProjectBoardSprint updates a project board sprint entity.
	UpdateProjectBoardSprint(*string, *string, *string, *string, *Sprint) error
}

// Repository provides access to issue repository
type Repository interface {
	// DecreaseIssueStatus updates the ordinal position of an issue status entity, as well as one or more of its siblings.
	DecreaseIssueStatus(string) error
	// DecreasePriorityType updates the ordinal position of an priority type entity, as well as one or more of its siblings.
	DecreasePriorityType(string) error
	// IncreaseIssueStatus updates the ordinal position of an issue status entity, as well as one or more of its siblings.
	IncreaseIssueStatus(string) error
	// IncreasePriorityType updates the ordinal position of an priority type entity, as well as one or more of its siblings.
	IncreasePriorityType(string) error
	// SendIssueToSprint sends an issue to a sprint.
	SendIssueToSprint(*string, *string, *string, *SendIssueToSprintMetadata) error
	// SendIssueToBottomOfBacklog sends an issue to the bottom of the backlog, and reassigns backlog issue ordinal positions.
	SendIssueToBottomOfBacklog(*string, *string) error
	// SendIssueToTopOfBacklog sends an issue to the top of the backlog, and reassigns backlog issue ordinal positions.
	SendIssueToTopOfBacklog(*string, *string) error
	// UpdateIssue updates an issue entity in storage.
	UpdateIssue(*string, *string, *Issue) error
	// UpdateIssueOrdinals ...
	UpdateIssueOrdinals(*string, *[]IssueOrdinal) error
	// UpdateIssueComment updates an issue comment entity in storage.
	UpdateIssueComment(*string, *string, *IssueComment) error
	// UpdateIssueStatus updates an issue status entity in storage.
	UpdateIssueStatus(string, *IssueStatus) error
	// UpdatePriorityType updates a priority type entity in storage.
	UpdatePriorityType(string, *PriorityType) error
	// UpdateProject updates a project entity in storage.
	UpdateProject(string, *Project) error
	// UpdateProjectBoardSprint updates a project board sprint entity in storage.
	UpdateProjectBoardSprint(*string, *string, *string, *Sprint) error
}

type service struct {
	repo Repository
	hub  *ws.Hub
}

// NewService creates an updating service with the necessary dependencies
func NewService(r Repository, hub *ws.Hub) Service {
	return &service{r, hub}
}

func (s *service) DecreaseIssueStatus(id string) error {
	err := s.repo.DecreaseIssueStatus(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) DecreasePriorityType(id string) error {
	err := s.repo.DecreasePriorityType(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) IncreaseIssueStatus(id string) error {
	err := s.repo.IncreaseIssueStatus(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) IncreasePriorityType(id string) error {
	err := s.repo.IncreasePriorityType(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) SendIssueToSprint(userID *string, projectID *string, sprintID *string, issueID *string, d *SendIssueToSprintMetadata) error {
	// TODO: Validation for SendIssueToSprint
	// err = validateSendIssueToBottomOfBacklog(projectID, issueID)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.SendIssueToSprint(projectID, sprintID, issueID, d)
	if err != nil {
		return err
	}

	payload := IssueUpdatedPayload{*userID, *projectID, *issueID}
	err = s.broadcastEvent(IssueUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) SendIssueToBottomOfBacklog(userID *string, projectID *string, issueID *string) error {
	// TODO: Validation for SendIssueToBottomOfBacklog
	// err = validateSendIssueToBottomOfBacklog(projectID, issueID)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.SendIssueToBottomOfBacklog(projectID, issueID)
	if err != nil {
		return err
	}

	payload := IssueUpdatedPayload{*userID, *projectID, *issueID}
	err = s.broadcastEvent(IssueUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) SendIssueToTopOfBacklog(userID *string, projectID *string, issueID *string) error {
	// TODO: Validation for SendIssueToTopOfBacklog
	// err = validateSendIssueToTopOfBacklog(projectID, issueID)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.SendIssueToTopOfBacklog(projectID, issueID)
	if err != nil {
		return err
	}

	payload := IssueUpdatedPayload{*userID, *projectID, *issueID}
	err = s.broadcastEvent(IssueUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateIssue(userID *string, projectID *string, issueID *string, i *Issue) error {
	// TODO: Validation for UpdateIssue
	// err = validateUpdateIssue(*i)
	// if err != nil {
	// 	return err
	// }

	err := s.repo.UpdateIssue(projectID, issueID, i)
	if err != nil {
		return err
	}

	payload := IssueUpdatedPayload{*userID, *projectID, *issueID}
	err = s.broadcastEvent(IssueUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateIssueOrdinals(userID *string, projectID *string, issueOrdinals *[]IssueOrdinal) error {
	// TODO: Validation for UpdateIssueOrdinals
	// err = validateUpdateIssue(*i)
	// if err != nil {
	// 	return err
	// }

	err := s.repo.UpdateIssueOrdinals(projectID, issueOrdinals)
	if err != nil {
		return err
	}

	payload := ProjectUpdatedPayload{*userID, *projectID}
	err = s.broadcastEvent(ProjectUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateIssueComment(userID *string, issueID *string, commentID *string, ic *IssueComment) error {
	// TODO: Validation for UpdateIssueComment
	// err = validateUpdateIssueComment(issueID, commentID, ic)
	// if err != nil {
	// 	return err
	// }

	err := s.repo.UpdateIssueComment(issueID, commentID, ic)
	if err != nil {
		return err
	}

	payload := IssueCommentUpdatedPayload{*userID, *issueID, *commentID}
	err = s.broadcastEvent(IssueCommentUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateIssueStatus(id string, i *IssueStatus) error {
	// TODO: Validation for UpdateIssueStatus
	// err = validateUpdateIssueStatus(*i)
	// if err != nil {
	// 	return err
	// }

	err := s.repo.UpdateIssueStatus(id, i)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdatePriorityType(id string, pt *PriorityType) error {
	// TODO: Validation for UpdatePriorityType
	// err = validateUpdatePriorityType(*pt)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.UpdatePriorityType(id, pt)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateProject(userID *string, projectID string, p *Project) error {
	// TODO: Validation for UpdateProject
	// err = validateUpdateProject(*p)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.UpdateProject(projectID, p)
	if err != nil {
		return err
	}

	payload := ProjectUpdatedPayload{*userID, projectID}
	err = s.broadcastEvent(ProjectUpdated, payload)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateProjectBoardSprint(userID *string, projectID *string, boardID *string, sprintID *string, sprint *Sprint) error {
	// TODO: Validation for UpdateProjectBoardSprint
	// err = validateUpdateProject(*p)
	// if err != nil {
	// 	return err
	// }
	err := s.repo.UpdateProjectBoardSprint(projectID, boardID, sprintID, sprint)
	if err != nil {
		return err
	}

	payload := ProjectBoardSprintUpdatedPayload{*userID, *projectID, *boardID, *sprintID}
	err = s.broadcastEvent(ProjectBoardSprintUpdated, payload)
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
