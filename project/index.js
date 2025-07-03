document.addEventListener("DOMContentLoaded", async function () {
    const categories = await fetchCategories();
    displayCategories(categories);
});

function displayCategories(categories) {
    const categorySelect = document.getElementById("category");

    if (categories && categorySelect) {
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.pretty_name || category.name;
            categorySelect.appendChild(option);
        });
    }
}

function fetchCategories() {
    return fetch("/api/get-categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error("Error fetching categories:", error);
            return [];
        });
}
