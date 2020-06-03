package adding

import "errors"

// UserName defines the adding form of a name Value Object.
type UserName struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// User defines the adding form of a user entity.
type User struct {
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Name     UserName `json:"name"`
}

// Validates the user being added.
func validateAddUser(u User) error {
	if len(u.Email) == 0 {
		return errors.New("User email is required")
	}
	if len(u.Password) == 0 {
		return errors.New("User password is required")
	}
	return nil
}
