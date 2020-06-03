package events

import "sync"

// DataEvent ...
type DataEvent struct {
	Data  interface{}
	Topic string
}

// DataChannel is a channel which can accept an DataEvent
type DataChannel chan DataEvent

// DataChannelSlice is a slice of DataChannels
type DataChannelSlice []DataChannel

// EventBus stores the information about subscribers interested for a particular topic
type EventBus struct {
	Subscribers map[string]DataChannelSlice
	RM          sync.RWMutex
}

// NewEventBus ...
func NewEventBus() *EventBus {
	eb := &EventBus{}
	eb.Subscribers = make(map[string]DataChannelSlice)
	return eb
}

// Subscribe ...
func (eb *EventBus) Subscribe(topic string, ch DataChannel) {
	eb.RM.Lock()
	defer eb.RM.Unlock()

	if prev, found := eb.Subscribers[topic]; found {
		eb.Subscribers[topic] = append(prev, ch)
	} else {
		eb.Subscribers[topic] = append([]DataChannel{}, ch)
	}
}

// Publish ...
func (eb *EventBus) Publish(topic string, data interface{}) {
	eb.RM.RLock()
	defer eb.RM.RUnlock()

	if chans, found := eb.Subscribers[topic]; found {
		// this is done because the slices refer to same array even though they are passed by value
		// thus we are creating a new slice with our elements thus preserve locking correctly.
		channels := append(DataChannelSlice{}, chans...)
		go func(data DataEvent, dataChannelSlices DataChannelSlice) {
			for _, ch := range dataChannelSlices {
				ch <- data
			}
		}(DataEvent{Data: data, Topic: topic}, channels)
	}
}
