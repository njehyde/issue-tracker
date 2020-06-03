package mongo

import (
	"fmt"

	"github.com/njehyde/issue-tracker/pkg/listing"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetBoardTypes returns all board type entities from the respository.
func (s *Storage) GetBoardTypes() (results []listing.BoardType, err error) {
	boardTemplates, err := s.repo.GetBoardTemplates()
	if err != nil {
		return results, err
	}

	results = make([]listing.BoardType, 0)

	for _, bt := range *boardTemplates {
		boardType := listing.BoardType{
			ID:        bt.ID,
			Name:      bt.Name,
			IsDefault: bt.IsDefault,
		}

		results = append(results, boardType)
	}

	return results, nil
}

// GetCategories returns all category entities from the respository.
func (s *Storage) GetCategories() (results []listing.Category, err error) {
	categories, err := s.repo.GetCategories()
	if err != nil {
		return results, err
	}

	results = make([]listing.Category, 0)

	for _, c := range *categories {
		category := listing.Category{
			ID:      c.ID,
			Name:    c.Name,
			Ordinal: c.Ordinal,
		}

		results = append(results, category)
	}

	return results, nil
}

// GetIssue returns an issue entity by id from the repository.
func (s *Storage) GetIssue(id string) (result listing.Issue, err error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return result, err
	}

	i, err := s.repo.GetIssue(objectID)
	if err != nil {
		return result, err
	}

	result = listing.Issue{
		ID:          i.ID.Hex(),
		ProjectID:   i.ProjectID.Hex(),
		SprintID:    getHexFromObjectID(i.SprintID),
		ProjectRef:  i.ProjectRef,
		Type:        i.Type,
		Summary:     i.Summary,
		Description: i.Description,
		Status:      i.Status,
		Priority:    i.Priority,
		Points:      i.Points,
		Ordinal:     i.Ordinal,
		CreatedAt:   i.CreatedAt,
		UpdatedAt:   i.UpdatedAt,
		ReporterID:  i.ReporterID.Hex(),
		AssigneeID:  i.AssigneeID.Hex(),
		Labels:      i.Labels,
	}

	return result, nil
}

// GetIssueComments returns a paginated slice of issue comment entities from the repository.
func (s *Storage) GetIssueComments(issueID *string, p *listing.Pagination) (results []listing.IssueComment, count int64, err error) {
	var cursor primitive.ObjectID = primitive.ObjectID{}

	limit := int64(p.PageSize)

	if len(p.Cursor) > 0 {
		cursor, err = primitive.ObjectIDFromHex(p.Cursor)
		if err != nil {
			return results, count, err
		}
	}

	var issueIDAsObjectID primitive.ObjectID
	if issueIDAsObjectID, err = primitive.ObjectIDFromHex(*issueID); err != nil {
		return results, count, err
	}

	issueComments, count, err := s.repo.GetIssueComments(&issueIDAsObjectID, &cursor, limit)
	if err != nil {
		return results, count, nil
	}

	createdByUsersMap := map[primitive.ObjectID]User{}
	for _, ic := range *issueComments {
		createdBy := ic.CreatedBy
		if _, ok := createdByUsersMap[createdBy]; !ok {
			user, err := s.repo.GetUserByID(&createdBy)
			if err != nil {
				return results, count, err
			}
			createdByUsersMap[createdBy] = *user
		}
	}

	results = make([]listing.IssueComment, 0)

	for _, ic := range *issueComments {
		u := createdByUsersMap[ic.CreatedBy]
		createdBy := listing.User{
			ID:    u.ID.Hex(),
			Email: u.Email,
			Name: listing.UserName{
				FirstName: u.Name.FirstName,
				LastName:  u.Name.LastName,
			},
		}

		issue := listing.IssueComment{
			ID:        ic.ID.Hex(),
			Text:      ic.Text,
			CreatedBy: createdBy,
			CreatedAt: ic.CreatedAt,
			UpdatedAt: ic.UpdatedAt,
		}

		results = append(results, issue)
	}

	if len(results) > 0 {
		lastResult := results[len(results)-1]
		p.Cursor = lastResult.ID
	}

	return results, count, nil
}

// GetIssues returns a paginated slice of issue entities from the repository.
func (s *Storage) GetIssues(p *listing.Pagination) (results []listing.Issue, count int64, err error) {
	var cursor primitive.ObjectID = primitive.ObjectID{}

	limit := int64(p.PageSize)

	if len(p.Cursor) > 0 {
		cursor, err = primitive.ObjectIDFromHex(p.Cursor)
		if err != nil {
			return results, count, err
		}
	}

	issues, count, err := s.repo.GetIssues(&cursor, limit)
	if err != nil {
		return results, count, nil
	}

	results = make([]listing.Issue, 0)

	for _, i := range *issues {
		issue := listing.Issue{
			ID:          i.ID.Hex(),
			ProjectID:   getHexFromObjectID(i.ProjectID),
			SprintID:    getHexFromObjectID(i.SprintID),
			ProjectRef:  i.ProjectRef,
			Type:        i.Type,
			Summary:     i.Summary,
			Description: i.Description,
			Status:      i.Status,
			Priority:    i.Priority,
			Points:      i.Points,
			Ordinal:     i.Ordinal,
			CreatedAt:   i.CreatedAt,
			UpdatedAt:   i.UpdatedAt,
			ReporterID:  getHexFromObjectID(i.ReporterID),
			AssigneeID:  getHexFromObjectID(i.AssigneeID),
			Labels:      i.Labels,
		}

		results = append(results, issue)
	}

	if len(results) > 0 {
		lastResult := results[len(results)-1]
		p.Cursor = lastResult.ID
	}

	return results, count, nil
}

// GetIssueStatuses returns all, or a filtered slice of issue status entities from the repository.
func (s *Storage) GetIssueStatuses(term *string) (results []listing.IssueStatus, err error) {
	issueStatuses, err := s.repo.GetIssueStatuses(term, 1)
	if err != nil {
		return results, err
	}

	results = make([]listing.IssueStatus, 0)

	for _, is := range issueStatuses {
		issueStatus := listing.IssueStatus{
			ID:          is.ID,
			Name:        is.Name,
			Description: is.Description,
			Category:    is.CategoryID,
			Ordinal:     is.Ordinal,
			IsDefault:   is.IsDefault,
		}

		results = append(results, issueStatus)
	}

	return results, nil
}

// GetLastIssueStatusOrdinal returns the last issue status ordinal.
func (s *Storage) GetLastIssueStatusOrdinal() (ordinal int32, err error) {
	issueStatuses, err := s.repo.GetIssueStatuses(nil, -1)
	if err != nil {
		return ordinal, err
	}

	if len(issueStatuses) > 0 {
		ordinal = issueStatuses[0].Ordinal
	}

	return ordinal, nil
}

// GetLastPriorityTypeOrdinal returns the last priority type ordinal.
func (s *Storage) GetLastPriorityTypeOrdinal() (ordinal int32, err error) {
	priorityTypes, err := s.repo.GetPriorityTypes(-1)
	if err != nil {
		return ordinal, err
	}

	if len(priorityTypes) > 0 {
		ordinal = priorityTypes[0].Ordinal
	}

	return ordinal, nil
}

// GetIssueTypes returns all issue type entities from the repository.
func (s *Storage) GetIssueTypes() (results []listing.IssueType, err error) {
	issueTypes, err := s.repo.GetIssueTypes()
	if err != nil {
		return results, err
	}

	results = make([]listing.IssueType, 0)

	for _, it := range *issueTypes {
		issueType := listing.IssueType{
			ID:          it.ID,
			Name:        it.Name,
			Description: it.Description,
			IsDefault:   it.IsDefault,
		}

		results = append(results, issueType)
	}

	return results, nil
}

// GetLabels returns all, or a filtered slice of label entities from the repository.
func (s *Storage) GetLabels(term *string) (results []listing.Label, err error) {
	labels, err := s.repo.GetLabels(term)
	if err != nil {
		return results, err
	}

	results = make([]listing.Label, 0)

	for _, l := range *labels {
		label := listing.Label{
			ID:    l.ID.Hex(),
			Label: l.Label,
		}

		results = append(results, label)
	}

	return results, nil
}

// GetPriorityTypes returns all priority type entities from the repository.
func (s *Storage) GetPriorityTypes() (results []listing.PriorityType, err error) {
	priorityTypes, err := s.repo.GetPriorityTypes(1)
	if err != nil {
		return results, err
	}

	results = make([]listing.PriorityType, 0)

	for _, pt := range priorityTypes {
		priorityType := listing.PriorityType{
			ID:          pt.ID,
			Name:        pt.Name,
			Description: pt.Description,
			Color:       pt.Color,
			Ordinal:     pt.Ordinal,
			IsDefault:   pt.IsDefault,
		}

		results = append(results, priorityType)
	}

	return results, nil
}

func transformProject(p *Project, bs *[]Board) (project listing.Project) {
	boards := []listing.Board{}
	if len(*bs) > 0 {
		for _, b := range *bs {
			board := transformBoard(&b)
			boards = append(boards, *board)
		}
	}

	project = listing.Project{
		ID:                p.ID.Hex(),
		Key:               p.Key,
		Name:              p.Name,
		Type:              p.Type,
		Description:       p.Description,
		LeadID:            getHexFromObjectID(p.LeadID),
		DefaultAssigneeID: getHexFromObjectID(p.DefaultAssigneeID),
		DefaultBoardID:    getHexFromObjectID(p.DefaultBoardID),
		Boards:            boards,
		CreatedAt:         p.CreatedAt,
		UpdatedAt:         p.UpdatedAt,
	}

	return project
}

func transformBoard(b *Board) *listing.Board {
	columns := []listing.BoardColumn{}

	if len(b.Columns) > 0 {
		for _, c := range b.Columns {
			column := listing.BoardColumn{
				Name:          c.Name,
				IssueStatuses: c.IssueStatuses,
				Ordinal:       c.Ordinal,
			}

			columns = append(columns, column)
		}
	}

	sprints := []listing.Sprint{}

	if len(b.Sprints) > 0 {
		for _, s := range b.Sprints {

			sprint := listing.Sprint{
				ID:        s.ID.Hex(),
				Name:      s.Name,
				Goal:      s.Goal,
				Ordinal:   s.Ordinal,
				CreatedAt: &s.CreatedAt,
				UpdatedAt: &s.UpdatedAt,
				CreatedBy: getHexFromObjectID(s.CreatedBy),
			}

			if !s.StartAt.IsZero() {
				sprint.StartAt = &s.StartAt
			}
			if !s.EndAt.IsZero() {
				sprint.EndAt = &s.EndAt
			}

			sprints = append(sprints, sprint)
		}
	}

	board := listing.Board{
		ID:               b.ID.Hex(),
		Type:             b.Type,
		Name:             b.Name,
		Description:      b.Description,
		IsBacklogVisible: b.IsBacklogVisible,
		IsBoardVisible:   b.IsBoardVisible,
		Columns:          columns,
		Sprints:          sprints,
		CreatedAt:        &b.CreatedAt,
		UpdatedAt:        &b.UpdatedAt,
	}

	return &board
}

// GetProjectByID returns a project entity by id from the respository.
func (s *Storage) GetProjectByID(id string) (project listing.Project, err error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return project, err
	}

	p, err := s.repo.GetProject(objectID)
	if err != nil {
		return project, err
	}

	var bs *[]Board
	if len(p.Boards) > 0 {
		bs, err = s.repo.GetBoardsByIds(&p.Boards)
		if err != nil {
			return project, err
		}
	}

	project = transformProject(p, bs)

	return project, nil

	// boards := []listing.Board{}
	// if len(p.Boards) > 0 {
	// 	projectBoards, err := s.repo.GetBoardsByIds(&p.Boards)
	// 	if err != nil {
	// 		return result, err
	// 	}

	// 	for _, pb := range *projectBoards {
	// 		columns := []listing.BoardColumn{}

	// 		if len(pb.Columns) > 0 {
	// 			for _, c := range pb.Columns {
	// 				column := listing.BoardColumn{
	// 					Name:          c.Name,
	// 					IssueStatuses: c.IssueStatuses,
	// 					Ordinal:       c.Ordinal,
	// 				}

	// 				columns = append(columns, column)
	// 			}
	// 		}

	// 		b := listing.Board{
	// 			ID:               pb.ID.Hex(),
	// 			Type:             pb.Type,
	// 			Name:             pb.Name,
	// 			Description:      pb.Description,
	// 			IsBacklogVisible: pb.IsBacklogVisible,
	// 			IsBoardVisible:   pb.IsBoardVisible,
	// 			Columns:          columns,
	// 			CreatedAt:        pb.CreatedAt,
	// 			UpdatedAt:        pb.UpdatedAt,
	// 		}

	// 		boards = append(boards, b)
	// 	}
	// }

	// result = listing.Project{
	// 	ID:                p.ID.Hex(),
	// 	Key:               p.Key,
	// 	Name:              p.Name,
	// 	Type:              p.Type,
	// 	Description:       p.Description,
	// 	LeadID:            getHexFromObjectID(p.LeadID),
	// 	DefaultAssigneeID: getHexFromObjectID(p.DefaultAssigneeID),
	// 	DefaultBoardID:    getHexFromObjectID(p.DefaultBoardID),
	// 	Boards:            boards,
	// 	CreatedAt:         p.CreatedAt,
	// 	UpdatedAt:         p.UpdatedAt,
	// }

	// return result, nil
}

// GetProjectIssues returns a paginated slice of project issue entities from the respository.
func (s *Storage) GetProjectIssues(projectID *string, p *listing.Pagination) (results []listing.Issue, count int64, err error) {
	var projectIDAsObjectID primitive.ObjectID = primitive.ObjectID{}
	var cursor primitive.ObjectID = primitive.ObjectID{}

	if len(*projectID) > 0 {
		projectIDAsObjectID, err = primitive.ObjectIDFromHex(*projectID)
		if err != nil {
			return results, count, err
		}
	}

	limit := int64(p.PageSize)

	if len(p.Cursor) > 0 {
		cursor, err = primitive.ObjectIDFromHex(p.Cursor)
		if err != nil {
			return results, count, err
		}
	}

	issues, count, err := s.repo.GetProjectIssues(&projectIDAsObjectID, &cursor, limit)
	if err != nil {
		return results, count, err
	}

	results = make([]listing.Issue, 0)

	for _, i := range *issues {
		issue := listing.Issue{
			ID:          i.ID.Hex(),
			ProjectID:   getHexFromObjectID(i.ProjectID),
			SprintID:    getHexFromObjectID(i.SprintID),
			ProjectRef:  i.ProjectRef,
			Type:        i.Type,
			Summary:     i.Summary,
			Description: i.Description,
			Status:      i.Status,
			Priority:    i.Priority,
			Points:      i.Points,
			Ordinal:     i.Ordinal,
			CreatedAt:   i.CreatedAt,
			UpdatedAt:   i.UpdatedAt,
			ReporterID:  getHexFromObjectID(i.ReporterID),
			AssigneeID:  getHexFromObjectID(i.AssigneeID),
			Labels:      i.Labels,
		}

		results = append(results, issue)
	}

	if len(results) > 0 {
		lastResult := results[len(results)-1]
		p.Cursor = lastResult.ID
	}

	return results, count, nil
}

// GetProjectBoard returns a project board entity by project and board ids from the repository.
func (s *Storage) GetProjectBoard(projectID *string, boardID *string) (result *listing.Board, err error) {
	projectIDAsObjectID, err := primitive.ObjectIDFromHex(*projectID)
	if err != nil {
		return result, err
	}

	// Load the project
	project, err := s.repo.GetProject(projectIDAsObjectID)
	if err != nil {
		return result, err
	}
	if project == nil {
		return result, fmt.Errorf("Failed to load project %v", projectID)
	}

	boardIDAsObjectID, err := primitive.ObjectIDFromHex(*boardID)
	if err != nil {
		return result, err
	}

	b, err := s.repo.GetBoard(&boardIDAsObjectID)
	if err != nil {
		return result, err
	}

	result = transformBoard(b)

	return result, nil
}

// GetProjectBacklogIssues returns a paginated slice of project backlog issue entities from the respository.
func (s *Storage) GetProjectBacklogIssues(projectID *string, p *listing.Pagination) (results []listing.Issue, count int64, err error) {
	var projectIDAsObjectID primitive.ObjectID = primitive.ObjectID{}
	var cursor primitive.ObjectID = primitive.ObjectID{}

	if len(*projectID) > 0 {
		projectIDAsObjectID, err = primitive.ObjectIDFromHex(*projectID)
		if err != nil {
			return results, count, err
		}
	}

	limit := int64(p.PageSize)

	if len(p.Cursor) > 0 {
		cursor, err = primitive.ObjectIDFromHex(p.Cursor)
		if err != nil {
			return results, count, err
		}
	}

	issues, count, err := s.repo.GetProjectBacklogIssues(&projectIDAsObjectID, &cursor, &limit)
	if err != nil {
		return results, count, err
	}

	results = make([]listing.Issue, 0)

	for _, i := range *issues {
		issue := listing.Issue{
			ID:          i.ID.Hex(),
			ProjectID:   getHexFromObjectID(i.ProjectID),
			ProjectRef:  i.ProjectRef,
			Type:        i.Type,
			Summary:     i.Summary,
			Description: i.Description,
			Status:      i.Status,
			Priority:    i.Priority,
			Points:      i.Points,
			Ordinal:     i.Ordinal,
			CreatedAt:   i.CreatedAt,
			UpdatedAt:   i.UpdatedAt,
			ReporterID:  getHexFromObjectID(i.ReporterID),
			AssigneeID:  getHexFromObjectID(i.AssigneeID),
			Labels:      i.Labels,
		}

		results = append(results, issue)
	}

	if len(results) > 0 {
		lastResult := results[len(results)-1]
		p.Cursor = lastResult.ID
	}

	return results, count, nil
}

// GetProjects returns a paginated slice of project entities from the respository.
func (s *Storage) GetProjects(p *listing.Pagination) (results []listing.Project, count int64, err error) {
	var cursor primitive.ObjectID = primitive.ObjectID{}

	limit := int64(p.PageSize)

	if len(p.Cursor) > 0 {
		cursor, err = primitive.ObjectIDFromHex(p.Cursor)
		if err != nil {
			return results, count, err
		}
	}

	projects, count, err := s.repo.GetProjects(&cursor, limit)
	if err != nil {
		return results, count, err
	}

	results = make([]listing.Project, 0)

	for _, p := range *projects {

		var bs *[]Board
		if len(p.Boards) > 0 {
			bs, err = s.repo.GetBoardsByIds(&p.Boards)
			if err != nil {
				return results, count, err
			}
		}

		project := transformProject(&p, bs)
		results = append(results, project)
	}

	if len(results) > 0 {
		lastResult := results[len(results)-1]
		p.Cursor = lastResult.ID
	}

	return results, count, nil
}

// GetProjectSprintIssues returns a paginated slice of project sprint issue entities from the respository.
func (s *Storage) GetProjectSprintIssues(projectID *string, sprintID *string, p *listing.Pagination) (results []listing.Issue, count int64, err error) {
	var projectIDAsObjectID primitive.ObjectID = primitive.ObjectID{}
	var sprintIDAsObjectID primitive.ObjectID = primitive.ObjectID{}
	var cursor primitive.ObjectID = primitive.ObjectID{}

	if projectID != nil {
		projectIDAsObjectID, err = primitive.ObjectIDFromHex(*projectID)
		if err != nil {
			return results, count, err
		}
	}

	if sprintID != nil {
		sprintIDAsObjectID, err = primitive.ObjectIDFromHex(*sprintID)
		if err != nil {
			return results, count, err
		}
	}

	limit := int64(p.PageSize)

	if len(p.Cursor) > 0 {
		cursor, err = primitive.ObjectIDFromHex(p.Cursor)
		if err != nil {
			return results, count, err
		}
	}

	issues, count, err := s.repo.GetProjectSprintIssues(&projectIDAsObjectID, &sprintIDAsObjectID, &cursor, &limit)
	if err != nil {
		return results, count, err
	}

	results = make([]listing.Issue, 0)

	for _, i := range *issues {
		issue := listing.Issue{
			ID:          i.ID.Hex(),
			ProjectID:   getHexFromObjectID(i.ProjectID),
			SprintID:    getHexFromObjectID(i.SprintID),
			ProjectRef:  i.ProjectRef,
			Type:        i.Type,
			Summary:     i.Summary,
			Description: i.Description,
			Status:      i.Status,
			Priority:    i.Priority,
			Points:      i.Points,
			Ordinal:     i.Ordinal,
			CreatedAt:   i.CreatedAt,
			UpdatedAt:   i.UpdatedAt,
			ReporterID:  getHexFromObjectID(i.ReporterID),
			AssigneeID:  getHexFromObjectID(i.AssigneeID),
			Labels:      i.Labels,
		}

		results = append(results, issue)
	}

	if len(results) > 0 {
		lastResult := results[len(results)-1]
		p.Cursor = lastResult.ID
	}

	return results, count, nil
}

// GetProjectTypes returns all, or a filtered slice of project type entities from the repository.
func (s *Storage) GetProjectTypes(term *string) (results []listing.ProjectType, err error) {
	projectTypes, err := s.repo.GetProjectTypes(term)
	if err != nil {
		return results, err
	}

	results = make([]listing.ProjectType, 0)

	for _, pt := range projectTypes {
		projectType := listing.ProjectType{
			ID:        pt.ID,
			Name:      pt.Name,
			IsDefault: pt.IsDefault,
		}

		results = append(results, projectType)
	}

	return results, nil
}

// GetUsers returns all, or a filtered slice of user entities from the repository.
func (s *Storage) GetUsers(term *string) (results []listing.User, err error) {
	users, err := s.repo.GetUsers(term)
	if err != nil {
		return results, err
	}

	results = make([]listing.User, 0)

	for _, u := range *users {
		user := listing.User{
			ID:    u.ID.Hex(),
			Email: u.Email,
			Name:  listing.UserName{FirstName: u.Name.FirstName, LastName: u.Name.LastName},
		}

		results = append(results, user)
	}

	return results, nil
}

// GetWorkflows returns all workflow entities from the repository.
func (s *Storage) GetWorkflows() (results []listing.Workflow, err error) {
	workflows, err := s.repo.GetWorkflows()
	if err != nil {
		return results, err
	}

	results = make([]listing.Workflow, 0)

	for _, w := range *workflows {
		var steps []listing.WorkflowStep

		for _, step := range w.Steps {
			newStep := listing.WorkflowStep{
				Name:       step.Name,
				Ordinal:    step.Ordinal,
				CategoryID: step.CategoryID,
				StatusIds:  step.StatusIds,
			}
			steps = append(steps, newStep)
		}

		workflow := listing.Workflow{
			ID:       w.ID,
			Name:     w.Name,
			IsLocked: w.IsLocked,
			Steps:    steps,
		}

		results = append(results, workflow)
	}

	return results, nil
}
