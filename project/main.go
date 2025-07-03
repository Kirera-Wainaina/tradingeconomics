package main

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
)

func miniRouter(dirPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// Serve index.html for the root path
		if path == "/" {
			path = "/index.html"
		}
		fmt.Printf("Requested path: %s\n", path)
		// Get the file extension to set content type
		var contentType string
		switch {
		case strings.HasSuffix(path, ".html"):
			contentType = "text/html"
		case strings.HasSuffix(path, ".js"):
			contentType = "application/javascript"
		case strings.HasSuffix(path, ".css"):
			contentType = "text/css"
		default:
			http.NotFound(w, r)
			return
		}

		// Remove leading slash and join with base directory
		filePath := filepath.Join(dirPath, path[1:])
		absPath, err := filepath.Abs(filePath)
		fmt.Printf("Attempting to serve file at: %s\n", absPath)

		if err != nil {
			w.Header().Set("Content-Type", "text/plain")
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error resolving absolute path: %v", err)
			return
		}

		w.Header().Set("Content-Type", contentType)
		http.ServeFile(w, r, absPath)
	}
}

func main() {
	// Use the miniRouter for the root path to serve files from project directory
	http.HandleFunc("/", miniRouter("./project"))

	port := "8080"
	fmt.Printf("Server starting on http://localhost:%s\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
