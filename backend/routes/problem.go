package routes

import (
	"backend/models"

	"github.com/kataras/iris/v12"
)

func GetProblems(ctx iris.Context) {
	problems := []models.ProblemListItem{
		{
			Id:         "1",
			Name:       "problem1",
			Status:     models.Unsolved,
			Answers:    0,
			PassRate:   0,
			Difficulty: models.Easy,
		},
		{
			Id:         "2",
			Name:       "problem2",
			Status:     models.Processing,
			Answers:    0,
			PassRate:   0,
			Difficulty: models.Easy,
		},
		{
			Id:         "3",
			Name:       "problem3",
			Status:     models.Processing,
			Answers:    0,
			PassRate:   0,
			Difficulty: models.Medium,
		},
	}

	ctx.JSON(Response{
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

	ctx.JSON(Response{
		Code: 0,
		Msg:  "success",
		Data: problem,
	})
}

func AddProblem(ctx iris.Context) {
	var problem models.Problem

	err := ctx.ReadJSON(&problem);
	
	if err != nil {
		ctx.StopWithError(iris.StatusBadRequest, err)
		return
	}

	ctx.JSON(Response{
		Code: 0,
		Msg:  "success",
	})
}
