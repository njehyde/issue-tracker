package updating

// Project defines the updating form of a project entity.
type Project struct {
	Name              string `json:"name,omitempty"`
	Type              string `json:"type,omitempty"`
	Description       string `json:"description,omitempty"`
	LeadID            string `json:"leadId,omitempty"`
	DefaultAssigneeID string `json:"defaultAssigneeId,omitempty"`
}
