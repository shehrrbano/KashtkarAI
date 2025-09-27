/**
 * AgriSwarm Node.js Backend Server
 * Provides REST API for all AgriSwarm agents
 * Replicates Google Apps Script functionality
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Global variables (simulating Google Apps Script globals)
let sensorAgent;
let predictionAgent;
let resourceAgent;
let marketAgent;
let driveManager;

// Initialize AgriSwarm System
function initializeAgriSwarm() {
    console.log('🚀 Initializing AgriSwarm Backend System...');

    // Initialize components
    driveManager = new DriveManager();
    sensorAgent = new SensorAgent();
    predictionAgent = new PredictionAgent();
    resourceAgent = new ResourceAgent();
    marketAgent = new MarketAgent();

    console.log('✅ AgriSwarm initialized successfully');
    return true;
}

// Drive Manager (simulating Google Drive)
class DriveManager {
    constructor() {
        this.data = [];
        this.reports = [];
    }

    saveSensorData(data, filename) {
        const fileId = 'file_' + Date.now();
        this.data.push({
            id: fileId,
            filename: filename,
            data: data,
            timestamp: new Date().toISOString()
        });
        return fileId;
    }

    saveReport(filename, reportData) {
        const reportId = 'report_' + Date.now();
        this.reports.push({
            id: reportId,
            filename: filename,
            data: reportData,
            timestamp: new Date().toISOString()
        });
        return reportId;
    }

    appendDataToSheet(sheet, data, timestamp) {
        this.data.push({
            timestamp: timestamp,
            ...data
        });
    }
}

// Sensor Agent
class SensorAgent {
    constructor() {
        this.driveManager = new DriveManager();
        this.dataSheetId = null;
        this.alertThresholds = {
            temperature: { min: 10, max: 35 },
            humidity: { min: 40, max: 80 },
            soilMoisture: { min: 30, max: 70 }
        };
    }

    collectData() {
        const timestamp = new Date();
        const data = {
            temperature: this.getTemperature(),
            humidity: this.getHumidity(),
            soilMoisture: this.getSoilMoisture(),
            rainfall: this.getRainfall(),
            windSpeed: this.getWindSpeed(),
            solarRadiation: this.getSolarRadiation(),
            cropStage: this.getCropStage(),
            location: this.getLocation()
        };

        // Store data
        this.storeData(data, timestamp);

        // Check for alerts
        this.checkAlerts(data);

        return data;
    }

    getTemperature() {
        const baseTemp = 25;
        const variation = (Math.random() - 0.5) * 10;
        const seasonal = this.getSeasonalAdjustment();
        return Math.round((baseTemp + variation + seasonal) * 10) / 10;
    }

    getHumidity() {
        const baseHumidity = 60;
        const variation = (Math.random() - 0.5) * 20;
        return Math.round(Math.max(0, Math.min(100, baseHumidity + variation)));
    }

    getSoilMoisture() {
        const baseMoisture = 50;
        const variation = (Math.random() - 0.5) * 30;
        return Math.round(Math.max(0, Math.min(100, baseMoisture + variation)));
    }

    getRainfall() {
        const isMonsoon = this.isMonsoonSeason();
        const rainfall = isMonsoon ? Math.random() * 20 : Math.random() * 2;
        return Math.round(rainfall * 10) / 10;
    }

    getWindSpeed() {
        const baseSpeed = 5;
        const variation = Math.random() * 15;
        return Math.round((baseSpeed + variation) * 10) / 10;
    }

    getSolarRadiation() {
        const timeOfDay = new Date().getHours();
        const baseRadiation = this.getSolarRadiationByTime(timeOfDay);
        const variation = (Math.random() - 0.5) * 200;
        return Math.round(Math.max(0, baseRadiation + variation));
    }

    getCropStage() {
        const dayOfYear = this.getDayOfYear();
        const stages = ['planting', 'germination', 'vegetative', 'flowering', 'maturity', 'harvest'];
        const stageIndex = Math.floor((dayOfYear % 180) / 30);
        return stages[stageIndex] || 'unknown';
    }

    getLocation() {
        return {
            latitude: 31.5204,
            longitude: 74.3587,
            region: 'Punjab',
            district: 'Lahore'
        };
    }

    getSeasonalAdjustment() {
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 5) return 5;
        if (month >= 6 && month <= 8) return 10;
        if (month >= 9 && month <= 11) return 3;
        return -2;
    }

    isMonsoonSeason() {
        const month = new Date().getMonth() + 1;
        return month >= 7 && month <= 9;
    }

    getSolarRadiationByTime(hour) {
        if (hour < 6 || hour > 18) return 0;
        if (hour >= 6 && hour < 12) return 400 + (hour - 6) * 100;
        if (hour >= 12 && hour < 15) return 800;
        return 800 - (hour - 15) * 200;
    }

    getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    storeData(data, timestamp) {
        try {
            if (!this.dataSheetId) {
                this.dataSheetId = this.driveManager.saveSensorData(data, 'sensor_data');
            } else {
                this.driveManager.appendDataToSheet(null, data, timestamp.toISOString());
            }
            console.log('📊 Sensor data stored');
        } catch (error) {
            console.error('Error storing sensor data:', error.message);
        }
    }

    checkAlerts(data) {
        const alerts = [];

        if (data.temperature < this.alertThresholds.temperature.min) {
            alerts.push(`Low temperature alert: ${data.temperature}°C`);
        }
        if (data.temperature > this.alertThresholds.temperature.max) {
            alerts.push(`High temperature alert: ${data.temperature}°C`);
        }

        if (alerts.length > 0) {
            this.sendAlerts(alerts, data);
        }
    }

    sendAlerts(alerts, data) {
        console.log('🚨 Sensor Alerts:', alerts);
        // In production, this would send email via Gmail API
    }
}

// Prediction Agent
class PredictionAgent {
    constructor() {
        this.sensorAgent = new SensorAgent();
        this.driveManager = new DriveManager();
    }

    generatePredictions() {
        const currentData = this.sensorAgent.collectData();
        const historicalData = this.sensorAgent.getHistoricalData ? this.sensorAgent.getHistoricalData(30) : [];

        const predictions = {
            yield: this.predictYield(currentData, historicalData),
            pestRisk: this.predictPestRisk(currentData, historicalData),
            irrigation: this.predictIrrigationNeeds(currentData, historicalData),
            harvest: this.predictHarvestDate(currentData, historicalData),
            quality: this.predictCropQuality(currentData, historicalData),
            timestamp: new Date().toISOString()
        };

        this.storePredictions(predictions);
        return predictions;
    }

    predictYield(currentData, historicalData) {
        let yieldScore = 50;

        const tempOptimal = (currentData.temperature >= 20 && currentData.temperature <= 30) ? 20 : -10;
        yieldScore += tempOptimal;

        const waterScore = this.calculateWaterScore(currentData);
        yieldScore += waterScore;

        const solarScore = (currentData.solarRadiation > 400) ? 15 : -5;
        yieldScore += solarScore;

        const baseYield = 800;
        const predictedYield = Math.round(baseYield * (yieldScore / 100));

        return {
            score: Math.round(yieldScore),
            predictedYield: predictedYield,
            confidence: 85,
            factors: { temperature: tempOptimal, water: waterScore, solar: solarScore }
        };
    }

    predictPestRisk(currentData, historicalData) {
        let riskScore = 0;

        if (currentData.humidity > 70) riskScore += 30;
        if (currentData.temperature > 28) riskScore += 25;
        if (currentData.rainfall > 5) riskScore += 20;
        if (['flowering', 'maturity'].includes(currentData.cropStage)) {
            riskScore += 15;
        }

        const riskLevel = riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low';

        return {
            score: Math.round(riskScore),
            level: riskLevel,
            confidence: 80,
            recommendations: this.getPestRecommendations(riskLevel, currentData)
        };
    }

    predictIrrigationNeeds(currentData, historicalData) {
        let irrigationScore = 50;

        if (currentData.soilMoisture < 30) irrigationScore += 40;
        if (currentData.temperature > 30) irrigationScore += 25;
        if (currentData.humidity < 40) irrigationScore += 20;

        const urgency = irrigationScore > 80 ? 'high' : irrigationScore > 60 ? 'medium' : 'low';

        return {
            score: Math.round(irrigationScore),
            urgency: urgency,
            amount: urgency === 'high' ? 'heavy' : urgency === 'medium' ? 'moderate' : 'light',
            confidence: 75
        };
    }

    predictHarvestDate(currentData, historicalData) {
        const today = new Date();
        let daysToHarvest = 90;

        if (currentData.temperature > 25) daysToHarvest -= 10;
        if (currentData.soilMoisture > 60) daysToHarvest -= 5;

        const harvestDate = new Date(today);
        harvestDate.setDate(today.getDate() + daysToHarvest);

        return {
            daysToHarvest: daysToHarvest,
            estimatedDate: harvestDate.toISOString().split('T')[0],
            confidence: 70
        };
    }

    predictCropQuality(currentData, historicalData) {
        let qualityScore = 75;

        if (currentData.temperature >= 18 && currentData.temperature <= 25) {
            qualityScore += 15;
        }
        if (currentData.soilMoisture < 30 || currentData.soilMoisture > 80) {
            qualityScore -= 15;
        }
        if (currentData.solarRadiation > 500) {
            qualityScore += 10;
        }

        const qualityGrade = qualityScore > 85 ? 'premium' : qualityScore > 70 ? 'good' : 'standard';

        return {
            score: Math.round(qualityScore),
            grade: qualityGrade,
            confidence: 80
        };
    }

    calculateWaterScore(data) {
        if (data.soilMoisture >= 40 && data.soilMoisture <= 70) return 25;
        if (data.soilMoisture < 30) return -20;
        if (data.soilMoisture > 80) return -10;
        return 0;
    }

    getPestRecommendations(riskLevel, data) {
        if (riskLevel === 'high') {
            return ['Increase field monitoring frequency', 'Consider preventive pesticide application'];
        } else if (riskLevel === 'medium') {
            return ['Monitor fields every 2-3 days', 'Prepare pesticide application if needed'];
        }
        return ['Continue regular monitoring'];
    }

    storePredictions(predictions) {
        const filename = `predictions_${new Date().toISOString().split('T')[0]}`;
        const reportData = {
            'Yield Prediction': `Score: ${predictions.yield.score}, Expected: ${predictions.yield.predictedYield} kg/acre`,
            'Pest Risk': `Level: ${predictions.pestRisk.level}, Score: ${predictions.pestRisk.score}`,
            'Irrigation': `Urgency: ${predictions.irrigation.urgency}, Amount: ${predictions.irrigation.amount}`,
            'Harvest Date': `${predictions.harvest.estimatedDate} (${predictions.harvest.daysToHarvest} days)`,
            'Quality Grade': `${predictions.quality.grade} (${predictions.quality.score} score)`
        };

        this.driveManager.saveReport(filename, reportData);
        console.log('💾 Predictions stored');
    }
}

// Resource Agent
class ResourceAgent {
    constructor() {
        this.driveManager = new DriveManager();
    }

    allocateResources() {
        const allocation = {
            water: {
                amount: 5000 + Math.random() * 3000,
                timing: 'scheduled',
                efficiency: 0.85 + Math.random() * 0.1,
                source: 'borehole',
                distribution: 'drip_irrigation'
            },
            fertilizer: {
                nitrogen: Math.round(100 + Math.random() * 150),
                phosphorus: Math.round(50 + Math.random() * 80),
                potassium: Math.round(30 + Math.random() * 60),
                application_method: 'fertigation',
                timing: 'with_irrigation'
            },
            labor: {
                fieldwork: Math.round(5 + Math.random() * 5),
                irrigation: Math.round(2 + Math.random() * 3),
                pest_control: 2,
                harvest: Math.round(8 + Math.random() * 4),
                monitoring: 2,
                total: 0
            },
            equipment: {
                tractors_needed: 1,
                sprayers_needed: 1,
                irrigation_systems: 2,
                schedule: []
            },
            pesticides: {
                amount: 15 + Math.random() * 10,
                type: 'neem_oil',
                application_method: 'spraying',
                timing: 'early_morning'
            },
            priority: 'normal',
            costAnalysis: {
                water: Math.round(5000 * 0.05),
                fertilizer: Math.round(200 * 2.50 + 150 * 3.20 + 100 * 2.80),
                labor: Math.round(20 * 500),
                equipment: 2000,
                pesticides: Math.round(20 * 15),
                total: 0
            }
        };

        // Calculate totals
        allocation.labor.total = Object.values(allocation.labor)
            .filter(val => typeof val === 'number')
            .reduce((sum, val) => sum + val, 0);

        allocation.costAnalysis.total = Object.values(allocation.costAnalysis)
            .filter(val => typeof val === 'number')
            .reduce((sum, val) => sum + val, 0);

        return allocation;
    }
}

// Market Agent
class MarketAgent {
    constructor() {
        this.driveManager = new DriveManager();
    }

    generateMarketRecommendations() {
        const basePrice = 45 + Math.random() * 10;

        const analysis = {
            price_prediction: {
                crop: 'wheat',
                current_price: Math.round(basePrice * 100) / 100,
                predicted_price: Math.round((basePrice + (Math.random() - 0.5) * 5) * 100) / 100,
                confidence: Math.round(70 + Math.random() * 20),
                trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
                volatility: Math.round((Math.random() * 0.1) * 100) / 100
            },
            selling_recommendation: {
                action: Math.random() > 0.6 ? 'sell_now' : 'hold',
                timing: '2_weeks',
                reasoning: 'Based on current market analysis and price trends',
                confidence: Math.round(75 + Math.random() * 15)
            },
            risk_assessment: {
                overall_risk: Math.random() > 0.7 ? 'low' : 'medium',
                risk_score: Math.round(Math.random() * 50),
                risks: []
            }
        };

        return analysis;
    }
}

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        agents: ['sensor', 'prediction', 'resource', 'market'],
        uptime: process.uptime()
    });
});

app.get('/api/run', (req, res) => {
    try {
        console.log('🚀 Starting AgriSwarm workflow...');

        const sensorData = sensorAgent.collectData();
        const predictions = predictionAgent.generatePredictions();
        const resourceAllocation = resourceAgent.allocateResources();
        const marketAnalysis = marketAgent.generateMarketRecommendations();

        const report = {
            timestamp: new Date().toISOString(),
            executive_summary: generateExecutiveSummary({ sensorData, predictions, resourceAllocation, marketAnalysis }),
            sensor_status: sensorData,
            predictions: predictions,
            resource_allocation: resourceAllocation,
            market_analysis: marketAnalysis,
            recommendations: generateRecommendations({ predictions, resourceAllocation, marketAnalysis }),
            alerts: generateAlerts({ sensorData, predictions, marketAnalysis })
        };

        console.log('✅ AgriSwarm workflow completed');
        res.json(report);

    } catch (error) {
        console.error('❌ Workflow error:', error.message);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/sensor', (req, res) => {
    try {
        const data = sensorAgent.collectData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/predictions', (req, res) => {
    try {
        const predictions = predictionAgent.generatePredictions();
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/resources', (req, res) => {
    try {
        const allocation = resourceAgent.allocateResources();
        res.json(allocation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/market', (req, res) => {
    try {
        const analysis = marketAgent.generateMarketRecommendations();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions
function generateExecutiveSummary(data) {
    const { predictions, resourceAllocation, marketAnalysis } = data;

    return `AgriSwarm Daily Report

Crop Status: ${predictions.quality.grade} quality (${predictions.quality.score}/100)
Yield Prediction: ${predictions.yield.predictedYield} kg/acre (${predictions.yield.confidence}/100 confidence)
Pest Risk: ${predictions.pestRisk.level} (${predictions.pestRisk.score}/100)
Irrigation: ${predictions.irrigation.urgency} priority
Harvest: ${predictions.harvest.daysToHarvest} days
Market: ${marketAnalysis.selling_recommendation.action} (${marketAnalysis.price_prediction.predicted_price} PKR/kg)
Risk Level: ${marketAnalysis.risk_assessment.overall_risk}`;
}

function generateRecommendations(data) {
    const recommendations = [];
    const { predictions, resourceAllocation, marketAnalysis } = data;

    if (predictions.irrigation.urgency === 'high') {
        recommendations.push({
            priority: 'high',
            category: 'irrigation',
            action: 'Immediate irrigation required',
            details: `${Math.round(resourceAllocation.water.amount)} liters needed`
        });
    }

    if (predictions.pestRisk.level === 'high') {
        recommendations.push({
            priority: 'high',
            category: 'pest_control',
            action: 'Pest control measures needed',
            details: predictions.pestRisk.recommendations.join(', ')
        });
    }

    return recommendations.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

function generateAlerts(data) {
    const alerts = [];
    const { sensorData, predictions, marketAnalysis } = data;

    if (sensorData.temperature > 35 || sensorData.temperature < 10) {
        alerts.push({
            level: 'critical',
            type: 'temperature',
            message: `Extreme temperature: ${sensorData.temperature}°C`,
            timestamp: new Date().toISOString()
        });
    }

    if (predictions.pestRisk.level === 'high') {
        alerts.push({
            level: 'high',
            type: 'pest',
            message: `High pest risk detected: ${predictions.pestRisk.score}/100`,
            timestamp: new Date().toISOString()
        });
    }

    return alerts;
}

// Initialize and start server
initializeAgriSwarm();

app.listen(PORT, () => {
    console.log(`🌟 AgriSwarm Backend Server running on port ${PORT}`);
    console.log(`📡 API endpoints available:`);
    console.log(`   GET /api/status - System status`);
    console.log(`   GET /api/run - Full workflow`);
    console.log(`   GET /api/sensor - Sensor data`);
    console.log(`   GET /api/predictions - AI predictions`);
    console.log(`   GET /api/resources - Resource allocation`);
    console.log(`   GET /api/market - Market analysis`);
    console.log(`🚀 Ready to serve frontend requests!`);
});

module.exports = app;