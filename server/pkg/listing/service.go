package listing

// Service provides entity listing operations.
type Service interface {
	// GetBoardTypes returns all board type entities.
	GetBoardTypes() ([]BoardType, error)
	// GetCategories returns all category entities..
	GetCategories() ([]Category, error)
	// GetIssue returns an issue entity by id.
	GetIssue(string) (Issue, error)
	// GetIssueComments returns a paginated slice of issue comment entities.
	GetIssueComments(*string, *Pagination) ([]IssueComment, int64, error)
	// GetIssues returns a paginated slice of issue entities.
	GetIssues(*Pagination) ([]Issue, int64, error)
	// GetIssueStatuses returns all, or a filtered slice of issue status entities.
	GetIssueStatuses(*string) ([]IssueStatus, error)
	// GetIssueTypes returns all issue type entities.
	GetIssueTypes() ([]IssueType, error)
	// GetLabels returns all, or a filtered slice of label entities.
	GetLabels(*string) ([]Label, error)
	// GetPriorityTypes returns all priority type entities.
	GetPriorityTypes() ([]PriorityType, error)
	// GetProject returns a project entity by id.
	GetProject(string) (Project, error)
	// GetProjectBacklogIssues returns a paginated slice of project backlog issue entities.
	GetProjectBacklogIssues(*string, *Pagination) ([]Issue, int64, error)
	// GetProjectBoard returns a project board entity by project and board ids.
	GetProjectBoard(*string, *string) (*Board, error)
	// GetProjectIssues returns a paginated slice of project issue entities.
	GetProjectIssues(*string, *Pagination) ([]Issue, int64, error)
	// GetProjects returns a paginated slice of project entities.
	GetProjects(*Pagination) ([]Project, int64, error)
	// GetProjectSprintIssues returns a paginated slice of project sprint issue entities.
	GetProjectSprintIssues(*string, *string, *Pagination) ([]Issue, int64, error)
	// GetProjectTypes returns all, or a filtered slice of project type entities.
	GetProjectTypes(*string) ([]ProjectType, error)
	// GetUsers returns all, or a filtered slice of user entities.
	GetUsers(*string) ([]User, error)
	// GetWorkflows returns all, or a filtered slice of workflow entities.
	GetWorkflows() ([]Workflow, error)
}

// Repository provides access to issue storage.
type Repository interface {
	// GetBoardTypes returns all board type entities from the respository.
	GetBoardTypes() ([]BoardType, error)
	// GetCategories returns all category entities from the respository.
	GetCategories() ([]Category, error)
	// GetIssue returns an issue entity by id from the repository.
	GetIssue(string) (Issue, error)
	// GetIssueComments returns a paginated slice of issue comment entities from the repository.
	GetIssueComments(*string, *Pagination) ([]IssueComment, int64, error)
	// GetIssues returns a paginated slice of issue entities from the repository.
	GetIssues(*Pagination) ([]Issue, int64, error)
	// GetIssueStatuses returns all, or a filtered slice of issue status entities from the repository.
	GetIssueStatuses(*string) ([]IssueStatus, error)
	// GetIssueTypes returns all issue type entities from the repository.
	GetIssueTypes() ([]IssueType, error)
	// GetLabels returns all, or a filtered slice of label entities from the repository.
	GetLabels(*string) ([]Label, error)
	// GetPriorityTypes returns all priority type entities from the repository.
	GetPriorityTypes() ([]PriorityType, error)
	// GetProjectBoard returns a project board entity from the repository.
	GetProjectBoard(*string, *string) (*Board, error)
	// GetProject returns a project entity by id from the respository.
	GetProjectByID(string) (Project, error)
	// GetProjectBacklogIssues returns a paginated slice of project backlog issue entities from the repository.
	GetProjectBacklogIssues(*string, *Pagination) ([]Issue, int64, error)
	// GetProjectIssues returns a paginated slice of project issue entities from the repository.
	GetProjectIssues(*string, *Pagination) ([]Issue, int64, error)
	// GetProjects returns a paginated slice of project entities from the respository.
	GetProjects(*Pagination) ([]Project, int64, error)
	// GetProjectSprintIssues returns a paginated slice of project sprint issue entities from the respository.
	GetProjectSprintIssues(*string, *string, *Pagination) ([]Issue, int64, error)
	// GetProjectTypes returns all, or a filtered slice of project type entities from the repository.
	GetProjectTypes(*string) ([]ProjectType, error)
	// GetUsers returns all, or a filtered slice of user entities from the repository.
	GetUsers(*string) ([]User, error)
	// GetWorkflows returns all, or a filtered slice of workflow entities from the repository.
	GetWorkflows() ([]Workflow, error)
}

type service struct {
	repo Repository
}

// NewService creates a listing service with the necessary dependencies
func NewService(r Repository) Service {
	return &service{r}
}

func (s *service) GetBoardTypes() ([]BoardType, error) {
	r, err := s.repo.GetBoardTypes()
	return r, err
}

func (s *service) GetCategories() ([]Category, error) {
	r, err := s.repo.GetCategories()
	return r, err
}

func (s *service) GetIssue(id string) (Issue, error) {
	// TODO: Validation for GetIssue
	return s.repo.GetIssue(id)
}

func (s *service) GetIssueComments(issueID *string, p *Pagination) ([]IssueComment, int64, error) {
	// TODO: Validation for GetIssueComments
	r, c, err := s.repo.GetIssueComments(issueID, p)
	return r, c, err
}

func (s *service) GetIssues(p *Pagination) ([]Issue, int64, error) {
	// TODO: Validation for GetIssues
	r, c, err := s.repo.GetIssues(p)
	return r, c, err
}

func (s *service) GetIssueStatuses(term *string) ([]IssueStatus, error) {
	r, err := s.repo.GetIssueStatuses(term)
	return r, err
}

func (s *service) GetIssueTypes() ([]IssueType, error) {
	r, err := s.repo.GetIssueTypes()
	return r, err
}

func (s *service) GetLabels(term *string) ([]Label, error) {
	r, err := s.repo.GetLabels(term)
	return r, err
}

func (s *service) GetPriorityTypes() ([]PriorityType, error) {
	r, err := s.repo.GetPriorityTypes()
	return r, err
}

func (s *service) GetProject(id string) (Project, error) {
	// TODO: Validation for GetProject
	r, err := s.repo.GetProjectByID(id)
	return r, err
}

func (s *service) GetProjectIssues(projectID *string, p *Pagination) ([]Issue, int64, error) {
	// TODO: Validation for GetProjectIssues
	r, c, err := s.repo.GetProjectIssues(projectID, p)
	return r, c, err
}

func (s *service) GetProjectBacklogIssues(projectID *string, p *Pagination) ([]Issue, int64, error) {
	// TODO: Validation for GetProjectBacklogIssues
	r, c, err := s.repo.GetProjectBacklogIssues(projectID, p)
	return r, c, err
}

func (s *service) GetProjectBoard(projectID *string, boardID *string) (*Board, error) {
	// TODO: Validation for GetProjectBoard
	b, err := s.repo.GetProjectBoard(projectID, boardID)
	return b, err
}

func (s *service) GetProjects(p *Pagination) ([]Project, int64, error) {
	// TODO: Validation for GetProjects
	r, c, err := s.repo.GetProjects(p)
	return r, c, err
}

func (s *service) GetProjectSprintIssues(projectID *string, sprintID *string, p *Pagination) ([]Issue, int64, error) {
	// TODO: Validation for GetProjectSprintIssues
	r, c, err := s.repo.GetProjectSprintIssues(projectID, sprintID, p)
	return r, c, err
}

func (s *service) GetProjectTypes(term *string) ([]ProjectType, error) {
	r, err := s.repo.GetProjectTypes(term)
	return r, err
}

func (s *service) GetUsers(term *string) ([]User, error) {
	r, err := s.repo.GetUsers(term)
	return r, err
}

func (s *service) GetWorkflows() ([]Workflow, error) {
	r, err := s.repo.GetWorkflows()
	return r, err
}
