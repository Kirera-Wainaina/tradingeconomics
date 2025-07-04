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

    // Show loading indicator or message
    document.getElementById("chart-container").style.opacity = "0.5";

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
            // Restore opacity before displaying chart
            document.getElementById("chart-container").style.opacity = "1";
            displayTradeChart(data);
        })
        .catch((error) => {
            console.error("Error fetching trade data:", error);
        });
}

function displayTradeChart(tradeData) {
    // Get the canvas element
    const ctx = document.getElementById("trade-chart").getContext("2d");

    // Check if there's an existing chart and destroy it
    if (window.tradeChart) {
        window.tradeChart.destroy();
    }

    // Process the data for the chart
    // We're interested in 'country2' and 'value'
    const chartData = processTradeData(tradeData);

    // Create the donut chart
    window.tradeChart = new Chart(ctx, {
        type: "doughnut",
        cutout: "65%",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    data: chartData.values,
                    backgroundColor: generateColors(chartData.labels.length),
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    align: "center",
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        font: {
                            size: 12,
                        },
                    },
                },
                title: {
                    display: true,
                    text: "Trade Partners by Value",
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            const total =
                                context.chart.data.datasets[0].data.reduce(
                                    (a, b) => a + b,
                                    0,
                                );
                            const percentage = Math.round(
                                (value / total) * 100,
                            );
                            const formattedValue = new Intl.NumberFormat(
                                "en-US",
                                {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                },
                            ).format(value);
                            return `${label}: ${formattedValue} (${percentage}%)`;
                        },
                    },
                },
            },
        },
    });
}

function processTradeData(tradeData) {
    // Initialize result objects
    const countryValues = {};

    // Process each trade record
    tradeData.forEach((item) => {
        const country = item.country2;
        const value = item.value || 0;

        // Aggregate values by country
        if (countryValues[country]) {
            countryValues[country] += value;
        } else {
            countryValues[country] = value;
        }
    });

    // Sort countries by value (descending)
    const sortedEntries = Object.entries(countryValues).sort(
        (a, b) => b[1] - a[1],
    );

    // Take top 10 countries, combine the rest as "Others"
    const labels = [];
    const values = [];

    if (sortedEntries.length > 10) {
        // Add top 9 countries
        for (let i = 0; i < 9; i++) {
            if (i < sortedEntries.length) {
                labels.push(sortedEntries[i][0]);
                values.push(sortedEntries[i][1]);
            }
        }

        // Combine the rest as "Others"
        const othersValue = sortedEntries
            .slice(9)
            .reduce((sum, entry) => sum + entry[1], 0);
        labels.push("Others");
        values.push(othersValue);
    } else {
        // Use all countries if 10 or fewer
        sortedEntries.forEach((entry) => {
            labels.push(entry[0]);
            values.push(entry[1]);
        });
    }

    return { labels, values };
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        // Generate colors with good contrast
        const hue = ((i * 360) / count) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}
