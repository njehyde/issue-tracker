package mongo

import (
	"context"
	"time"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Project defines the storage form of a project entity.
type Project struct {
	ID                primitive.ObjectID   `bson:"_id"`
	Key               string               `bson:"key"`
	Name              string               `bson:"name"`
	Type              string               `bson:"type"`
	Description       string               `bson:"description"`
	LeadID            primitive.ObjectID   `bson:"leadId"`
	DefaultAssigneeID primitive.ObjectID   `bson:"defaultAssigneeId"`
	DefaultBoardID    primitive.ObjectID   `bson:"defaultBoardId"`
	Boards            []primitive.ObjectID `bson:"boards"`
	CreatedAt         time.Time            `bson:"createdAt"`
	UpdatedAt         time.Time            `bson:"updatedAt"`
}

// AddProject ...
func (r *Repository) AddProject(p *Project) error {
	collection := r.db.Collection("projects")

	now := time.Now()

	p.ID = primitive.NewObjectID()
	p.CreatedAt = now
	p.UpdatedAt = now

	insertResult, err := collection.InsertOne(context.Background(), p)
	if err != nil {
		return err
	}

	slog.Infof("Added project %v: %+v", p.ID, insertResult)

	return nil
}

// DeleteProject ...
func (r *Repository) DeleteProject(ID primitive.ObjectID) error {
	collection := r.db.Collection("projects")

	filter := bson.M{"_id": ID}

	deleteResult, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	slog.Infof("Deleted project %v: %+v", ID, deleteResult)

	return nil
}

// GetProject ...
func (r *Repository) GetProject(ID primitive.ObjectID) (*Project, error) {
	var p *Project
	collection := r.db.Collection("projects")

	filter := bson.M{"_id": ID}

	err := collection.FindOne(context.Background(), filter).Decode(&p)
	if err != nil {
		return p, err
	}

	return p, nil
}

// GetProjects ...
func (r *Repository) GetProjects(cursor *primitive.ObjectID, limit int64) (*[]Project, int64, error) {
	var projects []Project
	var count int64

	collection := r.db.Collection("projects")

	filter := bson.M{}
	if cursor != nil {
		filter = bson.M{
			"_id": bson.M{
				"$gt": cursor,
			},
		}
	}

	findOptions := options.Find().SetLimit(limit)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &projects, count, err
	}

	count, err = collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return &projects, count, err
	}

	for cur.Next(context.Background()) {
		var p Project

		err = cur.Decode(&p)
		if err != nil {
			return &projects, count, err
		}

		projects = append(projects, p)
	}

	return &projects, count, nil
}

// GetProjectByKey ...
func (r *Repository) GetProjectByKey(k *string) (*Project, error) {
	var p *Project
	collection := r.db.Collection("projects")

	filter := bson.M{"key": k}

	err := collection.FindOne(context.Background(), filter).Decode(&p)
	if err != nil {
		return p, err
	}

	return p, nil
}

// UpdateProject ...
func (r *Repository) UpdateProject(ID primitive.ObjectID, update primitive.M) error {
	collection := r.db.Collection("projects")

	filter := bson.M{"_id": ID}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	slog.Infof("Updated project %v: %+v", ID, updateResult)

	return nil
}

// ProjectType defines the storage form of a project type entity.
type ProjectType struct {
	ID        string `bson:"_id"`
	Name      string `bson:"name"`
	IsDefault bool   `bson:"isDefault"`
}

// GetProjectTypes ...
func (r *Repository) GetProjectTypes(term *string) ([]ProjectType, error) {
	var projectTypes = []ProjectType{}
	var err error

	collection := r.db.Collection("project_types")
	filter := bson.D{}
	findOptions := options.Find()

	if len(*term) > 0 {
		filter = bson.D{
			primitive.E{
				Key:   "name",
				Value: primitive.Regex{Pattern: *term, Options: "i"},
			},
		}
	}

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return projectTypes, err
	}

	for cur.Next(context.Background()) {
		// Create a value into which the single document can be decoded
		var pt ProjectType
		err = cur.Decode(&pt)
		if err != nil {
			return projectTypes, err
		}

		projectTypes = append(projectTypes, pt)
	}

	return projectTypes, nil
}

// ProjectCounter defines the storage form of a project counter entity.
type ProjectCounter struct {
	ID      string `bson:"_id"`
	Counter int64  `bson:"counter"`
}

// AddProjectCounter ...
func (r *Repository) AddProjectCounter(pc *ProjectCounter) error {
	collection := r.db.Collection("project_counters")

	insertResult, err := collection.InsertOne(context.Background(), pc)
	if err != nil {
		return err
	}

	slog.Infof("Added project counter %v: %+v", pc.ID, insertResult)

	return nil
}

// GetProjectCounter ...
func (r *Repository) GetProjectCounter(ID string) (*ProjectCounter, error) {
	var pc *ProjectCounter
	collection := r.db.Collection("project_counters")

	filter := bson.M{"_id": ID}

	err := collection.FindOne(context.Background(), filter).Decode(&pc)
	if err != nil {
		return pc, err
	}

	return pc, nil
}

// UpdateProjectCounter ...
func (r *Repository) UpdateProjectCounter(ID string, update primitive.M) error {
	collection := r.db.Collection("project_counters")

	filter := bson.M{"_id": ID}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	slog.Infof("Updated project counter %v: %+v", ID, updateResult)

	return nil
}
