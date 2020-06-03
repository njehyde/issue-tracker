package adding

// Issue defines the adding form of an issue entity.
type Issue struct {
	ProjectID   string  `json:"projectID"`
	Type        string  `json:"type"`
	Summary     string  `json:"summary"`
	Description string  `json:"description,omitempty"`
	Status      string  `json:"status"`
	Priority    string  `json:"priority"`
	Points      int32   `json:"points,omitempty"`
	ReporterID  string  `json:"reporterId"`
	AssigneeID  string  `json:"assigneeId,omitempty"`
	Labels      []Label `json:"labels,omitempty"`
}

// IssueComment defines the adding form of an issue comment entity.
type IssueComment struct {
	Text string `json:"text"`
}

// IssueStatus defines the adding form of an issue status entity.
type IssueStatus struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

// Label defines the adding form of a label entity.
type Label struct {
	IsNew bool   `json:"isNew"`
	Value string `json:"value"`
}

// PriorityType defines the adding form of a priority type entity.
type PriorityType struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Color       string `json:"color"`
}
