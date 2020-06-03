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

// Category defines the storage form of a category entity.
type Category struct {
	ID      string `bson:"_id"`
	Name    string `bson:"name"`
	Ordinal int32  `bson:"ordinal"`
}

// GetCategories ...
func (r *Repository) GetCategories() (*[]Category, error) {
	var categories []Category

	collection := r.db.Collection("categories")

	filter := bson.D{}
	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &categories, err
	}

	for cur.Next(context.Background()) {
		var c Category

		err = cur.Decode(&c)
		if err != nil {
			return &categories, err
		}

		categories = append(categories, c)
	}

	return &categories, nil
}

// Issue defines the storage form of an issue entity.
type Issue struct {
	ID          primitive.ObjectID `bson:"_id"`
	ProjectID   primitive.ObjectID `bson:"projectId"`
	SprintID    primitive.ObjectID `bson:"sprintId,omitempty"`
	ProjectRef  string             `bson:"projectRef"`
	Type        string             `bson:"type"`
	Summary     string             `bson:"summary"`
	Description string             `bson:"description"`
	Status      string             `bson:"status"`
	Priority    string             `bson:"priority"`
	Points      int32              `bson:"points,omitempty"`
	ReporterID  primitive.ObjectID `bson:"reporterId"`
	AssigneeID  primitive.ObjectID `bson:"assigneeId"`
	Labels      []string           `bson:"labels"`
	Ordinal     int32              `bson:"ordinal"`
	CreatedAt   time.Time          `bson:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt"`
}

// AddIssue ...
func (r *Repository) AddIssue(i *Issue) error {
	collection := r.db.Collection("issues")

	now := time.Now()

	i.ID = primitive.NewObjectID()
	i.CreatedAt = now
	i.UpdatedAt = now

	insertResult, err := collection.InsertOne(context.Background(), i)
	if err != nil {
		return err
	}

	slog.Infof("Added issue %v: %+v", i.ID.Hex(), insertResult)

	return nil
}

// DeleteIssue ...
func (r *Repository) DeleteIssue(ID primitive.ObjectID) error {
	collection := r.db.Collection("issues")

	filter := bson.M{"_id": ID}

	deleteResult, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	slog.Infof("Deleted issue %v: %+v", ID, deleteResult)

	return nil
}

// GetIssue ...
func (r *Repository) GetIssue(ID primitive.ObjectID) (*Issue, error) {
	var i Issue

	collection := r.db.Collection("issues")

	filter := bson.M{"_id": ID}

	err := collection.FindOne(context.Background(), filter).Decode(&i)
	if err != nil {
		return &i, err
	}

	return &i, nil
}

// GetIssues ...
func (r *Repository) GetIssues(cursor *primitive.ObjectID, limit int64) (*[]Issue, int64, error) {
	var issues []Issue
	var count int64

	collection := r.db.Collection("issues")

	filter := bson.M{}
	if cursor != nil {
		filter = bson.M{
			"_id": bson.M{
				"$gt": cursor,
			},
		}
	}

	findOptions := options.Find().SetLimit(limit).SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &issues, count, err
	}

	for cur.Next(context.Background()) {
		var i Issue
		err = cur.Decode(&i)
		if err != nil {
			slog.Errorf(err.Error())
			return &issues, count, err
		}

		issues = append(issues, i)
	}

	return &issues, count, nil
}

// GetProjectIssues ...
func (r *Repository) GetProjectIssues(projectID *primitive.ObjectID, cursor *primitive.ObjectID, limit int64) (*[]Issue, int64, error) {
	var issues []Issue
	var count int64

	collection := r.db.Collection("issues")

	filter := make(map[string]interface{})

	if cursor != nil {
		filter["_id"] = bson.M{"$gt": cursor}
	}
	if projectID != nil {
		filter["projectId"] = projectID
	}

	findOptions := options.Find().SetLimit(limit).SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &issues, count, err
	}

	count, err = collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return &issues, count, err
	}

	for cur.Next(context.Background()) {
		var i Issue

		err = cur.Decode(&i)
		if err != nil {
			return &issues, count, err
		}

		issues = append(issues, i)
	}

	return &issues, count, nil
}

// CountProjectBacklogIssues ...
func (r *Repository) CountProjectBacklogIssues(projectID *primitive.ObjectID) (count int64, err error) {
	collection := r.db.Collection("issues")

	filter := make(map[string]interface{})
	filter["projectId"] = projectID
	filter["sprintId"] = bson.M{"$eq": nil}

	return collection.CountDocuments(context.Background(), filter)
}

// CountProjectSprintIssues ...
func (r *Repository) CountProjectSprintIssues(projectID *primitive.ObjectID, sprintID *primitive.ObjectID) (count int64, err error) {
	collection := r.db.Collection("issues")

	filter := make(map[string]interface{})
	filter["projectId"] = projectID
	filter["sprintId"] = sprintID

	return collection.CountDocuments(context.Background(), filter)
}

// GetProjectSprintIssues ...
func (r *Repository) GetProjectSprintIssues(projectID *primitive.ObjectID, sprintID *primitive.ObjectID, cursor *primitive.ObjectID, limit *int64) (*[]Issue, int64, error) {
	var issues []Issue
	var count int64

	collection := r.db.Collection("issues")

	filter := make(map[string]interface{})

	if cursor != nil && !cursor.IsZero() {
		filter["_id"] = bson.M{"$gt": cursor}
	}

	filter["projectId"] = projectID
	filter["sprintId"] = sprintID

	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: 1},
		},
	)

	if limit != nil {
		findOptions.SetLimit(*limit)
	}

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &issues, count, err
	}
	count, err = collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return &issues, count, err
	}

	for cur.Next(context.Background()) {
		var i Issue

		err = cur.Decode(&i)
		if err != nil {
			return &issues, count, err
		}

		issues = append(issues, i)
	}

	return &issues, count, nil
}

// GetProjectBacklogIssues ...
func (r *Repository) GetProjectBacklogIssues(projectID *primitive.ObjectID, cursor *primitive.ObjectID, limit *int64) (*[]Issue, int64, error) {
	var issues []Issue
	var count int64

	collection := r.db.Collection("issues")

	filter := make(map[string]interface{})

	if cursor != nil {
		filter["_id"] = bson.M{"$gt": cursor}
	}
	if projectID != nil {
		filter["projectId"] = projectID
	}

	filter["sprintId"] = bson.M{"$eq": nil}

	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: 1},
		},
	)

	if limit != nil {
		findOptions.SetLimit(*limit)
	}

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &issues, count, err
	}

	count, err = collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return &issues, count, err
	}

	for cur.Next(context.Background()) {
		var i Issue

		err = cur.Decode(&i)
		if err != nil {
			return &issues, count, err
		}

		issues = append(issues, i)
	}

	return &issues, count, nil
}

// UpdateIssues ...
func (r *Repository) UpdateIssues(updates map[primitive.ObjectID]interface{}) error {
	for id, update := range updates {
		err := r.UpdateIssue(id, update.(primitive.M))
		if err != nil {
			return err
		}
	}

	return nil
}

// UpdateIssue ...
func (r *Repository) UpdateIssue(ID primitive.ObjectID, update primitive.M) error {
	collection := r.db.Collection("issues")

	filter := bson.M{"_id": ID}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	slog.Infof("Updated issue %v: %+v", ID.Hex(), updateResult)

	return nil
}

// IssueComment defines the storage form of an issue comment entity.
type IssueComment struct {
	ID        primitive.ObjectID `bson:"_id"`
	IssueID   primitive.ObjectID `bson:"issueId"`
	Text      string             `bson:"text"`
	CreatedBy primitive.ObjectID `bson:"createdBy"`
	CreatedAt time.Time          `bson:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt"`
}

// AddIssueComment ...
func (r *Repository) AddIssueComment(ic *IssueComment) error {
	collection := r.db.Collection("issue_comments")

	now := time.Now()

	ic.ID = primitive.NewObjectID()
	ic.CreatedAt = now
	ic.UpdatedAt = now

	insertResult, err := collection.InsertOne(context.Background(), ic)
	if err != nil {
		return err
	}

	slog.Infof("Added issue comment %v: %+v", ic.ID.Hex(), insertResult)

	return nil
}

// DeleteIssueComment ...
func (r *Repository) DeleteIssueComment(issueID *primitive.ObjectID, commentID *primitive.ObjectID) error {
	collection := r.db.Collection("issue_comments")

	filter := bson.M{"_id": commentID, "issueId": issueID}

	deleteResult, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	if deleteResult.DeletedCount == 0 {
		return fmt.Errorf("Issue comment could not be deleted")
	}

	slog.Infof("Deleted issue comment %v of issue %v: %+v", commentID, issueID, deleteResult)

	return nil
}

// GetIssueComments ...
func (r *Repository) GetIssueComments(issueID *primitive.ObjectID, cursor *primitive.ObjectID, limit int64) (*[]IssueComment, int64, error) {
	var issueComments []IssueComment
	var count int64

	collection := r.db.Collection("issue_comments")

	filter := bson.M{"issueId": issueID}

	if cursor != nil {
		filter = bson.M{
			"issueId": issueID,
			"_id": bson.M{
				"$gt": cursor,
			},
		}
	}

	findOptions := options.Find().SetLimit(limit).SetSort(
		bson.D{
			primitive.E{Key: "createdAt", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &issueComments, count, err
	}

	count, err = collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return &issueComments, count, err
	}

	for cur.Next(context.Background()) {
		var ic IssueComment

		err = cur.Decode(&ic)
		if err != nil {
			return &issueComments, count, err
		}

		issueComments = append(issueComments, ic)
	}

	return &issueComments, count, nil
}

// UpdateIssueComment ...
func (r *Repository) UpdateIssueComment(issueID *primitive.ObjectID, commentID *primitive.ObjectID, update *primitive.M) error {
	collection := r.db.Collection("issue_comments")

	filter := bson.M{"_id": commentID, "issueId": issueID}

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

	slog.Infof("Updated issue comment %v for issue %v: %+v", commentID.Hex(), issueID.Hex(), updateResult)

	return nil
}

// IssueType defines the storage form of an issue type entity.
type IssueType struct {
	ID          string `bson:"_id"`
	Name        string `bson:"name"`
	Description string `bson:"description"`
	IsDefault   bool   `bson:"isDefault"`
}

// GetIssueTypes ...
func (r *Repository) GetIssueTypes() (*[]IssueType, error) {
	var issueTypes = []IssueType{}

	collection := r.db.Collection("issue_types")

	filter := bson.D{}
	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "name", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &issueTypes, err
	}

	for cur.Next(context.Background()) {
		var it IssueType
		err = cur.Decode(&it)
		if err != nil {
			return &issueTypes, err
		}

		issueTypes = append(issueTypes, it)
	}

	return &issueTypes, nil
}

// IssueStatus defines the storage form of an issue status entity.
type IssueStatus struct {
	ID          string `bson:"_id"`
	Name        string `bson:"name"`
	Description string `bson:"description"`
	CategoryID  string `bson:"categoryId"`
	Ordinal     int32  `bson:"ordinal"`
	IsDefault   bool   `bson:"isDefault"`
}

// AddIssueStatus ...
func (r *Repository) AddIssueStatus(is *IssueStatus) error {
	collection := r.db.Collection("issue_statuses")

	insertResult, err := collection.InsertOne(context.Background(), is)
	if err != nil {
		return err
	}

	slog.Infof("Added issue status %v: %+v", is.ID, insertResult)

	return nil
}

// GetIssueStatuses ...
func (r *Repository) GetIssueStatuses(term *string, sort int32) ([]IssueStatus, error) {
	var issueStatuses = []IssueStatus{}
	var err error

	collection := r.db.Collection("issue_statuses")
	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: sort},
		},
	)
	filter := bson.D{}

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
		return issueStatuses, err
	}

	for cur.Next(context.Background()) {
		// Create a value into which the single document can be decoded
		var is IssueStatus
		err = cur.Decode(&is)
		if err != nil {
			return issueStatuses, err
		}

		issueStatuses = append(issueStatuses, is)
	}

	return issueStatuses, nil
}

// SwitchIssueStatusOrdinals ...
func (r *Repository) SwitchIssueStatusOrdinals(inc *IssueStatus, dec *IssueStatus) error {
	collection := r.db.Collection("issue_statuses")

	type IssueStatusUpdater struct {
		ID     *string
		Filter interface{}
		Update interface{}
	}

	updates := []IssueStatusUpdater{
		{ID: &dec.ID, Filter: bson.M{"_id": dec.ID}, Update: bson.M{"$inc": bson.M{"ordinal": -1}}},
		{ID: &inc.ID, Filter: bson.M{"_id": inc.ID}, Update: bson.M{"$inc": bson.M{"ordinal": 1}}},
	}

	for _, u := range updates {
		updateResult, err := collection.UpdateOne(context.Background(), u.Filter, u.Update)
		if err != nil {
			return err
		}

		slog.Infof("Updated issue status %v: %+v", u.ID, updateResult)
	}

	return nil
}

// UpdateIssueStatus ...
func (r *Repository) UpdateIssueStatus(ID string, update primitive.M) error {
	collection := r.db.Collection("issue_statuses")

	filter := bson.M{"_id": ID}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	slog.Infof("Updated issue status %v: %+v", ID, updateResult)

	return nil
}

// Label defines the storage form of an label entity.
type Label struct {
	ID    primitive.ObjectID `bson:"_id"`
	Label string             `bson:"label"`
}

// AddLabels ...
func (r *Repository) AddLabels(l *[]Label) error {
	if len(*l) == 0 {
		return nil
	}

	collection := r.db.Collection("labels")

	var labels []interface{}
	for _, t := range *l {
		t.ID = primitive.NewObjectID()
		labels = append(labels, t)
	}

	insertResult, err := collection.InsertMany(context.Background(), labels)
	if err != nil {
		return err
	}

	slog.Infof("Added %v labels: %+v", len(insertResult.InsertedIDs), insertResult)

	return nil
}

// GetLabels ...
func (r *Repository) GetLabels(term *string) (*[]Label, error) {
	var labels []Label

	collection := r.db.Collection("labels")

	filter := bson.D{}
	if len(*term) > 0 {
		filter = bson.D{
			primitive.E{
				Key:   "label",
				Value: primitive.Regex{Pattern: *term, Options: "i"},
			},
		}
	}

	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "label", Value: 1},
		},
	)

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return &labels, err
	}

	for cur.Next(context.Background()) {
		var l Label

		err = cur.Decode(&l)
		if err != nil {
			return &labels, err
		}

		labels = append(labels, l)
	}

	return &labels, nil
}

// PriorityType defines the storage form of a priority type entity.
type PriorityType struct {
	ID          string `bson:"_id"`
	Name        string `bson:"name"`
	Description string `bson:"description"`
	Color       string `bson:"color"`
	Ordinal     int32  `bson:"ordinal"`
	IsDefault   bool   `bson:"isDefault"`
}

// AddPriorityType ...
func (r *Repository) AddPriorityType(pt *PriorityType) error {
	collection := r.db.Collection("priority_types")

	insertResult, err := collection.InsertOne(context.Background(), pt)
	if err != nil {
		return err
	}

	slog.Infof("Added priority type %v: %+v", pt.ID, insertResult)

	return nil
}

// GetPriorityTypes ...
func (r *Repository) GetPriorityTypes(sort int32) ([]PriorityType, error) {
	var priorityTypes []PriorityType

	collection := r.db.Collection("priority_types")

	findOptions := options.Find().SetSort(
		bson.D{
			primitive.E{Key: "ordinal", Value: sort},
		},
	)

	filter := bson.D{}

	cur, err := collection.Find(context.Background(), filter, findOptions)
	defer cur.Close(context.Background())
	if err != nil {
		return priorityTypes, err
	}

	for cur.Next(context.Background()) {
		// Create a value into which the single document can be decoded
		var pt PriorityType
		err = cur.Decode(&pt)
		if err != nil {
			return priorityTypes, err
		}

		priorityTypes = append(priorityTypes, pt)
	}

	return priorityTypes, nil
}

// SwitchPriorityTypeOrdinals ...
func (r *Repository) SwitchPriorityTypeOrdinals(inc *PriorityType, dec *PriorityType) error {
	collection := r.db.Collection("priority_types")

	type PriorityTypeUpdater struct {
		ID     *string
		Filter interface{}
		Update interface{}
	}

	updates := []PriorityTypeUpdater{
		{ID: &dec.ID, Filter: bson.M{"_id": dec.ID}, Update: bson.M{"$inc": bson.M{"ordinal": -1}}},
		{ID: &inc.ID, Filter: bson.M{"_id": inc.ID}, Update: bson.M{"$inc": bson.M{"ordinal": 1}}},
	}

	for _, u := range updates {
		updateResult, err := collection.UpdateOne(context.Background(), u.Filter, u.Update)
		if err != nil {
			return err
		}

		slog.Infof("Updated priority type %v: %+v", u.ID, updateResult)
	}

	return nil
}

// UpdatePriorityType ...
func (r *Repository) UpdatePriorityType(ID string, update primitive.M) error {
	collection := r.db.Collection("priority_types")

	filter := bson.M{"_id": ID}

	updateResult, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	slog.Infof("Updated priority type %v: %+v", ID, updateResult)

	return nil
}
