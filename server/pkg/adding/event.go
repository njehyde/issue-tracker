package adding

// EventType defines a custom type for events.
type EventType string

const (
	// IssueAdded defines the EventType for when an issue has been added.
	IssueAdded EventType = "ISSUE_ADDED"
	// IssueCommentAdded defines the EventType for when an issue comment has been added.
	IssueCommentAdded EventType = "ISSUE_COMMENT_ADDED"
	// ProjectAdded defines the EventType for when a project has been added.
	ProjectAdded EventType = "PROJECT_ADDED"
	// ProjectBoardSprintAdded defines the EventType for when a project board sprint has been added.
	ProjectBoardSprintAdded EventType = "PROJECT_BOARD_SPRINT_ADDED"
)

// Message ...
type Message struct {
	Type    EventType   `json:"type"`
	Payload interface{} `json:"payload"`
}

// IssueAddedPayload defines the payload of data for an issue added event.
type IssueAddedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
}

// IssueCommentAddedPayload defines the payload of data for an issue comment added event.
type IssueCommentAddedPayload struct {
	UserID  string `json:"userId"`
	IssueID string `json:"issueId"`
}

// ProjectAddedPayload defines the payload of data for a project added event.
type ProjectAddedPayload struct {
	UserID string `json:"userId"`
}

// ProjectBoardSprintAddedPayload defines the payload of data for a project board sprint added event.
type ProjectBoardSprintAddedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
	BoardID   string `json:"boardId"`
}
