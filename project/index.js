document.addEventListener("DOMContentLoaded", async function () {
    await fetchCategories();
});

function fetchCategories() {
    return fetch("/api/get-categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            return sessionStorage.setItem("categories", JSON.stringify(data));
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);
        });
}
