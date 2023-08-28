// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package models

import (
	"time"
)

const TableNameUserProblem = "user_problems"

// UserProblem mapped from table <user_problems>
type UserProblem struct {
	ID        int32     `gorm:"column:id;primaryKey;autoIncrement:true" json:"id"`
	UserID    int32     `gorm:"column:user_id;not null" json:"user_id"`
	ProblemID int32     `gorm:"column:problem_id;not null" json:"problem_id"`
	Status    string    `gorm:"column:status;not null;default:'Enabled'" json:"status"`
	CreatedAt time.Time `gorm:"column:created_at;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

// TableName UserProblem's table name
func (*UserProblem) TableName() string {
	return TableNameUserProblem
}