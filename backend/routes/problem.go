package routes

import (
	"backend/models"
	"strconv"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

func GetProblems(ctx iris.Context) {
	status := ctx.URLParam("status")

	problems, err := models.GetProblems(models.StatusType(status))

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Select Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: problems,
	})
}

func GetProblem(ctx iris.Context) {
	// id, err := strconv.Atoi(ctx.Params().Get("id"))

	// ctx.JSON(Success{
	// 	Code: 0,
	// 	Msg:  "success",
	// 	Data: ,
	// })
}

func AddProblem(ctx iris.Context) {
	claims := jwt.Get(ctx).(*UserClaims)
	userId := claims.UserID

	var problem models.CreateProblemItem

	err := ctx.ReadJSON(&problem)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("问题参数错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	err = models.AddProblem(problem.Name, problem.Description, problem.Answer, problem.Difficulty, problem.Types, userId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("创建问题失败").Detail(err.Error()).Type("Insert Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
	})
}

func GetProblemsByUserId(ctx iris.Context) {
	claims := jwt.Get(ctx).(*UserClaims)
	userId := claims.UserID

	problems, err := models.GetProblemsByUserId(userId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Select Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: problems,
	})
}

func GetProblemTypes(ctx iris.Context) {
	status := ctx.URLParam("status")

	problemTypes, err := models.GetProblemTypes(models.StatusType(status))

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Select Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: problemTypes,
	})

}

func UpdateProblem(ctx iris.Context) {
	claims := jwt.Get(ctx).(*UserClaims)
	userId := claims.UserID
	id, err := strconv.ParseInt(ctx.Params().Get("id"), 10, 32)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("问题 ID 错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	var problem models.UpdateProblemItem

	err = ctx.ReadJSON(&problem)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("问题参数错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	err = models.UpdateProblem(int32(id), problem, userId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("更新问题失败").Detail(err.Error()).Type("Update Problem"))
		return
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
	})
}
