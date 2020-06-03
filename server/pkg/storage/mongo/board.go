package mongo

import (
	"context"
	"fmt"
	"time"

	"github.com/njehyde/issue-tracker/libraries/slog"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Board defines the storage form of a board entity.
type Board struct {
	ID               primitive.ObjectID   `bson:"_id"`
	Type             string               `bson:"type"`
	Name             string               `bson:"name"`
	Description      string               `bson:"description"`
	IsBacklogVisible bool                 `bson:"isBacklogVisible"`
	IsBoardVisible   bool                 `bson:"isBoardVisible"`
	Issues           []primitive.ObjectID `bson:"issues"`
	Columns          []BoardColumn        `bson:"columns"`
	Sprints          []Sprint             `bson:"sprints"`
	CreatedAt        time.Time            `bson:"createdAt"`
	UpdatedAt        time.Time            `bson:"updatedAt"`
}

// AddBoard ...
func (r *Repository) AddBoard(b *Board) error {
	collection := r.db.Collection("boards")

	now := time.Now()

	b.ID = primitive.NewObjectID()
	b.Issues = []primitive.ObjectID{}
	b.CreatedAt = now
	b.UpdatedAt = now

	insertResult, err := collection.InsertOne(context.Background(), b)
	if err != nil {
		return err
	}

	slog.Infof("Added board %v: %+v", b.ID.Hex, insertResult)

	return nil
}

// GetBoard ...
func (r *Repository) GetBoard(id *primitive.ObjectID) (*Board, error) {
	var b Board

	collection := r.db.Collection("boards")

	filter := bson.M{"_id": *id}

	err := collection.FindOne(context.Background(), filter).Decode(&b)
	if err != nil {
		return &b, err
	}

	return &b, nil
}

// GetBoardsByIds ...
func (r *Repository) GetBoardsByIds(ids *[]primitive.ObjectID) (*[]Board, error) {
	var results []Board

	collection := r.db.Collection("boards")
	filter := bson.M{
		"_id": bson.M{"$in": *ids},
	}

	cur, err := collection.Find(context.Background(), filter)
	defer cur.Close(context.Background())
	if err != nil {
		return &results, err
	}

	for cur.Next(context.Background()) {
		// Create a value into which the single document can be decoded
		var b Board
		err = cur.Decode(&b)
		if err != nil {
			return &results, err
		}

		results = append(results, b)
	}

	return &results, nil
}

// BoardColumn ...
type BoardColumn struct {
	Name          string   `bson:"name"`
	IssueStatuses []string `bson:"issueStatuses"`
	Ordinal       int32    `bson:"ordinal"`
}

// BoardTemplate defines the storage form of an board template entity.
type BoardTemplate struct {
	ID               string `bson:"_id"`
	Name             string `bson:"name"`
	IsSprintable     bool   `bson:"isSprintable"`
	IsBacklogVisible bool   `bson:"isBacklogVisible"`
	IsBoardVisible   bool   `bson:"isBoardVisible"`
	WorkflowID       int32  `bson:"workflowId"`
	IsDefault        bool   `bson:"isDefault"`
}

// GetBoardTemplate ...
func (r *Repository) GetBoardTemplate(ID *string) (*BoardTemplate, error) {
	var bt BoardTemplate

	collection := r.db.Collection("board_templates")

	filter := bson.M{"_id": *ID}

	err := collection.FindOne(context.Background(), filter).Decode(&bt)
	if err != nil {
		return &bt, err
	}

	return &bt, nil
}

// GetBoardTemplates ...
func (r *Repository) GetBoardTemplates() (*[]BoardTemplate, error) {
	var boardTemplates = []BoardTemplate{}
	collection := r.db.Collection("board_templates")

	filter := bson.D{}
	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "type", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &boardTemplates, err
	}

	for cur.Next(context.Background()) {
		var bt BoardTemplate

		err = cur.Decode(&bt)
		if err != nil {
			return &boardTemplates, err
		}

		boardTemplates = append(boardTemplates, bt)
	}

	return &boardTemplates, nil
}

// WorkflowStep defines the listing form of a workflow step entity.
type WorkflowStep struct {
	Name       string   `bson:"name"`
	Ordinal    int32    `bson:"ordinal"`
	CategoryID string   `bson:"categoryId"`
	StatusIds  []string `bson:"statusIds"`
}

// Workflow defines the listing form of a workflow entity.
type Workflow struct {
	ID       int32          `bson:"_id"`
	Name     string         `bson:"name"`
	IsLocked bool           `bson:"isLocked"`
	Steps    []WorkflowStep `bson:"steps"`
}

// GetWorkflow ...
func (r *Repository) GetWorkflow(ID *int32) (*Workflow, error) {
	var w Workflow

	collection := r.db.Collection("workflows")

	filter := bson.M{"_id": *ID}

	err := collection.FindOne(context.Background(), filter).Decode(&w)
	if err != nil {
		return &w, err
	}

	return &w, nil
}

// GetWorkflows ...
func (r *Repository) GetWorkflows() (*[]Workflow, error) {
	var workflows = []Workflow{}
	var err error

	collection := r.db.Collection("workflows")
	filter := bson.D{}
	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "name", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &workflows, err
	}

	for cur.Next(context.Background()) {
		// Create a value into which the single document can be decoded
		var w Workflow
		err = cur.Decode(&w)
		if err != nil {
			return &workflows, err
		}

		workflows = append(workflows, w)
	}

	return &workflows, nil
}

// Sprint ...
type Sprint struct {
	ID        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	Goal      string             `bson:"goal,omitempty"`
	Ordinal   int32              `bson:"ordinal"`
	StartAt   time.Time          `bson:"startAt,omitempty"`
	EndAt     time.Time          `bson:"endAt,omitempty"`
	CreatedAt time.Time          `bson:"createdAt,omitempty"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty"`
	CreatedBy primitive.ObjectID `bson:"createdBy"`
}

// AddBoardSprint ...
func (r *Repository) AddBoardSprint(boardID *primitive.ObjectID, s *Sprint) error {
	collection := r.db.Collection("boards")

	now := time.Now()

	s.ID = primitive.NewObjectID()
	s.CreatedAt = now
	s.UpdatedAt = now

	filter := bson.M{"_id": &boardID}

	update := bson.M{
		"$set": bson.M{
			"updatedAt": now,
		},
		"$push": bson.M{
			"sprints": s,
		},
	}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if updateResult.ModifiedCount == 0 {
		return fmt.Errorf("Update's modified count was %v", updateResult.ModifiedCount)
	}
	if updateResult.MatchedCount != updateResult.ModifiedCount {
		return fmt.Errorf("Update count mismatch: matched count was %v but modified counts was %v", updateResult.MatchedCount, updateResult.ModifiedCount)
	}

	slog.Infof("Added sprint via board update %v: %+v", boardID.Hex, updateResult)

	return nil
}

// UpdateBoardSprint ...
func (r *Repository) UpdateBoardSprint(boardID *primitive.ObjectID, sprintID *primitive.ObjectID, updateDocument *bson.D) error {
	collection := r.db.Collection("boards")

	now := time.Now()

	filter := bson.M{"_id": &boardID, "sprints._id": sprintID}

	// Add the board's updatedAt property to the update document
	boardUpdatedAt := bson.E{Key: "updatedAt", Value: now}
	*updateDocument = append(*updateDocument, boardUpdatedAt)

	update := bson.D{
		{Key: "$set", Value: updateDocument},
	}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if updateResult.ModifiedCount == 0 {
		return fmt.Errorf("Update modified count was %v", updateResult.ModifiedCount)
	}
	if updateResult.MatchedCount != updateResult.ModifiedCount {
		return fmt.Errorf("Update count mismatch: matched count was %v but modified counts was %v", updateResult.MatchedCount, updateResult.ModifiedCount)
	}

	slog.Infof("Updated sprint %v via update to board %v: %+v", sprintID.Hex, boardID.Hex, updateResult)

	return nil
}

// DeleteBoardSprint ...
func (r *Repository) DeleteBoardSprint(boardID *primitive.ObjectID, sprintID *primitive.ObjectID) error {
	collection := r.db.Collection("boards")

	now := time.Now()

	filter := bson.M{"_id": &boardID}

	update := bson.M{
		"$set": bson.M{
			"updatedAt": now,
		},
		"$pull": bson.M{
			"sprints": bson.M{
				"_id": sprintID,
			},
		},
	}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	slog.Infof("Deleted sprint %v via update to board %v: %+v", sprintID.Hex(), boardID.Hex(), updateResult)

	return nil
}
