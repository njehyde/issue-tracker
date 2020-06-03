package rest

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/njehyde/issue-tracker/libraries/slog"
	"github.com/njehyde/issue-tracker/pkg/events"
	"github.com/njehyde/issue-tracker/pkg/http/ws"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func wsEndpoint(eb *events.EventBus, hub *ws.Hub) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			return true
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			slog.Error(err)
			return
		}

		client := &ws.Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256)}
		client.Hub.Register <- client
		// client.Hub.Broadcast <- []byte("Someone just joined")

		// Allow collection of memory referenced by the caller by doing all work in new goroutines.
		go client.WritePump()
		go client.ReadPump()
	}
}
