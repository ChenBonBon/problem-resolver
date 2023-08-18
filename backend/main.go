package main

import (
	"backend/routes"
	"log/slog"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/kataras/iris/v12"
)

type config struct {
	DB_USER string
	DB_PASS string
	DB_NAME string
}

func main() {
	ac := makeAccessLog()
	defer ac.Close()

	app := iris.New()

	app.UseRouter(ac.Handler)

	connectDB()

	problem := app.Party("/problems")
	{
		problem.Get("", routes.GetProblems)
		problem.Get("/{id}", routes.GetProblem)
		problem.Post("", routes.AddProblem)
	}

	app.Listen(":8080")
}

func connectDB() {
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")

	var dbConfig config

	dbConfig.DB_USER = dbUser
	dbConfig.DB_PASS = dbPass
	dbConfig.DB_NAME = dbName

	db, err := openDB(dbConfig)

	if err != nil {
		slog.Error("Open database failed.", err)
	}

	defer db.Close()

	slog.Info("database connection pool established")
}
