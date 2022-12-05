package supportbundles

import "context"

type SupportItem struct {
	Filename  string
	FileBytes []byte
}

type State string

const (
	StatePending  State = "pending"
	StateComplete State = "complete"
	StateError    State = "error"
	StateTimeout  State = "timeout"
)

func (s State) String() string {
	return string(s)
}

type Bundle struct {
	UID       string `json:"uid"`
	State     State  `json:"state"`
	FilePath  string `json:"filePath"`
	Creator   string `json:"creator"`
	CreatedAt int64  `json:"createdAt"`
	ExpiresAt int64  `json:"expiresAt"`
}

type CollectorFunc func(context.Context) (*SupportItem, error)
type Service interface {
	RegisterSupportItemCollector(name string, collector CollectorFunc)
}
