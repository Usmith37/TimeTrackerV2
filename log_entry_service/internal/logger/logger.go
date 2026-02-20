package logger

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type ResponseRecorder struct {
	http.ResponseWriter
	status int
	body   *bytes.Buffer
}

func (r *ResponseRecorder) WriteHeader(statusCode int) {
	r.status = statusCode
	r.ResponseWriter.WriteHeader(statusCode)
}

func (r *ResponseRecorder) Write(b []byte) (int, error) {
	r.body.Write(b)
	return r.ResponseWriter.Write(b)
}

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		var reqBody []byte
		if r.Body != nil {
			reqBody, _ = ioutil.ReadAll(r.Body)
			r.Body = ioutil.NopCloser(bytes.NewBuffer(reqBody))
		}

		log.Printf("Request: %s %s\nHeaders: %v\nBody: %s\n",
			r.Method, r.URL.Path, r.Header, string(reqBody),
		)

		rec := &ResponseRecorder{
			ResponseWriter: w,
			status:         200,
			body:           &bytes.Buffer{},
		}

		next.ServeHTTP(rec, r)

		log.Printf("Response: %s %s -> Status: %d, Duration: %v, Body: %s\n",
			r.Method, r.URL.Path, rec.status, time.Since(start), rec.body.String(),
		)
	})
}
