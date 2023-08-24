package models

import (
	"backend/db"
	"backend/utils"
	"database/sql"
	"strings"

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

type CreateProblemItem struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description"`
	Answer      string         `json:"answer"`
	Difficulty  DifficultyType `json:"difficulty" validate:"required,easy|medium|hard"`
	Types       pq.Int32Array `json:"types"`
}

type UpdateProblemItem struct {
	CreateProblemItem
	Status StatusType `json:"status"`
}

type Problem struct {
	CreateProblemItem
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

func UpdateProblem(id int, items UpdateProblemItem, userId int) error {
	nameSet := []string{}
	valueSet := []interface{}{}

	if items.Name != "" {
		nameSet = append(nameSet, "name = " + utils.AutoQueryPlaceholder(nameSet, 3))
		valueSet = append(valueSet, items.Name)
	}

	if (items.Description != "") {
		nameSet = append(nameSet, "description = " + utils.AutoQueryPlaceholder(nameSet, 3))
		valueSet = append(valueSet, items.Description)
	}

	if (items.Answer != "") {
		nameSet = append(nameSet, "answer = " + utils.AutoQueryPlaceholder(nameSet, 3))
		valueSet = append(valueSet, items.Answer)
	}

	if (items.Difficulty != "") {
		nameSet = append(nameSet, "difficulty = " + utils.AutoQueryPlaceholder(nameSet, 3))
		valueSet = append(valueSet, items.Difficulty)
	}

	if (items.Status != "") {
		nameSet = append(nameSet, "status = " + utils.AutoQueryPlaceholder(nameSet, 3))
		valueSet = append(valueSet, items.Status)
	}

	if (items.Types != nil) {
		nameSet = append(nameSet, "types = " + utils.AutoQueryPlaceholder(nameSet, 3))
		valueSet = append(valueSet, items.Types)
	}

	sql := "UPDATE problems SET updated_by = $2, updated_at = NOW(), " + strings.Join(nameSet, ", ") + " WHERE id = $1"

	println("sql: ", sql)

	stmt, err := db.DB.Prepare(sql)

	if err != nil {
		return err
	}

	slice := []interface{}{id, userId}
	slice = append(slice, valueSet...)

	println("slice: ", slice)
	res, err := stmt.Exec(slice...)

	if err != nil {
		return err
	}

	var _ int64
	affected, err := res.RowsAffected()

	_ = affected

	if err != nil {
		return err
	}

	return nil
}