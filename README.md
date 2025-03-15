# Trading101

## Overview

Trading101 is a web application for trading practice and strategy backtesting using historical forex data. It features a Flask backend API and React frontend with interactive charts and trading controls.

## Project Structure

```
Trading101/
├── backend/
│   ├── app.py               # Flask server and trading logic
│   ├── EURUSD1.csv          # 1-minute historical data
│   ├── EURUSD5.csv          # 5-minute historical data
│   ├── EURUSD15.csv         # 15-minute historical data
│   ├── EURUSD30.csv         # 30-minute historical data
│   └── EURUSD60.csv         # 1-hour historical data
│
└── frontend/
    ├── public/              # Static files
    └── src/
        ├── App.js           # Main React component
        ├── Backtest.js      # Backtesting functionality
        ├── ChartAndControls.js # Chart display and trading controls
        ├── Form.js          # Trading form component
        └── Modal.js         # Modal dialog component
```

## Features

- **Interactive Trading Chart**: Candlestick charts with 5-decimal precision for forex trading
- **Multiple Timeframes**: Support for 1, 5, 15, 30 and 60-minute charts
- **Trade Management**: Place buy/sell orders, track profit/loss, close trades
- **Backtesting**: Test strategies using historical data with step-by-step candle progression
- **Trade Projections**: Create visual trading projections with support for long and short positions
- **Portfolio Tracking**: Real-time profit/loss calculation and trade history

## Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/initialize` | GET | Initialize the trading system |
| `/api/current_price` | GET | Get the current market price |
| `/api/historical_data` | POST | Fetch historical candlestick data |
| `/api/account` | GET/POST | Get all trades or create a new trade |
| `/api/close_trade` | POST | Close an existing trade |
| `/api/backtest` | POST | Get the next candlestick for backtesting |

## Technical Implementation

### Backend

The backend uses Flask with the following key components:

- `Trade` class: Manages individual trades with entry/exit, P&L calculation, and partial closes
- `TradingSystem` class: Orchestrates trade management, historical data loading, and P&L updates
- CORS-enabled API: Supports cross-origin requests from the frontend

### Frontend

The React frontend features:

- Lightweight Charts library for responsive, interactive trading charts
- Real-time trade management and projection tools
- Responsive UI controls for trading and backtesting
- Modal forms for trade entry and management

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.6+ and pip

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install flask flask-cors pandas
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to http://localhost:3000

## Usage

1. **Select Timeframe**: Choose from 1, 5, 15, 30, or 60-minute charts
2. **Place Trades**: Click "Buy" or "Sell" to open positions
3. **Create Projections**: Click on the chart to create price projections
4. **Backtest**: Click "Next Candle" to advance through historical data
5. **Manage Trades**: Close positions fully or partially

## Future Enhancements

- Additional technical indicators (RSI, MACD, Moving Averages)
- Trade strategies backtesting automation
- Performance metrics and statistics
- Multiple currency pair support
- Risk management tools

## License

This project is licensed under the MIT License.
