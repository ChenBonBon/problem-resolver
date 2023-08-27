package main

import (
	"backend/db"
	"backend/routes"
	"backend/utils"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
)

func main() {
	ac := makeAccessLog()
	defer ac.Close()

	app := iris.New()

	app.UseRouter(ac.Handler)

	db.ConnectDB()

	sigKey := os.Getenv("TOKEN_SIG_KEY")

	verifier := jwt.NewVerifier(jwt.HS256, sigKey)
	verifier.WithDefaultBlocklist()
	verifyMiddleware := verifier.Verify(func() interface{} {
		return new(utils.UserClaims)
	})

	app.OnErrorCode(iris.StatusUnauthorized, func(ctx iris.Context) {
		err := ctx.GetErr()

		ctx.StopWithProblem(iris.StatusUnauthorized, iris.NewProblem().Title("Token验证失败").Detail(err.Error()).Type("Unauthorized Problem"))
	})

	app.Get("/user", routes.GetUser).Use(verifyMiddleware)
	app.Post("/logout", routes.Logout).Use(verifyMiddleware)

	app.Get("/code", routes.GetCode)

	login := app.Party("/login")
	{
		login.Post("/code", routes.LoginWithCode)
		login.Post("/password", routes.LoginWithPassword)
	}

	problem := app.Party("/problems")
	{
		problem.Get("", routes.GetProblems)
		problem.Get("/{id}", routes.GetProblem)
		problem.Get("/types", routes.GetProblemTypes)
	}

	user := app.Party("/users")
	user.Use(verifyMiddleware)
	{
		user.Get("/problems", routes.GetProblemsByUserId)
		user.Post("/problems", routes.AddProblem)
		user.Put("/problems/:id", routes.UpdateProblem)
	}

	app.Listen(":8080")
}
