package routes

import (
	"backend/db"
	"backend/models"
	"crypto/rand"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

type UserClaims struct {
	UserID string `json:"user_id"`
}

func GetCode(ctx iris.Context) {
	email := ctx.URLParam("email")
	var code []string

	for i := 0; i < 6; i++ {
		n, _ := rand.Int(rand.Reader, big.NewInt(9))
		code = append(code, n.String())
	}

	var lastInsertId string
	err := db.DB.QueryRow("INSERT INTO user_codes(email, code) VALUES($1, $2) RETURNING id", email, strings.Join(code, "")).Scan(&lastInsertId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Insert Problem"))
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: lastInsertId,
	})
}

func LoginWithPassword(ctx iris.Context) {
	var login models.LoginWithPassword

	err := ctx.ReadJSON(&login)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("Bad Request").Detail(err.Error()).Type("Param Problem"))
		return
	}

	var userId string
	err = db.DB.QueryRow("SELECT id FROM users WHERE username = $1 AND password = $2", login.Username, login.Password).Scan(&userId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	sigKey := os.Getenv("TOKEN_SIG_KEY")

	signer := jwt.NewSigner(jwt.HS256, sigKey, 24*time.Hour)
	claims := UserClaims{UserID: userId}

	token, err := signer.Sign(claims)
	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Sign Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: token,
	})
}

func LoginWithCode(ctx iris.Context) {
	var login models.LoginWithCode

	err := ctx.ReadJSON(&login)

	if err != nil {
		ctx.StopWithError(iris.StatusBadRequest, err)
		return
	}

	var userId string
	var used bool
	var expired_at time.Time

	err = db.DB.QueryRow("SELECT used, expired_at FROM user_codes WHERE email = $1 AND code = $2 ORDER BY created_at DESC limit 1", login.Email, login.Code).Scan(&used, &expired_at)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("邮箱或验证码错误").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	if used {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("验证码已使用").Type("Params Problem"))
		return
	}

	if expired_at.Before(time.Now()) {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("验证码已过期").Type("Params Problem"))
		return
	}

	stmt, err := db.DB.Prepare("UPDATE user_codes SET used = true WHERE email = $1 AND code = $2")

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新验证码状态异常").Detail(err.Error()).Type("Prepare Problem"))
		return
	}

	res, err := stmt.Exec(login.Email, login.Code)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新验证码状态异常").Detail(err.Error()).Type("Exec Problem"))
		return
	}

	var _ int64
	affected, err := res.RowsAffected()

	_ = affected

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新验证码状态异常").Detail(err.Error()).Type("RowsAffected Problem"))
		return
	}


	sigKey := os.Getenv("TOKEN_SIG_KEY")

	signer := jwt.NewSigner(jwt.HS256, sigKey, 24*time.Hour)
	claims := UserClaims{UserID: userId}

	token, err := signer.Sign(claims)
	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Sign Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: token,
	})
}

func Logout(ctx iris.Context) {
	err := ctx.Logout()
	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("Bad Request").Detail(err.Error()).Type("Params Problem"))
		return
	} else {
		ctx.JSON(Success{
			Code: 0,
			Msg:  "success",
		})
	}
}
