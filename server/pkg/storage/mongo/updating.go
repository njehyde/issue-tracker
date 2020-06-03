package mongo

import (
	"errors"
	"fmt"
	"time"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/updating"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DecreaseIssueStatus updates the ordinal position of an issue status entity, as well as one or more of its siblings.
func (s *Storage) DecreaseIssueStatus(id string) error {
	var term string
	var issueStatuses []IssueStatus

	// Get all the issue statuses in one request
	issueStatuses, err := s.repo.GetIssueStatuses(&term, -1)
	if err != nil {
		return err
	}

	// Get the issue status for the given id
	var inc IssueStatus = IssueStatus{}
	var dec IssueStatus = IssueStatus{}
	var previousOrdinal int32

	for i := range issueStatuses {
		if issueStatuses[i].ID == id {
			dec = issueStatuses[i]
			previousOrdinal = dec.Ordinal - 1
		}
		if (IssueStatus{}) != dec && issueStatuses[i].Ordinal == previousOrdinal {
			inc = issueStatuses[i]
			break
		}
	}

	if (IssueStatus{}) == dec {
		return errors.New("Issue status " + id + " not found")
	}
	if (IssueStatus{}) == inc {
		return fmt.Errorf("Cannot decrement issue status %v as it is the first ordinal in the sequence", id)
	}

	if (IssueStatus{}) != dec {
		err = s.repo.SwitchIssueStatusOrdinals(&inc, &dec)
	}

	return nil
}

// DecreasePriorityType updates the ordinal position of an priority type entity, as well as one or more of its siblings.
func (s *Storage) DecreasePriorityType(id string) error {
	var priorityTypes []PriorityType

	// Get all the priority types in one request
	priorityTypes, err := s.repo.GetPriorityTypes(-1)
	if err != nil {
		return err
	}

	// Get the priority type for the given id
	var inc PriorityType = PriorityType{}
	var dec PriorityType = PriorityType{}
	var previousOrdinal int32

	for i := range priorityTypes {
		if priorityTypes[i].ID == id {
			dec = priorityTypes[i]
			previousOrdinal = dec.Ordinal - 1
		}
		if (PriorityType{}) != dec && priorityTypes[i].Ordinal == previousOrdinal {
			inc = priorityTypes[i]
			break
		}
	}

	if (PriorityType{}) == dec {
		return errors.New("Priority type " + id + " not found")
	}
	if (PriorityType{}) == inc {
		return fmt.Errorf("Cannot decrement priority type %v as it is the first ordinal in the sequence", id)
	}

	if (PriorityType{}) != dec {
		err = s.repo.SwitchPriorityTypeOrdinals(&inc, &dec)
	}

	return nil
}

// IncreaseIssueStatus updates the ordinal position of an issue status entity, as well as one or more of its siblings.
func (s *Storage) IncreaseIssueStatus(id string) error {
	var term string
	var issueStatuses []IssueStatus

	// Get all the issue statuses in one request
	issueStatuses, err := s.repo.GetIssueStatuses(&term, 1)
	if err != nil {
		return err
	}

	// Get the issue status for the given id
	var inc IssueStatus = IssueStatus{}
	var dec IssueStatus = IssueStatus{}
	var nextOrdinal int32

	for i := range issueStatuses {
		if issueStatuses[i].ID == id {
			inc = issueStatuses[i]
			nextOrdinal = inc.Ordinal + 1
		}
		if (IssueStatus{}) != inc && issueStatuses[i].Ordinal == nextOrdinal {
			dec = issueStatuses[i]
			break
		}
	}

	if (IssueStatus{}) == inc {
		return errors.New("Issue status " + id + " not found")
	}
	if (IssueStatus{}) == dec {
		return fmt.Errorf("Cannot increment issue status %v as it is the last ordinal in the sequence", id)
	}

	if (IssueStatus{}) != dec {
		err = s.repo.SwitchIssueStatusOrdinals(&inc, &dec)
	}

	return nil
}

// IncreasePriorityType updates the ordinal position of an priority type entity, as well as one or more of its siblings.
func (s *Storage) IncreasePriorityType(id string) error {
	var priorityTypes []PriorityType

	// Get all the priority type in one request
	priorityTypes, err := s.repo.GetPriorityTypes(1)
	if err != nil {
		return err
	}

	// Get the priority type for the given id
	var inc PriorityType = PriorityType{}
	var dec PriorityType = PriorityType{}
	var nextOrdinal int32

	for i := range priorityTypes {
		if priorityTypes[i].ID == id {
			inc = priorityTypes[i]
			nextOrdinal = inc.Ordinal + 1
		}
		if (PriorityType{}) != inc && priorityTypes[i].Ordinal == nextOrdinal {
			dec = priorityTypes[i]
			break
		}
	}

	if (PriorityType{}) == inc {
		return errors.New("Priority type " + id + " not found")
	}
	if (PriorityType{}) == dec {
		return fmt.Errorf("Cannot increment priority type %v as it is the last ordinal in the sequence", id)
	}

	if (PriorityType{}) != dec {
		err = s.repo.SwitchPriorityTypeOrdinals(&inc, &dec)
	}

	return nil
}

// SendIssueToSprint sends an issue to the bottom of the backlog, and reassigns backlog issue ordinal positions.
func (s *Storage) SendIssueToSprint(projectID *string, sprintID *string, issueID *string, d *updating.SendIssueToSprintMetadata) error {
	projectIDAsObjectID, err := primitive.ObjectIDFromHex(*projectID)
	if err != nil {
		return err
	}

	sprintIDAsObjectID, err := primitive.ObjectIDFromHex(*sprintID)
	if err != nil {
		return err
	}

	issueIDAsObjectID, err := primitive.ObjectIDFromHex(*issueID)
	if err != nil {
		return err
	}

	issue, err := s.repo.GetIssue(issueIDAsObjectID)
	if err != nil {
		return err
	}

	shouldCleanBacklogOrdinals := issue.SprintID.IsZero()

	count, err := s.repo.CountProjectSprintIssues(&projectIDAsObjectID, &sprintIDAsObjectID)
	if err != nil {
		return err
	}

	updateSetMap := bson.M{
		"ordinal":  int32(count),
		"sprintId": sprintIDAsObjectID,
	}

	if d != nil && len(d.Status) > 0 {
		slog.Infof("Setting status to %v", d.Status)
		updateSetMap["status"] = d.Status
	}

	update := bson.M{
		"$set": updateSetMap,
	}

	err = s.repo.UpdateIssue(issueIDAsObjectID, update)
	if err != nil {
		return err
	}

	if shouldCleanBacklogOrdinals {
		err = s.CleanBacklogIssueOrdinals(&projectIDAsObjectID)
		if err != nil {
			return err
		}
	} else {
		err = s.CleanSprintIssueOrdinals(&projectIDAsObjectID, &issue.SprintID)
		if err != nil {
			return err
		}
	}

	return nil
}

// SendIssueToBottomOfBacklog sends an issue to the bottom of the backlog, and reassigns backlog issue ordinal positions.
func (s *Storage) SendIssueToBottomOfBacklog(projectID *string, issueID *string) error {
	projectIDAsObjectID, err := primitive.ObjectIDFromHex(*projectID)
	if err != nil {
		return err
	}

	issueIDAsObjectID, err := primitive.ObjectIDFromHex(*issueID)
	if err != nil {
		return err
	}

	issue, err := s.repo.GetIssue(issueIDAsObjectID)
	if err != nil {
		return err
	}

	shouldCleanSprintOrdinals := !issue.SprintID.IsZero()

	// Get all backlog issues (sorted by ordinal, ascending)
	issues, _, err := s.repo.GetProjectBacklogIssues(&projectIDAsObjectID, nil, nil)
	if err != nil {
		return err
	}

	updatesMap := make(map[primitive.ObjectID]interface{})

	prevOrdinal := 0
	for _, issue := range *issues {
		if issue.ID != issueIDAsObjectID {
			updatesMap[issue.ID] = bson.M{
				"$set": bson.M{
					"ordinal":  int32(prevOrdinal),
					"sprintId": nil,
				},
			}
			prevOrdinal++
		}
	}

	updatesMap[issueIDAsObjectID] = bson.M{
		"$set": bson.M{
			"ordinal":  int32(len(updatesMap)),
			"sprintId": nil,
		},
	}

	err = s.repo.UpdateIssues(updatesMap)
	if err != nil {
		return err
	}

	if shouldCleanSprintOrdinals {
		err = s.CleanSprintIssueOrdinals(&projectIDAsObjectID, &issue.SprintID)
		if err != nil {
			return err
		}
	}

	return nil
}

// SendIssueToTopOfBacklog sends an issue to the top of the backlog, and reassigns backlog issue ordinal positions.
func (s *Storage) SendIssueToTopOfBacklog(projectID *string, issueID *string) error {
	projectIDAsObjectID, err := primitive.ObjectIDFromHex(*projectID)
	if err != nil {
		return err
	}

	issueIDAsObjectID, err := primitive.ObjectIDFromHex(*issueID)
	if err != nil {
		return err
	}

	issue, err := s.repo.GetIssue(issueIDAsObjectID)
	if err != nil {
		return err
	}

	shouldCleanSprintOrdinals := !issue.SprintID.IsZero()

	// Get all backlog issues (sorted by ordinal, ascending)
	issues, _, err := s.repo.GetProjectBacklogIssues(&projectIDAsObjectID, nil, nil)
	if err != nil {
		return err
	}

	updatesMap := make(map[primitive.ObjectID]interface{})
	updatesMap[issueIDAsObjectID] = bson.M{
		"$set": bson.M{
			"ordinal":  int32(0),
			"sprintId": nil,
		},
	}

	prevOrdinal := 1
	for _, issue := range *issues {
		if issue.ID != issueIDAsObjectID {
			updatesMap[issue.ID] = bson.M{
				"$set": bson.M{
					"ordinal":  int32(prevOrdinal),
					"sprintId": nil,
				},
			}
			prevOrdinal++
		}
	}

	err = s.repo.UpdateIssues(updatesMap)
	if err != nil {
		return err
	}

	if shouldCleanSprintOrdinals {
		err = s.CleanSprintIssueOrdinals(&projectIDAsObjectID, &issue.SprintID)
		if err != nil {
			return err
		}
	}

	return nil
}

// SendSprintIssuesToBacklog ...
func (s *Storage) SendSprintIssuesToBacklog(projectID *primitive.ObjectID, sprintID *primitive.ObjectID) error {
	issues, _, err := s.repo.GetProjectSprintIssues(projectID, sprintID, nil, nil)
	if err != nil {
		return err
	}

	count, err := s.repo.CountProjectBacklogIssues(projectID)
	if err != nil {
		return err
	}

	updatesMap := make(map[primitive.ObjectID]interface{})
	prevOrdinal := int32(count)

	for _, issue := range *issues {
		updatesMap[issue.ID] = bson.M{
			"$set": bson.M{
				"ordinal":  int32(prevOrdinal),
				"sprintId": nil,
			},
		}
		prevOrdinal++
	}

	// Send all sprint issues to the bottom of the backlog
	err = s.repo.UpdateIssues(updatesMap)
	if err != nil {
		return err
	}

	return nil
}

// CleanBacklogIssueOrdinals ...
func (s *Storage) CleanBacklogIssueOrdinals(projectID *primitive.ObjectID) error {
	slog.Infof("Cleaning backlog issue ordinals")
	issues, _, err := s.repo.GetProjectBacklogIssues(projectID, nil, nil)
	if err != nil {
		return err
	}

	updatesMap := make(map[primitive.ObjectID]interface{})
	prevOrdinal := 0
	for _, issue := range *issues {
		updatesMap[issue.ID] = bson.M{
			"$set": bson.M{
				"ordinal": int32(prevOrdinal),
			},
		}
		prevOrdinal++
	}

	// Send all sprint issues to the bottom of the backlog
	err = s.repo.UpdateIssues(updatesMap)
	if err != nil {
		return err
	}

	return nil
}

// CleanSprintIssueOrdinals ...
func (s *Storage) CleanSprintIssueOrdinals(projectID *primitive.ObjectID, sprintID *primitive.ObjectID) error {
	issues, _, err := s.repo.GetProjectSprintIssues(projectID, sprintID, nil, nil)
	if err != nil {
		return err
	}

	updatesMap := make(map[primitive.ObjectID]interface{})
	for i, issue := range *issues {
		updatesMap[issue.ID] = bson.M{
			"$set": bson.M{
				"ordinal": int32(i),
			},
		}
	}

	// Send all sprint issues to the bottom of the backlog
	err = s.repo.UpdateIssues(updatesMap)
	if err != nil {
		return err
	}

	return nil
}

// UpdateIssue updates an issue entity in the database's "issues" collection.
func (s *Storage) UpdateIssue(projectID *string, issueID *string, i *updating.Issue) error {

	projectIDAsObjectID, err := primitive.ObjectIDFromHex(*projectID)
	if err != nil {
		return err
	}

	issueIDAsObjectID, err := primitive.ObjectIDFromHex(*issueID)
	if err != nil {
		return err
	}

	// Load original issue
	originalIssue, err := s.repo.GetIssue(issueIDAsObjectID)
	if err != nil {
		return err
	}

	assigneeIDAsObjectID, err := primitive.ObjectIDFromHex(i.AssigneeID)
	if err != nil {
		return err
	}

	var sprintIDAsObjectID = *&primitive.NilObjectID
	if len(i.SprintID) > 0 {
		sprintIDAsObjectID, err = primitive.ObjectIDFromHex(i.SprintID)
		if err != nil {
			return err
		}
	}

	setMap := bson.M{
		"type":        i.Type,
		"summary":     i.Summary,
		"description": i.Description,
		"status":      i.Status,
		"priority":    i.Priority,
		"points":      i.Points,
		"assigneeId":  assigneeIDAsObjectID,
		"updatedAt":   time.Now(),
	}
	unsetMap := bson.M{}

	if !sprintIDAsObjectID.IsZero() {
		setMap["sprintId"] = sprintIDAsObjectID
	} else {
		unsetMap["sprintId"] = sprintIDAsObjectID
	}

	update := bson.M{
		"$set": setMap,
	}
	if len(unsetMap) > 0 {
		update["$unset"] = unsetMap
	}

	err = s.repo.UpdateIssue(issueIDAsObjectID, update)
	if err != nil {
		return err
	}

	slog.Infof("original ordinal: %v, new ordinal: %v", originalIssue.Ordinal, i.Ordinal)

	// Do the original and updating ordinals differ
	// if originalIssue.Ordinal != i.Ordinal {
	var siblingIssues *[]Issue

	if &i.SprintID != nil {
		siblingIssues, _, err = s.repo.GetProjectSprintIssues(&projectIDAsObjectID, &sprintIDAsObjectID, nil, nil)
	} else {
		siblingIssues, _, err = s.repo.GetProjectBacklogIssues(&projectIDAsObjectID, nil, nil)
	}

	updatesMap := make(map[primitive.ObjectID]interface{})
	updatesMap[issueIDAsObjectID] = bson.M{
		"$set": bson.M{
			"ordinal": i.Ordinal,
		},
	}
	slog.Infof("Adding %v with ordinal %v to updates map", issueIDAsObjectID.Hex(), i.Ordinal)

	if len(*siblingIssues) > 1 {
		directionOffset := -1

		for _, issue := range *siblingIssues {
			if issue.ID == issueIDAsObjectID && issue.Ordinal > i.Ordinal {
				directionOffset = 0
				break
			}
		}

		ordinalOffset := 0
		ordinal := 0

		for _, issue := range *siblingIssues {
			if ordinalOffset == 0 && (issue.Ordinal+int32(directionOffset)) >= i.Ordinal && issue.ID != issueIDAsObjectID {
				ordinalOffset = 1
			} else if ordinalOffset == 1 && issue.ID == issueIDAsObjectID {
				ordinalOffset = 0
			}

			if issue.ID != issueIDAsObjectID {
				slog.Infof("Adding %v with ordinal %v to updates map", issue.ID.Hex(), int32(ordinal+ordinalOffset))
				updatesMap[issue.ID] = bson.M{
					"$set": bson.M{
						"ordinal": int32(ordinal + ordinalOffset),
					},
				}
				ordinal++
			}
		}
		// }

		err = s.repo.UpdateIssues(updatesMap)
		if err != nil {
			return err
		}
	}

	return nil
}

// UpdateIssueOrdinals ...
func (s *Storage) UpdateIssueOrdinals(projectID *string, issueOrdinals *[]updating.IssueOrdinal) error {
	if len(*issueOrdinals) > 0 {
		updatesMap := make(map[primitive.ObjectID]interface{})

		for _, issueOrdinal := range *issueOrdinals {
			issueIDAsObjectID, err := primitive.ObjectIDFromHex(issueOrdinal.ID)
			if err != nil {
				return err
			}

			updatesMap[issueIDAsObjectID] = bson.M{
				"$set": bson.M{
					"ordinal": issueOrdinal.Ordinal,
					"status":  issueOrdinal.Status,
				},
			}
		}

		err := s.repo.UpdateIssues(updatesMap)
		if err != nil {
			return err
		}
	}

	return nil
}

// UpdateIssueComment updates an issue comment entity in the database's "issue_comments" collection.
func (s *Storage) UpdateIssueComment(issueID *string, commentID *string, ic *updating.IssueComment) error {
	issueIDAsObjectID, err := primitive.ObjectIDFromHex(*issueID)
	if err != nil {
		return err
	}

	commentIDAsObjectID, err := primitive.ObjectIDFromHex(*commentID)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"text":      ic.Text,
			"updatedAt": time.Now(),
		},
	}

	err = s.repo.UpdateIssueComment(&issueIDAsObjectID, &commentIDAsObjectID, &update)
	if err != nil {
		return err
	}

	return nil
}

// UpdateIssueStatus updates an issue status entity in the database's "issue_statuses" collection.
func (s *Storage) UpdateIssueStatus(ID string, i *updating.IssueStatus) error {
	update := bson.M{
		"$set": bson.M{
			"name":        i.Name,
			"description": i.Description,
			"categoryId":  i.Category,
		},
	}

	err := s.repo.UpdateIssueStatus(ID, update)
	if err != nil {
		return err
	}

	return nil
}

// UpdatePriorityType updates a priority type entity in the database's "priority_types" collection.
func (s *Storage) UpdatePriorityType(ID string, pt *updating.PriorityType) error {
	update := bson.M{
		"$set": bson.M{
			"name":        pt.Name,
			"description": pt.Description,
			"color":       pt.Color,
		},
	}

	err := s.repo.UpdatePriorityType(ID, update)
	if err != nil {
		return err
	}

	return nil
}

// UpdateProject updates a project entity in the database's "projects" collection.
func (s *Storage) UpdateProject(id string, p *updating.Project) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"name":              p.Name,
			"type":              p.Type,
			"description":       p.Description,
			"leadId":            p.LeadID,
			"defaultAssigneeId": p.DefaultAssigneeID,
			"updatedAt":         time.Now(),
		},
	}

	err = s.repo.UpdateProject(objectID, update)
	if err != nil {
		return err
	}

	return nil
}

// UpdateProjectBoardSprint updates a sprint child entity of a target board in the database's "boards" collection.
func (s *Storage) UpdateProjectBoardSprint(projectID *string, boardID *string, sprintID *string, sprint *updating.Sprint) error {
	var err error

	// Get project id as an ObjectID
	projectIDAsObjectID, err := primitive.ObjectIDFromHex(*projectID)
	if err != nil {
		return err
	}

	// Load the project
	project, err := s.repo.GetProject(projectIDAsObjectID)
	if err != nil {
		return err
	}

	// Get board id as an ObjectID
	boardIDAsObjectID, err := primitive.ObjectIDFromHex(*boardID)
	if err != nil {
		return err
	}

	// TODO: Refactor to generic get project board function
	// Check that there are project board references
	if len(project.Boards) == 0 {
		return fmt.Errorf("Board %v not found for project %v", *projectID, *boardID)
	}
	// Load the board entity if there is a match in the project boards references array
	for _, b := range project.Boards {
		if b == boardIDAsObjectID {
			board, err := s.repo.GetBoard(&boardIDAsObjectID)
			if err != nil {
				return err
			}
			if board == nil {
				return fmt.Errorf("Board %v not found", boardID)
			}

			break
		}
	}

	// Get sprint id as an ObjectID
	sprintIDAsObjectID, err := primitive.ObjectIDFromHex(*sprintID)
	if err != nil {
		return err
	}

	updatedSprint := bson.D{
		{Key: "sprints.$.name", Value: sprint.Name},
		{Key: "sprints.$.goal", Value: sprint.Goal},
		{Key: "sprints.$.startAt", Value: sprint.StartAt},
		{Key: "sprints.$.endAt", Value: sprint.EndAt},
	}

	// Add the sprint to the board
	err = s.repo.UpdateBoardSprint(&boardIDAsObjectID, &sprintIDAsObjectID, &updatedSprint)
	if err != nil {
		return err
	}

	return nil
}

// UpdateProjectCounter updates a project counter entity in the database's "project_counters" collection.
func (s *Storage) UpdateProjectCounter(ID string) (int64, error) {
	var count int64

	update := bson.M{
		"$inc": bson.M{
			"counter": 1,
		},
	}

	err := s.repo.UpdateProjectCounter(ID, update)
	if err != nil {
		return count, err
	}

	pc, err := s.repo.GetProjectCounter(ID)
	if err != nil {
		return count, err
	}

	count = pc.Counter

	return count, err
}
