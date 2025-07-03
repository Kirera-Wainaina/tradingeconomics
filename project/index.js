document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
});

function fetchCategories() {
    fetch("/api/get-categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            sessionStorage.setItem("categories", JSON.stringify(data));
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);
        });
}
