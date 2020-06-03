FROM golang:latest

WORKDIR /go/src/issue-tracker
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

CMD ["go", "run", "./cmd/issue-tracker/main.go"]
