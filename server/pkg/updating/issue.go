package updating

// Issue defines the updating form of an issue entity.
type Issue struct {
	SprintID    string `json:"sprintId"`
	Type        string `json:"type"`
	Summary     string `json:"summary"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status"`
	Priority    string `json:"priority"`
	Points      int32  `json:"points,omitempty"`
	AssigneeID  string `json:"assigneeId,omitempty"`
	Ordinal     int32  `json:"ordinal"`
}

// IssueOrdinal defines the updating form of an issue ordinal.
type IssueOrdinal struct {
	ID      string `json:"id"`
	Ordinal int32  `json:"ordinal"`
	Status  string `json:"status"`
}

// IssueOrdinals defines the updating issue ordinals request
type IssueOrdinals struct {
	IssueOrdinals *[]IssueOrdinal `json:"issueOrdinals"`
}

// SendIssueToSprintMetadata holds additional metadata relating to issue being sent to a sprint.
type SendIssueToSprintMetadata struct {
	Status string `json:"status"`
}

// IssueComment defines the updating form of an issue comment entity.
type IssueComment struct {
	Text string `json:"text"`
}

// IssueStatus defines the updating form of an issue status entity.
type IssueStatus struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

// PriorityType defines the updating form of a priotity type entity.
type PriorityType struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Color       string `json:"color"`
}
