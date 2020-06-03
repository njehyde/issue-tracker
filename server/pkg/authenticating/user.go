package authenticating

import (
	"errors"

	"github.com/dgrijalva/jwt-go"
)

// LoginCredentials defines the form of a user login.
type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserName defines the form of a name Value Object.
type UserName struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// RegisterUser defines the form of a user registration.
type RegisterUser struct {
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Name     UserName `json:"name"`
}

// User defines the authenticating form of a user entity.
type User struct {
	ID    string   `json:"id"`
	Email string   `json:"email"`
	Name  UserName `json:"name"`
}

// Validates the login credentials.
func validateLogin(lc *LoginCredentials) error {
	if len(lc.Email) == 0 {
		return errors.New("User email is required")
	}
	if len(lc.Password) == 0 {
		return errors.New("User password is required")
	}
	return nil
}

// Validates the registering user.
func validateRegisterUser(u *RegisterUser) error {
	if len(u.Email) == 0 {
		return errors.New("Registering user's email is required")
	}
	if len(u.Password) == 0 {
		return errors.New("Registering user's password is required")
	}
	return nil
}

// Token defines the authenticating form of a token.
type Token struct {
	jwt.StandardClaims
}
