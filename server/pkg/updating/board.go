package updating

import "time"

// Sprint ...
type Sprint struct {
	Name    string    `json:"name"`
	Goal    string    `json:"goal,omitempty"`
	StartAt time.Time `json:"startAt,omitempty"`
	EndAt   time.Time `json:"endAt,omitempty"`
}
