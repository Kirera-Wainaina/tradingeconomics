# World Trade Visualization App

## Overview
This application visualizes international trade data between countries using the Trading Economics API. Users can select a country, trade type (import or export), and product category to generate an interactive donut chart showing the country's top trading partners for that specific criteria.

## Features
- Selection of countries, trade types (import/export), and product categories
- Interactive donut chart visualization of trade data
- Custom legend with hover and click functionality
- Responsive design that works on various screen sizes
- Data represented in both absolute values and percentages

## Setup Instructions

### Prerequisites
- Go programming language (1.16 or later)
- Trading Economics API key (obtain from [tradingeconomics.com](https://tradingeconomics.com/api/))
- Web browser with JavaScript enabled

### Installation Steps

1. Clone the repository or download the source code
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory
   ```
   cd tradingeconomics/project
   ```

3. Create a `.env` file in the project root with your Trading Economics API key
   ```
   API_KEY=your_api_key_here
   ```

4. Start the application
   ```
   go run main.go
   ```

5. Open your web browser and navigate to:
   ```
   http://localhost:8080
   ```

## Usage

1. Select a country from the dropdown menu
2. Choose the trade type (import or export)
3. Select a product category
4. Click "Submit" to generate the visualization
5. Interact with the chart and legend:
   - Hover over chart segments to see detailed information
   - Click on legend items to highlight/hide specific trading partners

## Technical Details

The application uses:
- Go for the backend server
- Chart.js for data visualization
- Vanilla JavaScript for frontend functionality
- CSS for styling and layout

## Troubleshooting

- If the chart doesn't display, check your browser console for errors
- Ensure your API key is correctly set in the `.env` file
- Make sure you have internet connectivity to access the Trading Economics API
