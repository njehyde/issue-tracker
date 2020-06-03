package responsebuilder

// Response ...
type Response struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Result  interface{} `json:"result,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// ResponseBuilder ...
type ResponseBuilder interface {
	Status(bool) ResponseBuilder
	Message(string) ResponseBuilder
	Result(map[string]interface{}) ResponseBuilder
	Error(string) ResponseBuilder
	Success(interface{}) ResponseBuilder
	SuccessWithoutResult() ResponseBuilder
	Fail(string) ResponseBuilder
	Build() Response
}

type responseBuilder struct {
	status  bool
	message string
	result  interface{}
	err     string
}

func (rb *responseBuilder) Status(status bool) ResponseBuilder {
	rb.status = status
	return rb
}

func (rb *responseBuilder) Message(message string) ResponseBuilder {
	rb.message = message
	return rb
}

func (rb *responseBuilder) Result(result map[string]interface{}) ResponseBuilder {
	rb.result = result
	return rb
}

func (rb *responseBuilder) Error(err string) ResponseBuilder {
	rb.err = err
	return rb
}

func (rb *responseBuilder) Success(result interface{}) ResponseBuilder {
	rb.status = true
	rb.result = result
	if len(rb.message) == 0 {
		rb.message = "Success"
	}
	return rb
}

func (rb *responseBuilder) SuccessWithoutResult() ResponseBuilder {
	rb.status = true
	if len(rb.message) == 0 {
		rb.message = "Success"
	}
	return rb
}

func (rb *responseBuilder) Fail(err string) ResponseBuilder {
	rb.status = false
	rb.err = err
	if len(rb.message) == 0 {
		rb.message = "Failed"
	}
	return rb
}

func (rb *responseBuilder) Build() Response {
	return Response{
		Status:  rb.status,
		Message: rb.message,
		Result:  rb.result,
		Error:   rb.err,
	}
}

// New ...
func New() ResponseBuilder {
	return &responseBuilder{}
}
