package db

import (
	"context"
	"database/sql"
	"log/slog"
	"os"
	"time"

	_ "github.com/lib/pq"
)

type config struct {
	DB_USER string
	DB_PASS string
	DB_NAME string
}

var (
	DB *sql.DB
)

func openDB(dbConfig config) (*sql.DB, error) {
	//使用sql.Open()创建一个空连接池
	db, err := sql.Open("postgres", "user="+dbConfig.DB_USER+" password="+dbConfig.DB_PASS+" dbname="+dbConfig.DB_NAME+" sslmode=disable")
	if err != nil {
		return nil, err
	}

	//创建一个具有5秒超时期限的上下文。
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	//使用PingContext()建立到数据库的新连接，并传入上下文信息，连接超时就返回
	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}
	// 返回sql.DB连接池
	return db, nil
}

func ConnectDB() {
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

	DB = db

	slog.Info("database connection pool established")
}
