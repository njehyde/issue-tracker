package updating

// EventType defines a custom type for events.
type EventType string

const (
	// IssueUpdated defines the EventType for when an issue has been updated.
	IssueUpdated EventType = "ISSUE_UPDATED"
	// IssueCommentUpdated defines the EventType for when an issue comment has been updated.
	IssueCommentUpdated EventType = "ISSUE_COMMENT_UPDATED"
	// ProjectUpdated defines the EventType for when a project has been updated.
	ProjectUpdated EventType = "PROJECT_UPDATED"
	// ProjectBoardSprintUpdated defines the EventType for when a project board sprint has been updated.
	ProjectBoardSprintUpdated EventType = "PROJECT_BOARD_SPRINT_UPDATED"
)

// Message ...
type Message struct {
	Type    EventType   `json:"type"`
	Payload interface{} `json:"payload"`
}

// IssueUpdatedPayload defines the payload of data for an issue updated event.
type IssueUpdatedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
	IssueID   string `json:"issueId"`
}

// IssueCommentUpdatedPayload defines the payload of data for an issue comment updated event.
type IssueCommentUpdatedPayload struct {
	UserID    string `json:"userId"`
	IssueID   string `json:"issueId"`
	CommentID string `json:"commentId"`
}

// ProjectUpdatedPayload defines the payload of data for a project updated event.
type ProjectUpdatedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
}

// ProjectBoardSprintUpdatedPayload defines the payload of data for a project board sprint updated event.
type ProjectBoardSprintUpdatedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
	BoardID   string `json:"boardId"`
	SprintID  string `json:"sprintId"`
}
