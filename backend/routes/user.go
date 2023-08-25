package routes

import (
	"backend/models"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

func RefreshToken(ctx iris.Context) {
	claims := jwt.Get(ctx).(*UserClaims)

	user, err := models.GetUserById(claims.UserID)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("获取用户信息失败").Detail(err.Error()).Type("Scan Problem"))
		return
	}

	newToken, err := generateToken(user.ID)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Token生成失败").Detail(err.Error()).Type("Sign Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: newToken,
	})
}
