package routes

import (
	"backend/db"
	"backend/models"

	"github.com/kataras/iris/v12"
)

func GetProblems(ctx iris.Context) {
	rows, err := db.DB.Query("SELECT id, name, difficulty FROM problems")

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Select Problem"))
		return
	}

	var problems []models.ProblemListItem

	for rows.Next() {
		var id string
		var name string
		var difficulty models.DifficultyType

		err = rows.Scan(&id, &name, &difficulty)

		if err != nil {
			ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Scan Problem"))
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
	id := ctx.Params().Get("id")
	problem := models.ProblemItem{
		Id:          id,
		Name:        "problem" + id,
		Description: "description",
		Examples: []models.Example{
			{
				Id:          "1",
				Input:       "input",
				Output:      "output",
				Explanation: "explanation",
				Image:       "image",
			},
		},
		Difficulty: models.Medium,
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: problem,
	})
}

func AddProblem(ctx iris.Context) {
	var problem models.Problem

	err := ctx.ReadJSON(&problem)

	if err != nil {
		ctx.StopWithProblem(iris.StatusBadRequest, iris.NewProblem().Title("Bad Request").Detail(err.Error()).Type("Param Problem"))
		return
	}

	var lastInsertId int
	err = db.DB.QueryRow("INSERT INTO problems(name, description, difficulty) VALUES($1, $2, $3) RETURNING id", problem.Name, problem.Description, problem.Difficulty).Scan(&lastInsertId)

	if err != nil {
		ctx.StopWithProblem(iris.StatusInternalServerError, iris.NewProblem().Title("Internal Server Error").Detail(err.Error()).Type("Insert Problem"))
	}

	ctx.JSON(Success{
		Code: 0,
		Msg:  "success",
		Data: lastInsertId,
	})
}