package models

import (
	"backend/db"
	"database/sql"
)

type StatusType string
type SolveStatusType string
type DifficultyType string

type Example struct {
	Id          int    `json:"id"`
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation"`
	Image       string `json:"image"`
}

const (
	Unsolved   SolveStatusType = "unsolved"
	Processing SolveStatusType = "processing"
	Solved     SolveStatusType = "solved"
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
	Status     SolveStatusType     `json:"status"`
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

type UserProblemListItem struct {
	Id         int            `json:"id"`
	Name       string         `json:"name"`
	Status     StatusType     `json:"status"`
	Difficulty DifficultyType `json:"difficulty"`
}

func AddProblem(name string, description string, difficulty DifficultyType, createdBy int) error {
	var _ int64
	var lastInsertId int64

	err := db.DB.QueryRow("INSERT INTO problems(name, description, difficulty, created_by) VALUES($1, $2, $3, $4) RETURNING id", name, description, difficulty, createdBy).Scan(&lastInsertId)

	_ = lastInsertId

	return err
}

func GetProblems() (*sql.Rows, error) {
	rows, err := db.DB.Query("SELECT id, name, difficulty FROM problems")

	return rows, err
}

func GetProblemsByUserId(userId int) (*sql.Rows, error) {
	rows, err := db.DB.Query("SELECT id, name, difficulty, status FROM problems WHERE created_by = $1", userId)

	return rows, err
}