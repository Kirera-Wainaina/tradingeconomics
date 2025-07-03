document.addEventListener("DOMContentLoaded", async function () {
    const categories = await fetchCategories();
    displayCategories(categories);

    // Add event listener for form submission
    const form = document.querySelector("form");
    form.addEventListener("submit", handleFormSubmission);
});

function displayCategories(categories) {
    const categorySelect = document.getElementById("category");

    if (categories && categorySelect) {
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.name;
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

function handleFormSubmission(event) {
    event.preventDefault();

    const country = document.getElementById("country").value;
    const tradeType = document.getElementById("trade-type").value;
    const category = document.getElementById("category").value;

    const formData = {
        country: country,
        tradeType: tradeType,
        category: category,
    };

    fetch("/api/get-trade-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Trade data received:", data);
            // Handle the response data here
        })
        .catch((error) => {
            console.error("Error fetching trade data:", error);
        });
}
