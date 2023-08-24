package models

import (
	"backend/db"
	"database/sql"

	"github.com/lib/pq"
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
	Enabled  StatusType = "enabled"
	Disabled StatusType = "disabled"
)

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

type CreateProblem struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description"`
	Answer      string         `json:"answer"`
	Difficulty  DifficultyType `json:"difficulty" validate:"required,easy|medium|hard"`
	Types       pq.Int32Array `json:"types"`
}

type Problem struct {
	CreateProblem
	Id        int    `json:"id"`
	CreatedAt string `json:"createdAt"`
	CreatedBy string `json:"createdBy"`
	UpdatedAt string `json:"updatedAt"`
	UpdatedBy string `json:"updatedBy"`
}

type ProblemListItem struct {
	Id         int             `json:"id"`
	Name       string          `json:"name"`
	Status     SolveStatusType `json:"status"`
	Answers    int             `json:"answers"`
	PassRate   int             `json:"passRate"`
	Difficulty DifficultyType  `json:"difficulty"`
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
	Types      pq.StringArray  `json:"types"`
	Status     StatusType     `json:"status"`
	Difficulty DifficultyType `json:"difficulty"`
	CreatedAt  string     `json:"createdAt"`
}

type ProblemTypeListItem struct {
	Id     int        `json:"id"`
	Name   string     `json:"name"`
}

type ProblemType struct {
	ProblemListItem
	Status StatusType `json:"status"`
	CreatedAt string `json:"createdAt"`
	CreatedBy string `json:"createdBy"`
	UpdatedAt string `json:"updatedAt"`
	UpdatedBy string `json:"updatedBy"`
}

func AddProblem(name string, description string, answer string, difficulty DifficultyType, types pq.Int32Array, createdBy int) error {
	var _ int
	var lastInsertId int64

	err := db.DB.QueryRow("INSERT INTO problems(name, description, difficulty, types, created_by) VALUES($1, $2, $3, $4, $5) RETURNING id", name, description, difficulty, types, createdBy).Scan(&lastInsertId)

	if err != nil {
		return err
	}

	err = db.DB.QueryRow("INSERT INTO problem_answers(problem_id, answer, created_by) VALUES($1, $2, $3) RETURNING id", lastInsertId, answer, createdBy).Scan(&lastInsertId)

	_ = lastInsertId

	return err
}

func GetProblems(status StatusType) (*sql.Rows, error) {
	var rows *sql.Rows
	var err error
	
	if status == "" {
		rows, err = db.DB.Query("SELECT id, name, difficulty FROM problems")
	} else {
		rows, err = db.DB.Query("SELECT id, name, difficulty FROM problems WHERE status = $1", status)
	}

	return rows, err
}

func GetProblemsByUserId(userId int) (*sql.Rows, error) {
	rows, err := db.DB.Query("SELECT p.id, p.name, ARRAY (SELECT pt.name FROM problem_types pt WHERE pt.id = ANY (p.types)), p.difficulty, p.status, p.created_at FROM problems p WHERE p.created_by = $1", userId)

	return rows, err
}

func GetProblemTypes(status StatusType) (*sql.Rows, error) {
	var rows *sql.Rows
	var err error
	
	if status == "" {
		rows, err = db.DB.Query("SELECT id, name FROM problem_types")
		} else {
		rows, err = db.DB.Query("SELECT id, name FROM problem_types WHERE status = $1", status)
	}


	return rows, err
}
