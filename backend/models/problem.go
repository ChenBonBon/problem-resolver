package models

import (
	"backend/db"
	"backend/db/models"
	"time"

	"github.com/lib/pq"
)

type StatusType string

const (
	Enabled  StatusType = "Enabled"
	Disabled StatusType = "Disabled"
)

type DifficultyType string

const (
	Easy   DifficultyType = "easy"
	Medium DifficultyType = "medium"
	Hard   DifficultyType = "hard"
)

type SolveStatusType string

const (
	Unsolved   SolveStatusType = "unsolved"
	Processing SolveStatusType = "processing"
	Solved     SolveStatusType = "solved"
)

type Example struct {
	Id          int    `json:"id"`
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation"`
	Image       string `json:"image"`
}

type CreateProblemItem struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description"`
	Answer      string         `json:"answer"`
	Difficulty  DifficultyType `json:"difficulty" validate:"required,easy|medium|hard"`
	Types       pq.Int32Array  `gorm:"column:types;type:integer[]" json:"types"`
}

type UpdateProblemItem struct {
	CreateProblemItem
	Status    StatusType `json:"status"`
	UpdatedBy int32      `json:"updatedBy"`
	UpdatedAt time.Time  `json:"updatedAt"`
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
	Id     int             `json:"id"`
	Name   string          `json:"name"`
	Types  pq.StringArray  `gorm:"column:types;type:character varying(255)[]" json:"types"`
	Status SolveStatusType `json:"status"`
	// Answers    int             `json:"answers"`
	// PassRate   int             `json:"passRate"`
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
	Types      pq.StringArray `gorm:"column:types;type:character varying(255)[]" json:"types"`
	Status     StatusType     `json:"status"`
	Difficulty DifficultyType `json:"difficulty"`
	CreatedAt  string         `json:"createdAt"`
}

type ProblemTypeListItem struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type ProblemType struct {
	ProblemListItem
	Status    StatusType `json:"status"`
	CreatedAt string     `json:"createdAt"`
	CreatedBy string     `json:"createdBy"`
	UpdatedAt string     `json:"updatedAt"`
	UpdatedBy string     `json:"updatedBy"`
}

func AddProblem(name string, description string, answer string, difficulty DifficultyType, types pq.Int32Array, createdBy int32) error {
	problem := models.Problem{
		Name:        name,
		Description: description,
		Difficulty:  string(difficulty),
		Types:       types,
		CreatedBy:   createdBy,
		UpdatedBy:   createdBy,
	}

	result := db.DB.Debug().Create(&problem)

	if result.Error != nil {
		return result.Error
	}

	problemAnswer := models.ProblemAnswer{
		ProblemID: problem.ID,
		Answer:    answer,
		CreatedBy: createdBy,
		UpdatedBy:   createdBy,
	}

	result = db.DB.Create(&problemAnswer)

	return result.Error
}

func GetProblems(status StatusType) ([]ProblemListItem, error) {
	var problems []ProblemListItem

	subQuery := db.DB.Table("problems as p, problem_types as pt").Select("ARRAY [pt.name] as types").Where("pt.id = ANY (p.types)")

	if status == "" {
		result := db.DB.Model(&models.Problem{}).Find(&problems)

		return problems, result.Error
	}

	result := db.DB.Table("(?) as sub ,problems as p", subQuery).Select("p.id", "p.name", "sub.types", "COALESCE(up.status, 'unsolved') as status", "difficulty").Joins("left join user_problems as up on up.problem_id = p.id").Where("p.status = ?", status).Find(&problems)

	return problems, result.Error
}

func GetProblemsByUserId(userId int32) ([]UserProblemListItem, error) {
	var problems []UserProblemListItem

	subQuery := db.DB.Table("problems as p, problem_types as pt").Select("ARRAY [pt.name] as types").Where("pt.id = ANY (p.types)")

	result := db.DB.Table("(?) as sub ,problems as p", subQuery).Select("p.id", "p.name", "sub.types", "difficulty", "p.status", "p.created_at").Where("p.created_by = ?", userId).Find(&problems)

	return problems, result.Error
}

func GetProblemTypes(status StatusType) ([]models.ProblemType, error) {
	var problemTypes []models.ProblemType

	if status == "" {
		result := db.DB.Select("id", "name").Find(&problemTypes)

		return problemTypes, result.Error
	}
	result := db.DB.Select("id", "name").Where("status = ?", status).Find(&problemTypes)

	return problemTypes, result.Error
}

func UpdateProblem(id int32, items UpdateProblemItem, userId int32) error {
	problem := models.Problem{}
	problemAnswer := models.ProblemAnswer{}
	nameSet := []string{
		"updated_by",
		"updated_at",
	}

	if items.Name != "" {
		nameSet = append(nameSet, "name")
	}

	if items.Description != "" {
		nameSet = append(nameSet, "description")
	}

	if items.Difficulty != "" {
		nameSet = append(nameSet, "difficulty")
	}

	if items.Status != "" {
		nameSet = append(nameSet, "status")
	}

	if items.Types != nil {
		nameSet = append(nameSet, "types")
	}

	items.UpdatedBy = userId
	items.UpdatedAt = time.Now()

	result := db.DB.Model(&problem).Select(nameSet).Where("id = ?", id).Updates(items)

	if items.Answer != "" {
		db.DB.Model(&problemAnswer).Select("answer = ? AND updated_by = ? AND updated_at = ?").Where("problem_id = ? AND created_by = ?", items.Answer, userId).Updates(items)
	}

	return result.Error
}
