package routes

import (
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
	UserID int `json:"user_id"`
}

func GetCode(ctx iris.Context) {
	email := ctx.URLParam("email")
	var code []string

	for i := 0; i < 6; i++ {
		n, _ := rand.Int(rand.Reader, big.NewInt(9))
		code = append(code, n.String())
	}

	err := models.AddCode(email, strings.Join(code, ""))

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("生成验证码失败").Detail(err.Error()).Type("Insert Problem"))
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
	})
}

func LoginWithPassword(ctx iris.Context) {
	var login models.LoginWithPassword

	err := ctx.ReadJSON(&login)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("用户名或密码错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	userId, err := models.GetUserByPassword(login.Username, login.Password)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	sigKey := os.Getenv("TOKEN_SIG_KEY")

	signer := jwt.NewSigner(jwt.HS256, sigKey, 24*time.Hour)
	claims := UserClaims{UserID: userId}

	token, err := signer.Sign(claims)
	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Token生成失败").Detail(err.Error()).Type("Sign Problem"))
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

	used, expired_at, err := models.GetCodeStatus(login.Email, login.Code)

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

	err = models.UpdateCodeStatus(login.Email, login.Code)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新验证码状态异常").Detail(err.Error()).Type("Prepare Problem"))
		return
	}

	userId, err := models.GetUserByEmail(login.Email)

	if err != nil {
		if userId == 0 {
			emailArr := strings.Split(login.Email, "@")
			newUserId, err := models.AddUserByCode(login.Email, emailArr[0])
			userId = newUserId
			if err != nil {
				ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("创建用户失败").Detail(err.Error()).Type("Insert Problem"))
				return
			}
		} else {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}
	}

	sigKey := os.Getenv("TOKEN_SIG_KEY")

	signer := jwt.NewSigner(jwt.HS256, sigKey, 24*time.Hour)
	claims := UserClaims{UserID: userId}

	token, err := signer.Sign(claims)
	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Token生成失败").Detail(err.Error()).Type("Sign Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: token,
	})
}

func GetToken(ctx iris.Context) {
	println("GetToken: ", jwt.Get(ctx))
	claims := jwt.Get(ctx).(*UserClaims)

	println("claims: ", claims)
	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
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
