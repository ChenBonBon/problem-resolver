package models

import (
	"backend/db"
	"time"
)

type LoginWithPassword struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginWithCode struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code" validate:"required"`
}

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
}

type UserCode struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	Code      string `json:"code"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	Used      bool   `json:"used"`
}

func AddCode(email string, code string) error {
	var _ int64
	var lastInsertId int64
	err := db.DB.QueryRow("INSERT INTO user_codes(email, code) VALUES($1, $2) RETURNING id", email, code).Scan(&lastInsertId)

	_ = lastInsertId

	return err
}

func GetUserByEmail(email string) (int, error) {
	var userId int
	err := db.DB.QueryRow("SELECT id FROM users WHERE email = $1", email).Scan(&userId)

	return userId, err
}

func GetUserByPassword(username string, password string) (int, error) {
	var userId int
	err := db.DB.QueryRow("SELECT id FROM users WHERE username = $1 AND password = $2", username, password).Scan(&userId)

	return userId, err
}

func GetCodeStatus(email string, code string) (bool, time.Time, error) {
	var used bool
	var expired_at time.Time
	err := db.DB.QueryRow("SELECT used, expired_at FROM user_codes WHERE email = $1 AND code = $2 ORDER BY created_at DESC limit 1", email, code).Scan(&used, &expired_at)

	return used, expired_at, err
}

func UpdateCodeStatus(email string, code string) error {
	stmt, err := db.DB.Prepare("UPDATE user_codes SET used = true WHERE email = $1 AND code = $2")

	if err != nil {
		return err
	}

	res, err := stmt.Exec(email, code)

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

func AddUserByCode(email string, username string) (int, error) {
	var lastInsertId int
	err := db.DB.QueryRow("INSERT INTO users(email, name, source) VALUES($1, $2, $3) RETURNING id", email, username, "Code").Scan(&lastInsertId)

	return lastInsertId, err
}

func AddUserByPassword(username string, password string) (int, error) {
	var lastInsertId int
	err := db.DB.QueryRow("INSERT INTO users(name, password, source) VALUES($1, $2, $3) RETURNING id", username, password, "Password").Scan(&lastInsertId)

	return lastInsertId, err
}