package mongo

import (
	"context"
	"os"
	"time"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository ...
type Repository struct {
	client *mongo.Client
	db     *mongo.Database
}

// Storage stores beer data in JSON files
type Storage struct {
	client *mongo.Client
	db     *mongo.Database
	repo   *Repository
}

// NewStorage returns a new mongodb storage
func NewStorage() (*Storage, error) {
	var err error

	s := new(Storage)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	username := os.Getenv("MONGODB_USERNAME")
	password := os.Getenv("MONGODB_PASSWORD")
	dnsRecord := os.Getenv("MONGODB_DNS_RECORD")
	host := os.Getenv("MONGODB_HOST")
	port := os.Getenv("MONGODB_PORT")

	credentials := ""
	uri := ""

	if len(username) > 0 && len(password) > 0 {
		credentials = username + ":" + password + "@"
	}

	if len(dnsRecord) > 0 {
		uri = "mongodb+srv://" + credentials + dnsRecord + "/?retryWrites=true&w=majority"
	} else {
		if len(host) == 0 {
			host = "localhost"
		}
		if len(port) == 0 {
			port = "27017"
		}
		uri = "mongodb://" + credentials + host + ":" + port
	}

	slog.Infof("uri: %v", uri)

	clientOptions := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}

	s.client = client
	s.db = client.Database("issue-tracker")

	repo := new(Repository)
	repo.client = client
	repo.db = client.Database("issue-tracker")
	s.repo = repo

	slog.Infof("Connected to MongoDB!")

	return s, nil
}

func getHexFromObjectID(ID primitive.ObjectID) string {
	var id string
	result := ID.Hex()
	if ID.IsZero() {
		return id
	}
	id = result
	return id
}

// // Query ...
// type Query struct {
// 	CollectionName *string
// 	Filter         *interface{}
// 	FilterOptions  *options.FindOneOptions
// }

// // FindOne ...
// func (r *Repository) FindOne(v interface{}, q *Query) error {
// 	var filter interface{}
// 	var filterOptions options.FindOneOptions

// 	if q.CollectionName == nil {
// 		return fmt.Errorf("Collection name is missing")
// 	}

// 	collection := r.db.Collection(*q.CollectionName)

// 	filter = bson.D{}
// 	if q.Filter == nil {
// 		filter = *q.Filter
// 	}

// 	filterOptions = options.FindOneOptions{}
// 	if q.FilterOptions == nil {
// 		filterOptions = *q.FilterOptions
// 	}

// 	err := collection.FindOne(context.Background(), filter, &filterOptions).Decode(&v)
// 	if err != nil {
// 		slog.Error(err)
// 		return err
// 	}

// 	return nil
// }
