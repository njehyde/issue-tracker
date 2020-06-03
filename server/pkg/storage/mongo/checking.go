package mongo

import (
	"context"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// CheckHealth ...
func (s *Storage) CheckHealth() bool {
	err := s.client.Ping(context.Background(), readpref.Primary())
	if err != nil {
		slog.Error(err)
		return false
	}

	return true
}

// CheckProjectExistsByKey ...
func (s *Storage) CheckProjectExistsByKey(k *string) (bool, error) {
	var result bool

	_, err := s.repo.GetProjectByKey(k)
	result = err == nil

	return result, nil
}

// CheckUserExistsByEmail ...
func (s *Storage) CheckUserExistsByEmail(e *string) (bool, error) {
	var result bool

	_, err := s.repo.GetUserByEmail(e)
	result = err == nil

	return result, nil
}
