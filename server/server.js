// server.js - SmartFin AI Backend Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { createReadStream } = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory cache for dataset
let financialDataset = [];
let marketData = {};
let economicIndicators = {};

// Initialize server and load datasets
async function initializeServer() {
    console.log('🚀 Initializing SmartFin AI Server...');
    
    // Load financial transaction dataset
    await loadFinancialDataset();
    
    // Load market data
    await loadMarketData();
    
    // Start server
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`📊 Dataset loaded: ${financialDataset.length} transactions`);
    });
}

// Load the financial dataset (using synthetic data based on consumer spending patterns)
async function loadFinancialDataset() {
    // Using a synthetic dataset based on BLS Consumer Expenditure Survey patterns
    // This represents typical American household spending patterns
    
    const categories = {
        'Food & Dining': { avgMonthly: 750, variance: 0.2, frequency: 15 },
        'Transportation': { avgMonthly: 820, variance: 0.3, frequency: 8 },
        'Housing': { avgMonthly: 1800, variance: 0.1, frequency: 3 },
        'Shopping': { avgMonthly: 450, variance: 0.4, frequency: 10 },
        'Entertainment': { avgMonthly: 280, variance: 0.3, frequency: 6 },
        'Healthcare': { avgMonthly: 380, variance: 0.5, frequency: 3 },
        'Utilities': { avgMonthly: 350, variance: 0.15, frequency: 4 },
        'Insurance': { avgMonthly: 550, variance: 0.1, frequency: 2 }
    };
    
    const merchants = {
        'Food & Dining': ['Whole Foods', 'Starbucks', 'Chipotle', 'Subway', 'Olive Garden', 'McDonalds', 'Trader Joes'],
        'Transportation': ['Shell Gas', 'Chevron', 'Uber', 'Lyft', 'Public Transit', 'Auto Repair'],
        'Housing': ['Property Management', 'Home Depot', 'Lowes', 'Mortgage Payment'],
        'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Costco', 'Nike'],
        'Entertainment': ['Netflix', 'Spotify', 'AMC Theaters', 'Steam Games', 'Hulu', 'Disney+'],
        'Healthcare': ['CVS Pharmacy', 'Walgreens', 'Kaiser', 'Dental Care', 'Vision Center'],
        'Utilities': ['PG&E Electric', 'Water Company', 'Comcast Internet', 'Verizon'],
        'Insurance': ['State Farm', 'Geico', 'Blue Cross', 'Life Insurance']
    };
    
    // Generate 6 months of transaction data
    const transactions = [];
    const today = new Date();
    
    for (let month = 0; month < 6; month++) {
        Object.entries(categories).forEach(([category, config]) => {
            const monthlyAmount = config.avgMonthly * (1 + (Math.random() - 0.5) * config.variance);
            const transactionCount = Math.round(config.frequency * (0.8 + Math.random() * 0.4));
            
            for (let i = 0; i < transactionCount; i++) {
                const date = new Date(today);
                date.setMonth(date.getMonth() - month);
                date.setDate(Math.floor(Math.random() * 28) + 1);
                
                const merchantList = merchants[category];
                const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
                const amount = (monthlyAmount / transactionCount) * (0.5 + Math.random());
                
                transactions.push({
                    id: `txn_${transactions.length}`,
                    date: date.toISOString().split('T')[0],
                    merchant: merchant,
                    category: category,
                    amount: Math.round(amount * 100) / 100,
                    userId: 'demo_user'
                });
            }
        });
    }
    
    // Add specific subscription patterns
    const subscriptions = [
        { merchant: 'Netflix', amount: 15.99, category: 'Entertainment' },
        { merchant: 'Spotify', amount: 9.99, category: 'Entertainment' },
        { merchant: 'Amazon Prime', amount: 14.99, category: 'Shopping' },
        { merchant: 'LA Fitness', amount: 34.99, category: 'Healthcare' },
        { merchant: 'Adobe Creative', amount: 52.99, category: 'Software' },
        { merchant: 'Hulu', amount: 12.99, category: 'Entertainment' }
    ];
    
    for (let month = 0; month < 6; month++) {
        subscriptions.forEach(sub => {
            const date = new Date(today);
            date.setMonth(date.getMonth() - month);
            date.setDate(1);
            
            transactions.push({
                id: `sub_${month}_${sub.merchant}`,
                date: date.toISOString().split('T')[0],
                merchant: sub.merchant,
                category: sub.category,
                amount: sub.amount,
                userId: 'demo_user',
                isRecurring: true
            });
        });
    }
    
    financialDataset = transactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
}

// Load market data (simulated based on historical averages)
async function loadMarketData() {
    // Based on historical market data and economic indicators
    marketData = {
        indices: [
            { symbol: 'S&P 500', value: 4515.23, change: 0.78, changePercent: 0.02 },
            { symbol: 'NASDAQ', value: 14125.48, change: -32.45, changePercent: -0.23 },
            { symbol: 'DOW', value: 35123.36, change: 156.78, changePercent: 0.45 },
            { symbol: 'Russell 2000', value: 1812.45, change: 12.34, changePercent: 0.69 }
        ],
        commodities: [
            { symbol: 'Gold', value: 1978.30, change: 5.20, unit: 'oz' },
            { symbol: 'Oil', value: 78.45, change: -1.23, unit: 'barrel' },
            { symbol: 'Bitcoin', value: 43567.89, change: 1234.56, unit: 'BTC' }
        ]
    };
    
    economicIndicators = {
        inflationRate: 3.7,
        unemploymentRate: 3.9,
        federalFundsRate: 5.5,
        gdpGrowth: 2.1,
        consumerConfidence: 102.5,
        retailSales: 0.3,
        mortgageRate30Y: 7.23,
        savingsRate: 4.1
    };
}

// API Routes

// Get financial summary for user
app.get('/api/summary', async (req, res) => {
    try {
        const recentTransactions = financialDataset.slice(0, 100);
        const totalSpent = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
        const categories = {};
        
        recentTransactions.forEach(t => {
            if (!categories[t.category]) {
                categories[t.category] = { total: 0, count: 0 };
            }
            categories[t.category].total += t.amount;
            categories[t.category].count++;
        });
        
        res.json({
            success: true,
            data: {
                totalSpent: Math.round(totalSpent * 100) / 100,
                transactionCount: recentTransactions.length,
                averageTransaction: Math.round((totalSpent / recentTransactions.length) * 100) / 100,
                topCategory: Object.entries(categories)
                    .sort((a, b) => b[1].total - a[1].total)[0][0],
                categoriesBreakdown: categories
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get transactions with optional filtering
app.get('/api/transactions', async (req, res) => {
    try {
        const { limit = 50, offset = 0, category, startDate, endDate } = req.query;
        
        let filtered = [...financialDataset];
        
        if (category) {
            filtered = filtered.filter(t => t.category === category);
        }
        
        if (startDate) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
        }
        
        if (endDate) {
            filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
        }
        
        const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
        
        res.json({
            success: true,
            data: {
                transactions: paginated,
                total: filtered.length,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get spending insights
app.get('/api/insights', async (req, res) => {
    try {
        const insights = [];
        const recentTransactions = financialDataset.slice(0, 30);
        
        // Coffee spending analysis
        const coffeeTransactions = recentTransactions.filter(t => 
            t.merchant.toLowerCase().includes('starbucks') || 
            t.merchant.toLowerCase().includes('coffee')
        );
        
        if (coffeeTransactions.length > 3) {
            const coffeeTotal = coffeeTransactions.reduce((sum, t) => sum + t.amount, 0);
            insights.push({
                type: 'warning',
                category: 'Coffee Spending',
                title: 'High Coffee Expenditure Detected',
                description: `You've spent $${coffeeTotal.toFixed(2)} on coffee in the last 30 days across ${coffeeTransactions.length} purchases.`,
                recommendation: `Consider brewing at home to save approximately $${(coffeeTotal * 0.7).toFixed(2)} monthly.`,
                potentialSavings: coffeeTotal * 0.7 * 12
            });
        }
        
        // Subscription detection
        const subscriptions = recentTransactions.filter(t => t.isRecurring);
        if (subscriptions.length > 0) {
            const subTotal = subscriptions.reduce((sum, t) => sum + t.amount, 0);
            insights.push({
                type: 'info',
                category: 'Subscriptions',
                title: 'Active Subscriptions Summary',
                description: `You have ${subscriptions.length} active subscriptions totaling $${subTotal.toFixed(2)} per month.`,
                recommendation: 'Review these subscriptions to ensure you\'re using all services.',
                subscriptions: [...new Set(subscriptions.map(s => s.merchant))]
            });
        }
        
        // Unusual spending detection
        const avgDaily = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / 30;
        const highSpending = recentTransactions.filter(t => t.amount > avgDaily * 3);
        
        if (highSpending.length > 0) {
            insights.push({
                type: 'alert',
                category: 'Unusual Activity',
                title: 'Large Transactions Detected',
                description: `${highSpending.length} transactions exceeded 3x your daily average spending.`,
                transactions: highSpending.slice(0, 3)
            });
        }
        
        // Category optimization
        const categorySpending = {};
        recentTransactions.forEach(t => {
            categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        });
        
        const topCategory = Object.entries(categorySpending)
            .sort((a, b) => b[1] - a[1])[0];
        
        insights.push({
            type: 'info',
            category: 'Spending Patterns',
            title: 'Top Spending Category',
            description: `${topCategory[0]} accounts for $${topCategory[1].toFixed(2)} (${((topCategory[1] / recentTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)}%) of your recent spending.`,
            recommendation: `Focus on optimizing ${topCategory[0]} expenses for maximum savings impact.`
        });
        
        res.json({
            success: true,
            data: {
                insights: insights,
                generatedAt: new Date().toISOString(),
                period: '30 days'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get market data
app.get('/api/market', async (req, res) => {
    try {
        // Simulate real-time updates
        const updatedMarket = {
            ...marketData,
            indices: marketData.indices.map(index => ({
                ...index,
                value: index.value * (1 + (Math.random() - 0.5) * 0.002),
                change: index.change * (0.9 + Math.random() * 0.2)
            })),
            timestamp: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: updatedMarket
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get economic indicators
app.get('/api/economic-indicators', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                ...economicIndicators,
                lastUpdated: new Date().toISOString(),
                source: 'Federal Reserve Economic Data (Simulated)'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Analyze spending patterns
app.post('/api/analyze', express.json(), async (req, res) => {
    try {
        const { transactions } = req.body;
        
        if (!transactions || !Array.isArray(transactions)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid transactions data' 
            });
        }
        
        // Perform analysis
        const analysis = {
            totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0),
            averageTransaction: 0,
            categories: {},
            merchants: {},
            patterns: {
                dailyAverage: 0,
                weeklyAverage: 0,
                monthlyProjection: 0
            },
            recommendations: []
        };
        
        analysis.averageTransaction = analysis.totalSpent / transactions.length;
        
        // Category analysis
        transactions.forEach(t => {
            if (!analysis.categories[t.category]) {
                analysis.categories[t.category] = { total: 0, count: 0 };
            }
            analysis.categories[t.category].total += t.amount;
            analysis.categories[t.category].count++;
            
            if (!analysis.merchants[t.merchant]) {
                analysis.merchants[t.merchant] = { total: 0, count: 0 };
            }
            analysis.merchants[t.merchant].total += t.amount;
            analysis.merchants[t.merchant].count++;
        });
        
        // Calculate patterns
        const days = new Set(transactions.map(t => t.date)).size;
        analysis.patterns.dailyAverage = analysis.totalSpent / days;
        analysis.patterns.weeklyAverage = analysis.patterns.dailyAverage * 7;
        analysis.patterns.monthlyProjection = analysis.patterns.dailyAverage * 30;
        
        // Generate recommendations
        if (analysis.patterns.monthlyProjection > 5000) {
            analysis.recommendations.push({
                type: 'warning',
                text: 'Monthly spending exceeds $5000. Consider setting category budgets.'
            });
        }
        
        const topMerchant = Object.entries(analysis.merchants)
            .sort((a, b) => b[1].total - a[1].total)[0];
        
        if (topMerchant[1].total > analysis.totalSpent * 0.2) {
            analysis.recommendations.push({
                type: 'info',
                text: `${topMerchant[0]} accounts for over 20% of spending. Look for alternatives or discounts.`
            });
        }
        
        res.json({
            success: true,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload and analyze CSV
app.post('/api/upload-csv', express.text(), async (req, res) => {
    try {
        const csvData = req.body;
        const lines = csvData.split('\n');
        const transactions = [];
        
        // Skip header and parse lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const [date, merchant, amount, category] = line.split(',').map(s => s.trim());
            if (date && merchant && amount) {
                transactions.push({
                    id: `upload_${i}`,
                    date: date,
                    merchant: merchant,
                    amount: parseFloat(amount),
                    category: category || 'Other',
                    userId: 'demo_user'
                });
            }
        }
        
        // Add to dataset
        financialDataset = [...transactions, ...financialDataset];
        
        res.json({
            success: true,
            data: {
                transactionsAdded: transactions.length,
                totalTransactions: financialDataset.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        datasetSize: financialDataset.length
    });
});

// Start the server
initializeServer();
