package utils

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/kataras/iris/v12/middleware/jwt"
)

type UserClaims struct {
	UserID int32 `json:"user_id"`
}

type ForgetClaims struct {
	Email string `json:"email"`
}

func GenerateToken(userId int32) (string, error) {
	sigKey := os.Getenv("TOKEN_SIG_KEY")
	expiredTime := os.Getenv("TOKEN_EXPIRED_TIME")
	claims := UserClaims{UserID: userId}

	expiredArr := strings.Split(expiredTime, "*")
	expired := 1

	for _, value := range expiredArr {

		res, err := strconv.Atoi(value)

		if err != nil {
			return "", err
		}

		expired *= res
	}

	token, err := jwt.Sign(jwt.HS256, []byte(sigKey), claims, jwt.MaxAge(time.Duration(expired)*time.Second))

	return string(token), err
}

func GenerateForgetToken(email string) (string, error) {
	sigKey := os.Getenv("TOKEN_SIG_KEY")
	expiredTime := os.Getenv("TOKEN_EXPIRED_TIME")
	claims := ForgetClaims{Email: email}

	expiredArr := strings.Split(expiredTime, "*")
	expired := 1

	for _, value := range expiredArr {

		res, err := strconv.Atoi(value)

		if err != nil {
			return "", err
		}

		expired *= res
	}

	token, err := jwt.Sign(jwt.HS256, []byte(sigKey), claims, jwt.MaxAge(time.Duration(expired)*time.Second))

	return string(token), err
}