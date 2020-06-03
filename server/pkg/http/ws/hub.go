package ws

import "github.com/njehyde/issue-tracker/libraries/slog"

// Hub maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

// NewHub ...
func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
	}
}

// Run ...
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			slog.Infof("Registering client %v \n", *client)
			h.Clients[client] = true
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				slog.Infof("Unregistering client %v \n", *client)
				delete(h.Clients, client)
				close(client.Send)
			}
		case message := <-h.Broadcast:
			slog.Infof("Broadcasting message %v \n", string(message))
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
		}
	}
}
