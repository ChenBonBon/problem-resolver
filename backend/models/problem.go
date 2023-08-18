package models

type StatusType string
type DifficultyType string

type Example struct {
	Id          string `json:"id"`
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation"`
	Image       string `json:"image"`
}

const (
	Unsolved   StatusType = "unsolved"
	Processing StatusType = "processing"
	Solved     StatusType = "solved"
)

const (
	Easy   DifficultyType = "easy"
	Medium DifficultyType = "medium"
	Hard   DifficultyType = "hard"
)

type Problem struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
	CreatedBy   string `json:"created_by"`
	UpdatedAt   string `json:"updated_at"`
	UpdatedBy   string `json:"updated_by"`
}

type ProblemListItem struct {
	Id         string         `json:"id"`
	Name       string         `json:"name"`
	Status     StatusType     `json:"status"`
	Answers    int            `json:"answers"`
	PassRate   int            `json:"pass_rate"`
	Difficulty DifficultyType `json:"difficulty"`
}

type ProblemItem struct {
	Id          string         `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Examples    []Example      `json:"examples"`
	Difficulty  DifficultyType `json:"difficulty"`
}
