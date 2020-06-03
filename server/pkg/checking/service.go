package checking

// Service provides entity checking operations.
type Service interface {
	// CheckHealth attempts to return a health status.
	CheckHealth() HealthStatus
	// CheckProjectExistsByKey ...
	CheckProjectExistsByKey(*string) (bool, error)
	// CheckUserExistsByEmail ...
	CheckUserExistsByEmail(*string) (bool, error)
}

// Repository provides access to the checking repository.
type Repository interface {
	// CheckHealth attempts to return a health status.
	CheckHealth() bool
	// CheckProjectExistsByKey ...
	CheckProjectExistsByKey(*string) (bool, error)
	// CheckUserExistsByEmail ...
	CheckUserExistsByEmail(*string) (bool, error)
}

type service struct {
	repo Repository
}

// NewService creates a checking service with the necessary dependencies.
func NewService(r Repository) Service {
	return &service{r}
}

// CheckHealth returns a health status object
func (s *service) CheckHealth() (hs HealthStatus) {
	hs.Database = s.repo.CheckHealth()
	return hs
}

// CheckProjectExistsByKey returns a bool that indicates the existence of a project entity by key.
func (s *service) CheckProjectExistsByKey(key *string) (bool, error) {
	return s.repo.CheckProjectExistsByKey(key)
}

// CheckUserExistsByEmail returns a bool that indicates the existence of a user entity by email.
func (s *service) CheckUserExistsByEmail(email *string) (bool, error) {
	return s.repo.CheckUserExistsByEmail(email)
}
