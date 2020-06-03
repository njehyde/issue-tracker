package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"

	"github.com/joho/godotenv"
	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/adding"
	"github.com/njehyde/issue-tracker/pkg/authenticating"
	"github.com/njehyde/issue-tracker/pkg/checking"
	"github.com/njehyde/issue-tracker/pkg/deleting"
	"github.com/njehyde/issue-tracker/pkg/events"
	"github.com/njehyde/issue-tracker/pkg/http/rest"
	"github.com/njehyde/issue-tracker/pkg/http/ws"
	"github.com/njehyde/issue-tracker/pkg/listing"
	"github.com/njehyde/issue-tracker/pkg/storage/mongo"
	"github.com/njehyde/issue-tracker/pkg/updating"
)

func init() {
	err := godotenv.Load("../.env") //Load .env file
	if err != nil {
		slog.Infof("Cannot load .env file")
	}
}

func main() {
	var err error
	slog.Infof("Application starting...")

	// Initialise storage
	s, err := mongo.NewStorage()
	if err != nil {
		slog.Panicf(err.Error())
	}

	var eb = events.NewEventBus()

	hub := ws.NewHub()
	go hub.Run()

	// Setup the router
	router := rest.Handler(
		authenticating.NewService(s),
		listing.NewService(s),
		adding.NewService(s, hub),
		updating.NewService(s, hub),
		deleting.NewService(s, hub),
		checking.NewService(s),
		hub,
		eb,
	)

	host := os.Getenv("APP_HOST")
	port := os.Getenv("APP_PORT")

	if len(host) == 0 {
		host = "localhost"
	}
	if len(port) == 0 {
		port = "8080"
	}

	slog.Infof("Server is ready on: http://%v:%v", host, port)

	err = http.ListenAndServe(
		":"+port,
		handlers.CORS(
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization", "Refresh-Token"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}),
		)(router),
	)
	if err != nil {
		slog.Panicf(err.Error())
	}
}
