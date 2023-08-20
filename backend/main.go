package main

import (
	"backend/db"
	"backend/routes"
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
        return new(routes.UserClaims)
    })

	app.Get("/code", routes.GetCode)
	app.Post("/logout", routes.Logout)

	login := app.Party("/login")
	{
		login.Post("/code", routes.LoginWithCode)
		login.Post("/password", routes.LoginWithPassword)
	}

	problem := app.Party("/problems")
	{
		problem.Get("", routes.GetProblems)
		problem.Get("/{id}", routes.GetProblem)
		problem.Post("", routes.AddProblem)
	}

	user := app.Party("/user")
	user.Use(verifyMiddleware)

	app.Listen(":8080")
}