package main

import (
	"fmt"
	"net/http"
	"path/filepath"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		absPath, err := filepath.Abs(filepath.Join(".", "project/index.html"))
		fmt.Printf("Attempting to serve file at: %s\n", absPath)
		if err != nil {
			w.Header().Set("Content-Type", "text/plain")
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error resolving absolute path: %v", err)
			return
		}

		w.Header().Set("Content-Type", "text/html")
		http.ServeFile(w, r, absPath)
	})

	port := "8080"
	fmt.Printf("Server starting on http://localhost:%s\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
