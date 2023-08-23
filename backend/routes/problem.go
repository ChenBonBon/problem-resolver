package routes

import (
	"backend/models"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

func GetProblems(ctx iris.Context) {
	rows, err := models.GetProblems()

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Select Problem"))
		return
	}

	var problems []models.ProblemListItem

	for rows.Next() {
		var id int
		var name string
		var difficulty models.DifficultyType

		err = rows.Scan(&id, &name, &difficulty)

		if err != nil {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}

		problems = append(problems, models.ProblemListItem{
			Id:         id,
			Name:       name,
			Status:     models.Unsolved,
			Answers:    0,
			PassRate:   0,
			Difficulty: difficulty,
		})

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

	var problem models.ProblemForm

	err := ctx.ReadJSON(&problem)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("问题参数错误").Detail(err.Error()).Type("Param Problem"))
		return
	}

	err = models.AddProblem(problem.Name, problem.Description, problem.Difficulty, problem.Types, userId)

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

	rows, err := models.GetProblemsByUserId(userId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Select Problem"))
		return
	}

	var problems []models.UserProblemListItem

	for rows.Next() {
		var id int
		var name string
		var difficulty models.DifficultyType
		var status models.StatusType

		err = rows.Scan(&id, &name, &difficulty, &status)

		if err != nil {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("查询问题失败").Detail(err.Error()).Type("Scan Problem"))
			return
		}

		problems = append(problems, models.UserProblemListItem{
			Id:         id,
			Name:       name,
			Status:     status,
			Difficulty: difficulty,
		})

	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: problems,
	})
}