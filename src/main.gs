/**
 * AgriSwarm Main Orchestration
 * Coordinates all agents and provides main entry points
 * Uses Google Apps Script as a free alternative to Vertex AI
 */

/**
 * Global variables
 */
let sensorAgent;
let predictionAgent;
let resourceAgent;
let marketAgent;
let driveManager;

/**
 * Initialize all agents and services
 */
function initializeAgriSwarm() {
  try {
    // Initialize core services
    driveManager = new DriveManager();

    // Initialize agents
    sensorAgent = new SensorAgent();
    predictionAgent = new PredictionAgent();
    resourceAgent = new ResourceAgent();
    marketAgent = new MarketAgent();

    Logger.log('AgriSwarm initialized successfully');
    return true;
  } catch (error) {
    Logger.log(`Error initializing AgriSwarm: ${error.message}`);
    return false;
  }
}

/**
 * Main workflow - runs all agents and generates comprehensive report
 */
function runAgriSwarmWorkflow() {
  try {
    Logger.log('Starting AgriSwarm workflow...');

    // Initialize if not already done
    if (!sensorAgent) {
      initializeAgriSwarm();
    }

    // Collect current data
    const sensorData = sensorAgent.collectData();
    Logger.log('Sensor data collected');

    // Generate predictions
    const predictions = predictionAgent.generatePredictions();
    Logger.log('Predictions generated');

    // Allocate resources
    const resourceAllocation = resourceAgent.allocateResources();
    Logger.log('Resources allocated');

    // Generate market recommendations
    const marketAnalysis = marketAgent.generateMarketRecommendations();
    Logger.log('Market analysis completed');

    // Generate comprehensive report
    const report = generateComprehensiveReport({
      sensorData,
      predictions,
      resourceAllocation,
      marketAnalysis
    });

    Logger.log('AgriSwarm workflow completed successfully');
    return report;

  } catch (error) {
    Logger.log(`Error in AgriSwarm workflow: ${error.message}`);
    sendErrorNotification(error);
    return null;
  }
}

/**
 * Generate comprehensive report
 * @param {Object} data
 * @return {Object}
 */
function generateComprehensiveReport(data) {
  const report = {
    timestamp: new Date().toISOString(),
    executive_summary: generateExecutiveSummary(data),
    sensor_status: data.sensorData,
    predictions: data.predictions,
    resource_allocation: data.resourceAllocation,
    market_analysis: data.marketAnalysis,
    recommendations: generateRecommendations(data),
    alerts: generateAlerts(data)
  };

  // Save report to Drive
  saveComprehensiveReport(report);

  return report;
}

/**
 * Generate executive summary
 * @param {Object} data
 * @return {string}
 */
function generateExecutiveSummary(data) {
  const { predictions, resourceAllocation, marketAnalysis } = data;

  let summary = 'AgriSwarm Daily Report\n\n';

  summary += `Crop Status: ${predictions.quality.grade} quality (${predictions.quality.score}/100)\n`;
  summary += `Yield Prediction: ${predictions.yield.predictedYield} kg/acre (${predictions.yield.score}/100 confidence)\n`;
  summary += `Pest Risk: ${predictions.pestRisk.level} (${predictions.pestRisk.score}/100)\n`;
  summary += `Irrigation: ${predictions.irrigation.urgency} priority\n`;
  summary += `Harvest: ${predictions.harvest.daysToHarvest} days\n`;
  summary += `Market: ${marketAnalysis.selling_recommendation.action} (${marketAnalysis.price_prediction.predicted_price} PKR/kg)\n`;
  summary += `Risk Level: ${marketAnalysis.risk_assessment.overall_risk}\n`;

  return summary;
}

/**
 * Generate actionable recommendations
 * @param {Object} data
 * @return {Array}
 */
function generateRecommendations(data) {
  const recommendations = [];

  const { predictions, resourceAllocation, marketAnalysis } = data;

  // Irrigation recommendations
  if (predictions.irrigation.urgency === 'high') {
    recommendations.push({
      priority: 'high',
      category: 'irrigation',
      action: 'Immediate irrigation required',
      details: `${Math.round(resourceAllocation.water.amount)} liters needed`
    });
  }

  // Pest management recommendations
  if (predictions.pestRisk.level === 'high') {
    recommendations.push({
      priority: 'high',
      category: 'pest_control',
      action: 'Pest control measures needed',
      details: predictions.pestRisk.recommendations.join(', ')
    });
  }

  // Market recommendations
  if (marketAnalysis.selling_recommendation.action === 'sell_now') {
    recommendations.push({
      priority: 'medium',
      category: 'market',
      action: 'Consider selling now',
      details: `Expected price: ${marketAnalysis.price_prediction.predicted_price} PKR/kg`
    });
  }

  // Resource optimization
  if (resourceAllocation.priority === 'critical') {
    recommendations.push({
      priority: 'high',
      category: 'resources',
      action: 'Critical resource allocation required',
      details: 'Check water and labor resources immediately'
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Generate alerts based on current conditions
 * @param {Object} data
 * @return {Array}
 */
function generateAlerts(data) {
  const alerts = [];

  const { sensorData, predictions, marketAnalysis } = data;

  // Critical sensor alerts
  if (sensorData.temperature > 35 || sensorData.temperature < 10) {
    alerts.push({
      level: 'critical',
      type: 'temperature',
      message: `Extreme temperature: ${sensorData.temperature}°C`,
      timestamp: new Date().toISOString()
    });
  }

  // Critical pest alerts
  if (predictions.pestRisk.level === 'high') {
    alerts.push({
      level: 'high',
      type: 'pest',
      message: `High pest risk detected: ${predictions.pestRisk.score}/100`,
      timestamp: new Date().toISOString()
    });
  }

  // Market opportunity alerts
  if (marketAnalysis.selling_recommendation.action === 'sell_now') {
    alerts.push({
      level: 'medium',
      type: 'market_opportunity',
      message: 'Favorable market conditions for selling',
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

/**
 * Save comprehensive report to Google Drive
 * @param {Object} report
 */
function saveComprehensiveReport(report) {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `agriswarm_report_${timestamp}`;

    const reportData = {
      'Executive Summary': report.executive_summary,
      'Temperature': `${report.sensor_status.temperature}°C`,
      'Humidity': `${report.sensor_status.humidity}%`,
      'Soil Moisture': `${report.sensor_status.soilMoisture}%`,
      'Yield Prediction': `${report.predictions.yield.predictedYield} kg/acre`,
      'Pest Risk': report.predictions.pestRisk.level,
      'Irrigation Urgency': report.predictions.irrigation.urgency,
      'Market Price': `${report.market_analysis.price_prediction.predicted_price} PKR/kg`,
      'Risk Level': report.market_analysis.risk_assessment.overall_risk
    };

    driveManager.saveReport(fileName, reportData);
    Logger.log('Comprehensive report saved');
  } catch (error) {
    Logger.log(`Error saving report: ${error.message}`);
  }
}

/**
 * Send error notification
 * @param {Error} error
 */
function sendErrorNotification(error) {
  try {
    const subject = 'AgriSwarm System Error';
    const body = `
AgriSwarm encountered an error:

Error: ${error.message}
Timestamp: ${new Date().toISOString()}

Please check the system logs and take appropriate action.
    `;

    GmailApp.sendEmail('shehrbanoxgirlx@gmail.com', subject, body);
  } catch (emailError) {
    Logger.log(`Error sending notification: ${emailError.message}`);
  }
}

/**
 * Manual trigger functions for testing
 */
function testSensorAgent() {
  if (!sensorAgent) initializeAgriSwarm();
  const data = sensorAgent.collectData();
  Logger.log('Sensor test completed: ' + JSON.stringify(data));
  return data;
}

function testPredictionAgent() {
  if (!predictionAgent) initializeAgriSwarm();
  const predictions = predictionAgent.generatePredictions();
  Logger.log('Prediction test completed: ' + JSON.stringify(predictions));
  return predictions;
}

function testResourceAgent() {
  if (!resourceAgent) initializeAgriSwarm();
  const allocation = resourceAgent.allocateResources();
  Logger.log('Resource allocation test completed: ' + JSON.stringify(allocation));
  return allocation;
}

function testMarketAgent() {
  if (!marketAgent) initializeAgriSwarm();
  const analysis = marketAgent.generateMarketRecommendations();
  Logger.log('Market analysis test completed: ' + JSON.stringify(analysis));
  return analysis;
}

function testFullWorkflow() {
  return runAgriSwarmWorkflow();
}

/**
 * Setup function to run once
 */
function setupAgriSwarm() {
  initializeAgriSwarm();

  // Create initial folders
  if (driveManager) {
    Logger.log('Drive folders created');
  }

  Logger.log('AgriSwarm setup completed');
}

/**
 * Web app entry point for external access
 * @param {Object} e - Event parameter (for web app)
 * @return {string} JSON response
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'status';

    switch (action) {
      case 'run':
        const report = runAgriSwarmWorkflow();
        return ContentService.createTextOutput(JSON.stringify(report))
          .setMimeType(ContentService.MimeType.JSON);

      case 'sensor':
        const sensorData = testSensorAgent();
        return ContentService.createTextOutput(JSON.stringify(sensorData))
          .setMimeType(ContentService.MimeType.JSON);

      case 'predictions':
        const predictions = testPredictionAgent();
        return ContentService.createTextOutput(JSON.stringify(predictions))
          .setMimeType(ContentService.MimeType.JSON);

      case 'resources':
        const resources = testResourceAgent();
        return ContentService.createTextOutput(JSON.stringify(resources))
          .setMimeType(ContentService.MimeType.JSON);

      case 'market':
        const market = testMarketAgent();
        return ContentService.createTextOutput(JSON.stringify(market))
          .setMimeType(ContentService.MimeType.JSON);

      default:
        const status = {
          status: 'running',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          agents: ['sensor', 'prediction', 'resource', 'market']
        };

        return ContentService.createTextOutput(JSON.stringify(status))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    const errorResponse = {
      error: error.message,
      timestamp: new Date().toISOString()
    };

    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}