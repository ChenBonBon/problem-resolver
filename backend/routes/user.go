package routes

import (
	"backend/models"
	"backend/utils"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

type User struct {
	Username string `json:"username"`
	NewToken string `json:"token"`
}

func GetUser(ctx iris.Context) {
	claims := jwt.Get(ctx).(*utils.UserClaims)

	user, err := models.GetUserById(claims.UserID)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	token, err := RefreshToken(user.ID)

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

func RefreshToken(id int32) (string, error) {
	token, err := utils.GenerateToken(id)

	return token, err
}
