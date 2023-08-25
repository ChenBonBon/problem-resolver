package models

import (
	"backend/db"
	"backend/db/models"
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

func AddCode(email string, code string) error {
	userCode := models.UserCode{
		Email: email,
		Code:  code,
	}

	result := db.DB.Create(&userCode)

	return result.Error
}

func GetUserByEmail(email string) (models.User, error) {
	var user models.User

	result := db.DB.Select("id").Where("email = ?", email).First(&user)

	return user, result.Error
}

func GetUserByPassword(username string, password string) (models.User, error) {
	var user models.User

	result := db.DB.Select("id").Where("name = ? AND password = ?", username, password).First(&user)

	return user, result.Error
}

func GetCodeStatus(email string, code string) (models.UserCode, error) {
	var userCode models.UserCode

	result := db.DB.Select("used", "expired_at").Where("email = ? AND code = ?", email, code).First(&userCode)

	return userCode, result.Error
}

func UpdateCodeStatus(email string, code string) error {
	var userCode models.UserCode

	result := db.DB.Where("email = ? AND code = ?", email, code).First(&userCode)

	if result.Error != nil {
		return result.Error
	}

	userCode.Used = true
	userCode.UsedAt = time.Now()

	result = db.DB.Save(&userCode)

	return result.Error
}

func AddUserByCode(email string, username string) (int32, error) {
	user := models.User{
		Email:  email,
		Name:   username,
		Source: "Code",
	}

	result := db.DB.Create(&user)

	return user.ID, result.Error
}

func AddUserByPassword(username string, password string) (int64, error) {
	user := models.User{
		Name:     username,
		Password: password,
		Source:   "Password",
	}

	result := db.DB.Create(&user)

	return result.RowsAffected, result.Error
}

func GetUserById(id int32) (models.User, error) {
	user := models.User{}

	result := db.DB.First(&user, id)

	return user, result.Error
}
