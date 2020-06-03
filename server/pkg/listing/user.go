package listing

// UserName defines the listing form of a name Value Object.
type UserName struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// User defines the listing form of a user entity.
type User struct {
	ID    string   `json:"id"`
	Email string   `json:"email"`
	Name  UserName `json:"name"`
}
