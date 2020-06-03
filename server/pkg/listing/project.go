package listing

import (
	"time"
)

// ProjectType defines the listing form of a project type entity.
type ProjectType struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	IsDefault bool   `json:"default"`
}

// Project defines the listing form of a project entity.
type Project struct {
	ID                string    `json:"id"`
	Key               string    `json:"key"`
	Name              string    `json:"name"`
	Type              string    `json:"type"`
	Description       string    `json:"description"`
	LeadID            string    `json:"leadId"`
	DefaultAssigneeID string    `json:"defaultAssigneeId"`
	DefaultBoardID    string    `json:"defaultBoardId"`
	Boards            []Board   `json:"boards"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}
