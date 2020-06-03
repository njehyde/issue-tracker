package mongo

import (
	"context"
	"time"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// UserName defines the storage form of a name Value Object.
type UserName struct {
	FirstName string `bson:"firstName"`
	LastName  string `bson:"lastName"`
}

// User defines the storage form of a user entity.
type User struct {
	ID        primitive.ObjectID `bson:"_id"`
	Email     string             `bson:"email"`
	Password  string             `bson:"hash"`
	Name      UserName           `bson:"name"`
	CreatedAt time.Time          `bson:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt"`
}

// AddUser ...
func (r *Repository) AddUser(u *User) error {
	collection := r.db.Collection("users")

	now := time.Now()

	u.ID = primitive.NewObjectID()
	u.CreatedAt = now
	u.UpdatedAt = now

	insertResult, err := collection.InsertOne(context.Background(), u)
	if err != nil {
		return err
	}

	slog.Infof("Added user %v: %+v", u.ID.Hex(), insertResult)

	return nil
}

// GetUserByID ...
func (r *Repository) GetUserByID(id *primitive.ObjectID) (*User, error) {
	var u User

	collection := r.db.Collection("users")

	filter := bson.M{"_id": id}

	err := collection.FindOne(context.Background(), filter).Decode(&u)
	if err != nil {
		return &u, err
	}

	return &u, nil
}

// GetUserByEmail ...
func (r *Repository) GetUserByEmail(email *string) (*User, error) {
	var u User

	collection := r.db.Collection("users")

	filter := bson.M{"email": email}

	err := collection.FindOne(context.Background(), filter).Decode(&u)
	if err != nil {
		return nil, err
	}

	return &u, nil
}

// GetUsers ...
func (r *Repository) GetUsers(term *string) (*[]User, error) {
	var users = []User{}
	var err error

	collection := r.db.Collection("users")
	filter := bson.D{}
	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "name.lastName", Value: 1},
		},
	)

	if len(*term) > 0 {
		filter = bson.D{
			primitive.E{
				Key: "$or",
				Value: []interface{}{
					bson.D{
						primitive.E{
							Key:   "name.firstName",
							Value: primitive.Regex{Pattern: *term, Options: "i"},
						},
					},
					bson.D{
						primitive.E{
							Key:   "name.lastName",
							Value: primitive.Regex{Pattern: *term, Options: "i"},
						},
					},
				},
			},
		}
	}

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &users, err
	}

	for cur.Next(context.Background()) {
		// Create a value into which the single document can be decoded
		var u User
		err = cur.Decode(&u)
		if err != nil {
			return &users, err
		}

		users = append(users, u)
	}

	return &users, nil
}
