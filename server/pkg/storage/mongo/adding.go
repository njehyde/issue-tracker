package mongo

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/njehyde/issue-tracker/pkg/adding"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AddBoard adds a board entity to the database's "boards" collection.
func (s *Storage) AddBoard(b *adding.Board) (primitive.ObjectID, error) {
	var objectID primitive.ObjectID

	// Get the board template for the type
	bt, err := s.repo.GetBoardTemplate(&b.Type)
	if bt == nil {
		return objectID, fmt.Errorf("Failed to get board template for id %v", &b.Type)
	}
	if err != nil {
		return objectID, err
	}

	// Get the workflow for the board
	w, err := s.repo.GetWorkflow(&bt.WorkflowID)
	if w == nil {
		return objectID, fmt.Errorf("Failed to get workflow for id %v", &bt.WorkflowID)
	}
	if err != nil {
		return objectID, err
	}

	// Set the board columns
	var columns = []BoardColumn{}
	for _, c := range w.Steps {
		c := BoardColumn{
			Name:          c.Name,
			Ordinal:       c.Ordinal,
			IssueStatuses: c.StatusIds,
		}
		columns = append(columns, c)
	}

	board := Board{
		Type:             b.Type,
		Name:             bt.Name,
		IsBacklogVisible: bt.IsBacklogVisible,
		IsBoardVisible:   bt.IsBoardVisible,
		Issues:           []primitive.ObjectID{},
		Columns:          columns,
	}

	if bt.IsSprintable {
		board.Sprints = []Sprint{}
	}

	err = s.repo.AddBoard(&board)
	if err != nil {
		return objectID, err
	}

	objectID = board.ID

	return objectID, nil
}

// AddIssue adds an issue entity to the database's "issues" collection.
func (s *Storage) AddIssue(i *adding.Issue) error {

	// Load project to get the key
	project, err := s.GetProjectByID(i.ProjectID)
	if err != nil {
		return err
	}

	// Increment project counter, then get the counter value
	count, err := s.UpdateProjectCounter(project.Key)

	// Combine the key and the counter to form an issue reference
	projectRef := project.Key + "-" + strconv.FormatInt(count, 10)

	// Sort out the labels
	var newLabels []Label
	var labels []string

	if len(i.Labels) > 0 {
		for _, label := range i.Labels {
			if label.IsNew {
				l := Label{Label: label.Value}
				newLabels = append(newLabels, l)
			}
			labels = append(labels, label.Value)
		}
	}

	if err = s.repo.AddLabels(&newLabels); err != nil {
		return err
	}

	var projectIDAsObjectID primitive.ObjectID
	if projectIDAsObjectID, err = primitive.ObjectIDFromHex(i.ProjectID); err != nil {
		return err
	}

	var reporterIDAsObjectID primitive.ObjectID
	if reporterIDAsObjectID, err = primitive.ObjectIDFromHex(i.ReporterID); err != nil {
		return err
	}

	var assigneeIDAsObjectID primitive.ObjectID
	if assigneeIDAsObjectID, err = primitive.ObjectIDFromHex(i.AssigneeID); err != nil {
		return err
	}

	newIssue := Issue{
		ProjectID:   projectIDAsObjectID,
		ProjectRef:  projectRef,
		Type:        i.Type,
		Summary:     i.Summary,
		Description: i.Description,
		Status:      i.Status,
		Priority:    i.Priority,
		Points:      i.Points,
		Labels:      labels,
		ReporterID:  reporterIDAsObjectID,
		AssigneeID:  assigneeIDAsObjectID,
	}

	err = s.repo.AddIssue(&newIssue)
	if err != nil {
		return err
	}

	return nil
}

// AddIssueComment adds an issue comment to the database's "issue_comments" collection.
func (s *Storage) AddIssueComment(issueID *string, userID *string, c *adding.IssueComment) error {
	var err error

	var issueIDAsObjectID primitive.ObjectID
	if issueIDAsObjectID, err = primitive.ObjectIDFromHex(*issueID); err != nil {
		return err
	}

	var userIDAsObjectID primitive.ObjectID
	if userIDAsObjectID, err = primitive.ObjectIDFromHex(*userID); err != nil {
		return err
	}

	newIssueComment := IssueComment{
		Text:      c.Text,
		IssueID:   issueIDAsObjectID,
		CreatedBy: userIDAsObjectID,
	}

	err = s.repo.AddIssueComment(&newIssueComment)
	if err != nil {
		return err
	}

	return nil
}

// AddIssueStatus adds an issue status entity to the database's "issue_statuses" collection.
func (s *Storage) AddIssueStatus(is *adding.IssueStatus) error {

	lastOrdinal, err := s.GetLastIssueStatusOrdinal()
	if err != nil {
		return err
	}

	ID := strings.ToUpper(strings.ReplaceAll(is.Name, " ", "_"))
	ordinal := lastOrdinal + 1

	issueStatus := IssueStatus{
		ID:          ID,
		Name:        is.Name,
		Description: is.Description,
		CategoryID:  is.Category,
		Ordinal:     ordinal,
	}

	err = s.repo.AddIssueStatus(&issueStatus)
	if err != nil {
		return err
	}

	return nil
}

// AddPriorityType adds an priority type entity to the database's "priority_types" collection.
func (s *Storage) AddPriorityType(pt *adding.PriorityType) error {

	lastOrdinal, err := s.GetLastPriorityTypeOrdinal()

	ID := strings.ToUpper(strings.ReplaceAll(pt.Name, " ", "_"))
	ordinal := lastOrdinal + 1

	priorityType := PriorityType{
		ID:          ID,
		Name:        pt.Name,
		Description: pt.Description,
		Color:       pt.Color,
		Ordinal:     ordinal,
	}

	err = s.repo.AddPriorityType(&priorityType)
	if err != nil {
		return err
	}

	return nil
}

// AddProject ...
func (s *Storage) AddProject(p *adding.Project) error {
	var err error

	// Add the default board for the project
	b := adding.Board{Type: p.DefaultBoardType}

	boardID, err := s.AddBoard(&b)
	if err != nil {
		return err
	}

	boards := []primitive.ObjectID{boardID}

	var leadIDAsObjectID primitive.ObjectID
	if leadIDAsObjectID, err = primitive.ObjectIDFromHex(p.LeadID); err != nil {
		return err
	}

	var defaultAssigneeIDAsObjectID primitive.ObjectID
	if defaultAssigneeIDAsObjectID, err = primitive.ObjectIDFromHex(p.DefaultAssigneeID); err != nil {
		return err
	}

	project := Project{
		Key:               p.Key,
		Name:              p.Name,
		Type:              p.Type,
		Description:       p.Description,
		LeadID:            leadIDAsObjectID,
		DefaultAssigneeID: defaultAssigneeIDAsObjectID,
		DefaultBoardID:    boardID,
		Boards:            boards,
	}

	// Add the project
	err = s.repo.AddProject(&project)
	if err != nil {
		return err
	}

	projectCounter := ProjectCounter{ID: p.Key, Counter: 0}

	// Add the associated project counter
	s.repo.AddProjectCounter(&projectCounter)
	if err != nil {
		return err
	}

	return nil
}

// AddProjectBoardSprint adds a sprint child entity to a target board in the database's "boards" collection.
func (s *Storage) AddProjectBoardSprint(projectID *string, boardID *string, userID *string) error {
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

	var userIDAsObjectID primitive.ObjectID
	if userIDAsObjectID, err = primitive.ObjectIDFromHex(*userID); err != nil {
		return err
	}

	// TODO: Refactor to generic get project board function
	// Check that there are project board references
	if len(project.Boards) == 0 {
		return fmt.Errorf("Board %v not found for project %v", *projectID, *boardID)
	}

	// Load the board entity if there is a match in the project boards references array
	var sprintOrdinal int32
	for _, b := range project.Boards {
		if b == boardIDAsObjectID {
			board, err := s.repo.GetBoard(&boardIDAsObjectID)
			if err != nil {
				return err
			}
			if board == nil {
				return fmt.Errorf("Board %v not found", boardID)
			}

			// Calculate the sprint ordinal (based on existing board sprints)
			sprintOrdinal = int32(len(board.Sprints) + 1)
			break
		}
	}

	var sprintName = fmt.Sprintf("Sprint %v", sprintOrdinal)

	// Create the empty sprint
	sprint := Sprint{
		Name:      sprintName,
		Ordinal:   sprintOrdinal,
		CreatedBy: userIDAsObjectID,
	}

	// Add the sprint to the board
	err = s.repo.AddBoardSprint(&boardIDAsObjectID, &sprint)
	if err != nil {
		return err
	}

	return nil
}

// // AddUser ...
// func (s *Storage) AddUser(user *authenticating.User) error {
// 	var err error

// 	filter := bson.M{
// 		"email": user.Email,
// 	}

// 	collection := s.db.Collection("users")

// 	var result bson.M
// 	err = collection.FindOne(context.Background(), filter).Decode(&result)
// 	if err == nil {
// 		return errors.New("User already exists")
// 	}

// 	user.ID = primitive.NewObjectID()

// 	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
// 	user.Password = string(hashedPassword)

// 	now := time.Now()
// 	user.CreatedAt = now
// 	user.UpdatedAt = now

// 	insertResult, err := collection.InsertOne(context.Background(), user)
// 	if err != nil {
// 		return err
// 	}

// 	slog.Infof("Added user: %+v", insertResult)

// 	user.Password = ""

// 	return nil
// }
