package mongo

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DeleteIssue ...
func (s *Storage) DeleteIssue(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	err = s.repo.DeleteIssue(objectID)
	if err != nil {
		return err
	}

	return nil
}

// DeleteIssueComment ...
func (s *Storage) DeleteIssueComment(issueID *string, commentID *string) error {
	issueIDAsObjectID, err := primitive.ObjectIDFromHex(*issueID)
	if err != nil {
		return err
	}

	commentIDAsObjectID, err := primitive.ObjectIDFromHex(*commentID)
	if err != nil {
		return err
	}

	err = s.repo.DeleteIssueComment(&issueIDAsObjectID, &commentIDAsObjectID)
	if err != nil {
		return err
	}

	return nil
}

// DeleteProject ...
func (s *Storage) DeleteProject(ID string) error {
	objectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		return err
	}

	err = s.repo.DeleteProject(objectID)
	if err != nil {
		return err
	}

	return nil
}

// DeleteProjectBoardSprint ...
func (s *Storage) DeleteProjectBoardSprint(projectID *string, boardID *string, sprintID *string) error {
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
	// var board *Board
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

	// Send any related sprint issues to the bottom of the backlog
	err = s.SendSprintIssuesToBacklog(&projectIDAsObjectID, &sprintIDAsObjectID)
	if err != nil {
		return err
	}

	// Clean all the backlog issue ordinals
	err = s.CleanBacklogIssueOrdinals(&projectIDAsObjectID)
	if err != nil {
		return err
	}

	// Delete the sprint from the board
	err = s.repo.DeleteBoardSprint(&boardIDAsObjectID, &sprintIDAsObjectID)
	if err != nil {
		return err
	}

	return nil
}
