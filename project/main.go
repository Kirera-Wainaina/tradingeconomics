package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
)

// API handlers
func GetCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get API key from environment variables
	apiKey := os.Getenv("API_KEY")
	if apiKey == "" {
		http.Error(w, "API key not found", http.StatusInternalServerError)
		return
	}

	// Call the Trading Economics API
	url := fmt.Sprintf("https://api.tradingeconomics.com/comtrade/categories?c=%s&f=json", apiKey)
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching categories: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error reading response: %v", err), http.StatusInternalServerError)
		return
	}

	// Forward the response to the client
	w.Write(body)
}

func miniRouter(dirPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// Handle API routes
		if apiPath, found := strings.CutPrefix(path, "/api/"); found {
			switch apiPath {
			case "get-categories":
				GetCategories(w, r)
				return
			default:
				http.NotFound(w, r)
				return
			}
		}

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
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Use the miniRouter for the root path to serve files from project directory
	http.HandleFunc("/", miniRouter("."))

	port := "8080"
	fmt.Printf("Server starting on http://localhost:%s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
