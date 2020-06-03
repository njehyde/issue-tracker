package mongo

import (
	"errors"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/authenticating"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// GetUserByID ...
func (s *Storage) GetUserByID(id string) (*authenticating.User, error) {
	var result authenticating.User

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		slog.Error(err)
		return &result, err
	}

	u, err := s.repo.GetUserByID(&objectID)
	if err != nil {
		slog.Error(err)
		return &result, errors.New("User not found")
	}

	result = authenticating.User{
		ID:    u.ID.Hex(),
		Email: u.Email,
		Name:  authenticating.UserName{FirstName: u.Name.FirstName, LastName: u.Name.LastName},
	}

	return &result, nil
}

// Login ...
func (s *Storage) Login(lc *authenticating.LoginCredentials) (authenticating.User, error) {
	var result authenticating.User
	var err error

	u, err := s.repo.GetUserByEmail(&lc.Email)
	if err != nil {
		slog.Error(err)
		return result, errors.New("User not found")
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(lc.Password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		slog.Error(err)
		return result, errors.New("Invalid login credentials")
	}

	result = authenticating.User{
		ID:    u.ID.Hex(),
		Email: u.Email,
		Name: authenticating.UserName{
			FirstName: u.Name.FirstName,
			LastName:  u.Name.LastName,
		},
	}

	return result, nil
}

// RegisterUser ...
func (s *Storage) RegisterUser(ru *authenticating.RegisterUser) (authenticating.User, error) {
	var result authenticating.User
	var err error

	existing, err := s.repo.GetUserByEmail(&ru.Email)
	if existing != nil {
		return result, errors.New("User already exists")
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(ru.Password), bcrypt.DefaultCost)

	user := User{
		Email:    ru.Email,
		Password: string(hashedPassword),
		Name:     UserName{ru.Name.FirstName, ru.Name.LastName},
	}

	err = s.repo.AddUser(&user)
	if err != nil {
		return result, err
	}

	result = authenticating.User{
		ID:    user.ID.Hex(),
		Email: user.Email,
		Name: authenticating.UserName{
			FirstName: user.Name.FirstName,
			LastName:  user.Name.LastName,
		},
	}

	return result, nil
}
