const stockDropdown = document.getElementById("stockDropdown");
const loadStockButton = document.getElementById("loadStockButton");
const stockSearchInput = document.getElementById("stockSearch");
const searchButton = document.getElementById("searchButton");
const stockDetails = document.getElementById("stockDetails");
const stockChart = document.getElementById("stockChart").getContext("2d");
const stockTableBody = document.querySelector("#stockTable tbody");

// Chart Instance

// Mock API Function to Fetch Stock Data
const fetchStockData = async (stockSymbol) => {
    // Replace with actual API endpoint if available
    const mockData = {
        symbol: stockSymbol,
        price: (Math.random() * 1000).toFixed(2),
        change: (Math.random() * 20 - 10).toFixed(2),
        volume: Math.floor(Math.random() * 1000000),
        historicalPrices: Array.from({ length: 30 }, () => (Math.random() * 1000).toFixed(2)),
    };
    return new Promise((resolve) => setTimeout(() => resolve(mockData), 500));
};

// Function to Display Stock Details
const displayStockDetails = (data) => {
    stockDetails.innerHTML = `
        <p><strong>Symbol:</strong> ${data.symbol}</p>
        <p><strong>Price:</strong> $${data.price}</p>
        <p><strong>Change:</strong> ${data.change}%</p>
        <p><strong>Volume:</strong> ${data.volume}</p>
    `;
};

// Function to Update Stock Chart
const updateStockChart = (data) => {
    const labels = Array.from({ length: data.historicalPrices.length }, (_, i) => `Day ${i + 1}`);
    const prices = data.historicalPrices;

    if (stockPriceChart) {
        stockPriceChart.destroy();
    }

    stockPriceChart = new Chart(stockChart, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${data.symbol} Price`,
                    data: prices,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
        },
    });
};

// Function to Add Stock to Comparison Table
const addToComparisonTable = (data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${data.symbol}</td>
        <td>$${data.price}</td>
        <td>${data.change}%</td>
        <td>${data.volume}</td>
    `;
    stockTableBody.appendChild(row);
};

// Event Handlers
loadStockButton.addEventListener("click", async () => {
    const selectedStock = stockDropdown.value;
    const stockData = await fetchStockData(selectedStock);

    displayStockDetails(stockData);
    updateStockChart(stockData);
    addToComparisonTable(stockData);
});

searchButton.addEventListener("click", async () => {
    const stockSymbol = stockSearchInput.value.trim().toUpperCase();
    if (!stockSymbol) {
        alert("Please enter a stock symbol to search.");
        return;
    }

    const stockData = await fetchStockData(stockSymbol);

    displayStockDetails(stockData);
    updateStockChart(stockData);
    addToComparisonTable(stockData);
});
