package routes

import (
	"backend/mail"
	"backend/models"
	"crypto/rand"
	"log/slog"
	"math/big"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

type UserClaims struct {
	UserID int32 `json:"user_id"`
}

func GetCode(ctx iris.Context) {
	email := ctx.URLParam("email")
	code := []string{}

	for i := 0; i < 6; i++ {
		n, _ := rand.Int(rand.Reader, big.NewInt(9))
		code = append(code, n.String())
	}

	err := models.AddCode(email, strings.Join(code, ""))

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("生成验证码失败").Detail(err.Error()).Type("Insert Problem"))
	}

	content, err := os.ReadFile("mail/templates/code.html")

	if err != nil {
		slog.Error(err.Error())
		panic(err)
	}

	mail.SendMail(email, "欢迎登录小镇做题家", strings.Replace(string(content), "{{ code }}", strings.Join(code, ""), -1))

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

	user, err := models.GetUserByPassword(login.Username, login.Password)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	token, err := generateToken(user.ID)

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

	userCode, err := models.GetCodeStatus(login.Email, login.Code)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("邮箱或验证码错误").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	if userCode.Used {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("验证码已使用").Type("Params Problem"))
		return
	}

	if userCode.ExpiredAt.Before(time.Now()) {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("验证码已过期").Type("Params Problem"))
		return
	}

	err = models.UpdateCodeStatus(login.Email, login.Code)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新验证码状态异常").Detail(err.Error()).Type("Prepare Problem"))
		return
	}

	user, err := models.GetUserByEmail(login.Email)

	if err != nil {
		if user.ID == 0 {
			userId, err := AddUser(login.Email)
			
			if err != nil {
				ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("创建用户失败").Detail(err.Error()).Type("Insert Problem"))
				return
			}

			user.ID = userId
		} else {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}
	}

	token, err := generateToken(user.ID)

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

func generateToken(userId int32) (string, error) {
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

func AddUser(email string) (int32, error) {
	emailArr := strings.Split(email, "@")
	userId, err := models.AddUserByCode(email, emailArr[0])
	
	return userId, err
}