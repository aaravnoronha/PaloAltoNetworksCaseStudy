# SmartFin AI 🤖💰

Full-Stack Financial Intelligence Platform

## Overview

SmartFin AI analyzes spending patterns to provide personalized financial insights. The platform detects subscriptions, identifies spending anomalies, and generates actionable recommendations using pattern recognition algorithms.

## Quick Start

```bash
# Clone repository
git clone https://github.com/aaravnoronha/PaloAltoNetworksCaseStudy.git
cd PaloAltoNetworksCaseStudy

# Start server
cd server
npm install
npm start

# Open client (new terminal/browser, use the file protocol)
file:///Users/aaravnoronha/PaloAltoNetworksCaseStudy/client/index.html
```

Server runs on `http://localhost:3000`

## Project Structure

```
PaloAltoNetworksCaseStudy/
├── client/
│   └── index.html       # Frontend application
├── server/
│   ├── server.js       # Express backend
│   ├── package.json    # Dependencies
│   └── node_modules/   
├── data/
│   └── *.csv          # Sample transaction files
├── README.md
└── DOCUMENTATION.md
```

## Features

### Core Functionality
- **Spending Analysis**: Categorizes transactions and identifies patterns
- **Subscription Detection**: Finds recurring charges automatically
- **AI Insights**: Generates personalized recommendations
- **Market Data**: Real-time financial indicators
- **CSV Upload**: Import custom transaction data

### Technical Highlights
- RESTful API with 8 endpoints
- 600+ synthetic transactions based on BLS data
- Real-time data processing
- In-memory storage for fast access
- Responsive design

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript ES6+ |
| Backend | Node.js, Express.js 5.1.0 |
| Data Processing | JavaScript, Statistical Analysis |
| Middleware | CORS 2.8.5, csv-parser 3.2.0 |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server status |
| `/api/summary` | GET | Financial summary |
| `/api/transactions` | GET | Transaction list |
| `/api/insights` | GET | AI insights |
| `/api/market` | GET | Market data |
| `/api/economic-indicators` | GET | Economic metrics |
| `/api/analyze` | POST | Pattern analysis |
| `/api/upload-csv` | POST | CSV import |

## Key Algorithms

### Subscription Detection
- Identifies recurring charges by merchant consistency
- Confidence scoring based on frequency
- Alerts for unused subscriptions

### Anomaly Detection
- Statistical analysis using Z-score
- Flags transactions > 3 standard deviations
- Real-time alerting

### Pattern Analysis
- Category-based spending trends
- Monthly projections
- Peer comparison metrics

## Installation

### Prerequisites
- Node.js v14+
- npm package manager

### Setup
```bash
# Install dependencies
cd server
npm install

# Start server
npm start

# Access application
# Backend API: http://localhost:3000
# Frontend UI: file:///Users/aaravnoronha/PaloAltoNetworksCaseStudy/client/index.html
```

## Usage

1. **Start Server**: Navigate to server folder and run `npm start`
2. **Open UI**: Open `file:///Users/aaravnoronha/PaloAltoNetworksCaseStudy/client/index.html` in browser
3. **Explore**: View insights and spending patterns
4. **Upload**: Import CSV files for custom analysis

### CSV Format
```csv
Date,Merchant,Amount,Category
2024-10-01,Starbucks,6.75,Coffee
2024-10-02,Amazon,45.23,Shopping
```

## Future Enhancements

- PostgreSQL integration
- Machine learning models (TensorFlow.js)
- Bank API connections (Plaid)
- Mobile applications

## Video Presentation

https://youtu.be/dQnEFCc-RyA

## Author

**Aarav Noronha**  
Palo Alto Networks IT Role Case Study  
September 2025
