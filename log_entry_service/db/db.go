package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/Usmith37/TimeTrackerV3/log_entry_service/config"
	_ "github.com/lib/pq"
)

func ConnectDB() *sql.DB {
	psqlInfo := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.DBHost, config.DBPort, config.DBUser, config.DBPassword, config.DBName,
	)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Cannot ping DB:", err)
	}

	log.Println("Connected to PostgreSQL!")
	return db
}
