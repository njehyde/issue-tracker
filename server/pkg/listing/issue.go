package listing

import (
	"time"
)

// Category defines the listing form of a category entity.
type Category struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Ordinal int32  `json:"ordinal"`
}

// Issue defines the listing form of an issue entity.
type Issue struct {
	ID          string    `json:"id"`
	ProjectID   string    `json:"projectId"`
	SprintID    string    `json:"sprintId,omitempty"`
	ProjectRef  string    `json:"projectRef"`
	Type        string    `json:"type"`
	Summary     string    `json:"summary"`
	Description string    `json:"description,omitempty"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	Points      int32     `json:"points,omitempty"`
	Ordinal     int32     `json:"ordinal"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	ReporterID  string    `json:"reporterId"`
	AssigneeID  string    `json:"assigneeId,omitempty"`
	Labels      []string  `json:"labels,omitempty"`
	// DevAssigneeID
	// QaAssigneeID
	// SprintID
	// Links
	// Events
}

// IssueComment defines the listing form of an issue comment entity.
type IssueComment struct {
	ID        string    `json:"id"`
	Text      string    `json:"text"`
	CreatedBy User      `json:"createdBy"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// IssueStatus defines the listing form of an issue status entity.
type IssueStatus struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Ordinal     int32  `json:"ordinal"`
	IsDefault   bool   `json:"default"`
}

// IssueType defines the listing form of an issue type entity.
type IssueType struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	IsDefault   bool   `json:"default"`
}

// Label defines the listing form of a label entity.
type Label struct {
	ID    string `json:"id"`
	Label string `json:"label"`
}

// PriorityType defines the listing form of a priotity type entity.
type PriorityType struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Color       string `json:"color"`
	Ordinal     int32  `json:"ordinal"`
	IsDefault   bool   `json:"default"`
}

// Pagination defines the listing form of a pagination.
type Pagination struct {
	PageSize int    `json:"pageSize"`
	Cursor   string `json:"cursor"`
}

// Metadata defines the listing form of a metadata.
type Metadata struct {
	Pagination *Pagination `json:"pagination"`
	Count      int64       `json:"count"`
}
