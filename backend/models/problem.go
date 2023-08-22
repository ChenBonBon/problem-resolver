package models

type StatusType string
type DifficultyType string

type Example struct {
	Id          int    `json:"id"`
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

type ProblemForm struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description"`
	Difficulty  DifficultyType `json:"difficulty" validate:"required,easy|medium|hard"`
}

type Problem struct {
	ProblemForm
	Id          int            `json:"id"`
	CreatedAt   string         `json:"created_at"`
	CreatedBy   string         `json:"created_by"`
	UpdatedAt   string         `json:"updated_at"`
	UpdatedBy   string         `json:"updated_by"`
}

type ProblemListItem struct {
	Id         int            `json:"id"`
	Name       string         `json:"name"`
	Status     StatusType     `json:"status"`
	Answers    int            `json:"answers"`
	PassRate   int            `json:"pass_rate"`
	Difficulty DifficultyType `json:"difficulty"`
}

type ProblemItem struct {
	Id          int            `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Difficulty  DifficultyType `json:"difficulty"`
	Examples    []Example      `json:"examples"`
}
