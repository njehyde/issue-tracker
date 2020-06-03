package listing

import "time"

// Board defines the listing form of a board entity.
type Board struct {
	ID               string        `json:"id"`
	Type             string        `json:"type"`
	Name             string        `json:"name"`
	Description      string        `json:"description"`
	IsBacklogVisible bool          `json:"isBacklogVisible"`
	IsBoardVisible   bool          `json:"isBoardVisible"`
	Columns          []BoardColumn `json:"columns"`
	Sprints          []Sprint      `json:"sprints"`
	CreatedAt        *time.Time    `json:"createdAt"`
	UpdatedAt        *time.Time    `json:"updatedAt"`
}

// BoardColumn defines the listing form of a board column Value Object.
type BoardColumn struct {
	Name          string   `json:"name"`
	IssueStatuses []string `json:"issueStatuses"`
	Ordinal       int32    `json:"ordinal"`
}

// BoardType defines the listing form of a board type entity.
type BoardType struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	IsDefault bool   `json:"default"`
}

// Sprint defines the listing form of a sprint entity.
type Sprint struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Goal      string     `json:"goal,omitempty"`
	Ordinal   int32      `json:"ordinal,omitempty"`
	StartAt   *time.Time `json:"startAt,omitempty"`
	EndAt     *time.Time `json:"endAt,omitempty"`
	CreatedAt *time.Time `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
	CreatedBy string     `json:"createdBy"`
}

// WorkflowStep defines the listing form of a workflow step Value Object.
type WorkflowStep struct {
	Name       string   `json:"name"`
	Ordinal    int32    `json:"ordinal"`
	CategoryID string   `json:"categoryId"`
	StatusIds  []string `json:"statusIds"`
}

// Workflow defines the listing form of a workflow entity.
type Workflow struct {
	ID       int32          `json:"id"`
	Name     string         `json:"name"`
	IsLocked bool           `json:"isLocked"`
	Steps    []WorkflowStep `json:"steps"`
}
