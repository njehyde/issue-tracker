package deleting

// EventType defines a custom type for events.
type EventType string

const (
	// IssueDeleted defines the EventType for when an issue has been deleted.
	IssueDeleted EventType = "ISSUE_DELETED"
	// IssueCommentDeleted defines the EventType for when an issue comment has been deleted.
	IssueCommentDeleted EventType = "ISSUE_COMMENT_DELETED"
	// ProjectDeleted defines the EventType for when a project has been deleted.
	ProjectDeleted EventType = "PROJECT_DELETED"
	// ProjectBoardSprintDeleted defines the EventType for when a project board sprint has been deleted.
	ProjectBoardSprintDeleted EventType = "PROJECT_BOARD_SPRINT_DELETED"
)

// Message ...
type Message struct {
	Type    EventType   `json:"type"`
	Payload interface{} `json:"payload"`
}

// IssueDeletedPayload defines the payload of data for an issue deleted event.
type IssueDeletedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
	IssueID   string `json:"issueId"`
}

// IssueCommentDeletedPayload defines the payload of data for an issue comment deleted event.
type IssueCommentDeletedPayload struct {
	UserID    string `json:"userId"`
	IssueID   string `json:"issueId"`
	CommentID string `json:"commentId"`
}

// ProjectDeletedPayload defines the payload of data for a project deleted event.
type ProjectDeletedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
}

// ProjectBoardSprintDeletedPayload defines the payload of data for a project board sprint deleted event.
type ProjectBoardSprintDeletedPayload struct {
	UserID    string `json:"userId"`
	ProjectID string `json:"projectId"`
	BoardID   string `json:"boardId"`
	SprintID  string `json:"sprintId"`
}
