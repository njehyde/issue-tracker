package adding

import "fmt"

// Project defines the adding form of a project entity.
type Project struct {
	Key               string `json:"key"`
	Name              string `json:"name"`
	Type              string `json:"type"`
	Description       string `json:"description,omitempty"`
	LeadID            string `json:"leadId,omitempty"`
	DefaultAssigneeID string `json:"defaultAssigneeId,omitempty"`
	DefaultBoardType  string `json:"defaultBoardType"`
}

func validateAddProject(p *Project) error {
	if p == nil {
		return fmt.Errorf("Project is nil")
	}
	if len(p.Key) == 0 {
		return fmt.Errorf("'key' is empty")
	}
	if len(p.Name) == 0 {
		return fmt.Errorf("'name' is empty")
	}
	if len(p.Type) == 0 {
		return fmt.Errorf("'type' is empty")
	}
	if len(p.DefaultBoardType) == 0 {
		return fmt.Errorf("'defaultBoardType' is empty")
	}

	return nil
}
