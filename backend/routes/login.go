package routes

import (
	"backend/db"
	dbmodels "backend/db/models"
	"backend/mail"
	"backend/models"
	"backend/utils"
	"context"

	// "context"
	"crypto/rand"
	"log/slog"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

func GetCode(ctx iris.Context) {
	email := ctx.URLParam("email")

	address, err := mail.ValidateMail(email)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("邮箱格式错误").Detail(err.Error()).Type("Param Problem"))	
		return
	}

	code := []string{}

	for i := 0; i < 6; i++ {
		n, _ := rand.Int(rand.Reader, big.NewInt(9))
		code = append(code, n.String())
	}

	err = models.AddCode(address, strings.Join(code, ""))

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("生成验证码失败").Detail(err.Error()).Type("Insert Problem"))
	}

	content, err := os.ReadFile("mail/templates/code.html")

	if err != nil {
		slog.Error(err.Error())
		panic(err)
	}

	mail.SendMail(address, "欢迎登录小镇做题家", strings.Replace(string(content), "{{ code }}", strings.Join(code, ""), -1))

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
	})
}

func AddUser(email string) (dbmodels.User, error) {
	emailArr := strings.Split(email, "@")
	user, err := models.AddUserByCode(email, emailArr[0])
	
	return user, err
}

func LoginWithPassword(ctx iris.Context) {
	var login models.LoginWithPassword

	err := ctx.ReadJSON(&login)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("用户名或密码错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	user, err := models.GetUserByPassword(login.Username, utils.GetMd5Str(login.Password))

	if err != nil {
		if user.ID == 0 {
			ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("用户名或密码错误").Detail(err.Error()).Type("Param Problem"))
			return
		} else {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}
	}

	token, err := utils.GenerateToken(user.ID)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Token生成失败").Detail(err.Error()).Type("Sign Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: User{
			Username: user.Name,
			NewToken: token,
		},
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
			newUser, err := AddUser(login.Email)

			if err != nil {
				ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("创建用户失败").Detail(err.Error()).Type("Insert Problem"))
				return
			}

			user.ID = newUser.ID
			user.Name = newUser.Name
		} else {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}
	}

	token, err := utils.GenerateToken(user.ID)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Token生成失败").Detail(err.Error()).Type("Sign Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: User{
			Username: user.Name,
			NewToken: token,
		},
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

func forgetWithUsername(username string) (dbmodels.User, error) {
	user, err := models.GetUserByName(username)

	return user, err
}

func forgetWithEmail(email string) (string, error) {
	token, err := utils.GenerateForgetToken(email)

	return token, err
}

func ForgetPassword(ctx iris.Context) {
	username := ctx.URLParam("username")

	address, err := mail.ValidateMail(username)

	var token string
	var tokenErr error

	if err != nil {
		user, err := forgetWithUsername(username)

		if err != nil {
			if user.ID == 0 {
				ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("该用户不存在").Detail(err.Error()).Type("Param Problem"))
				return
			}
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}

		address = user.Email
		token, tokenErr = forgetWithEmail(user.Email)
	} else {
		token, tokenErr = forgetWithEmail(address)
	}

	if tokenErr != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Token生成失败").Detail(tokenErr.Error()).Type("Sign Problem"))
		return
	}

	content, err := os.ReadFile("mail/templates/forget.html")
	protocol := os.Getenv("PROTOCOL")
	host := os.Getenv("HOST")
	port := os.Getenv("PORT")

	if err != nil {
		slog.Error(err.Error())
		panic(err)
	}

	stokens, err := utils.TransformSToken(token)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("SToken生成失败").Detail(tokenErr.Error()).Type("Sign Problem"))
		return
	}

	redisCtx := context.Background()

	redisErr := db.Redis.Set(redisCtx, stokens[0], token, 0).Err()

	if redisErr != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Redis写入失败").Detail(redisErr.Error()).Type("Redis Problem"))
		return
	}

	mail.SendMail(address, "欢迎登录小镇做题家", strings.Replace(string(content), "{{ url }}", strings.Join([]string{protocol, "://", host, ":", port, "/reset-password?stoken=", stokens[0]}, ""), -1))

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
	})
}

func ResetPassword(ctx iris.Context) {
	var resetPassword models.ResetPassword

	err := ctx.ReadJSON(&resetPassword)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("参数错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	redisCtx := context.Background()
	token, err := db.Redis.Get(redisCtx, resetPassword.Stoken).Result()

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("Stoken 不正确").Detail(err.Error()).Type("Param Problem"))
		return
	}

	sigKey := os.Getenv("TOKEN_SIG_KEY")

	verifiedToken, err := jwt.Verify(jwt.HS256, []byte(sigKey), []byte(token))

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("Stoken 不正确").Detail(err.Error()).Type("Param Problem"))
		return
	}

	var claims utils.ForgetClaims
	verifiedToken.Claims(&claims)

	email := claims.Email

	err = models.UpdateUserPassword(email, resetPassword.Password)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新密码失败").Detail(err.Error()).Type("Update Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
	})
}