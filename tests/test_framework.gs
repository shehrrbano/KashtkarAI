/**
 * AgriSwarm Test Framework
 * Comprehensive testing suite for all agents and components
 */

/**
 * Test suite runner
 */
function runAllTests() {
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      duration: 0
    },
    tests: []
  };

  const startTime = new Date();

  try {
    // Initialize system
    initializeAgriSwarm();

    // Run all test suites
    results.tests.push(testSensorAgent());
    results.tests.push(testPredictionAgent());
    results.tests.push(testResourceAgent());
    results.tests.push(testMarketAgent());
    results.tests.push(testDriveManager());
    results.tests.push(testIntegration());

    // Calculate summary
    results.summary.total = results.tests.length;
    results.tests.forEach(test => {
      if (test.passed) results.summary.passed++;
      else results.summary.failed++;
    });

    results.summary.duration = new Date() - startTime;

    // Save results
    saveTestResults(results);

    Logger.log(`Test suite completed: ${results.summary.passed}/${results.summary.total} passed`);
    return results;

  } catch (error) {
    Logger.log(`Test suite error: ${error.message}`);
    results.error = error.message;
    return results;
  }
}

/**
 * Test Sensor Agent
 */
function testSensorAgent() {
  const test = {
    name: 'SensorAgent',
    passed: false,
    tests: [],
    duration: 0
  };

  const startTime = new Date();

  try {
    // Test data collection
    const data = sensorAgent.collectData();

    // Validate data structure
    assert(data.hasOwnProperty('temperature'), 'Temperature data missing');
    assert(data.hasOwnProperty('humidity'), 'Humidity data missing');
    assert(data.hasOwnProperty('soilMoisture'), 'Soil moisture data missing');
    assert(data.hasOwnProperty('location'), 'Location data missing');

    // Validate data ranges
    assert(data.temperature >= -10 && data.temperature <= 50, 'Temperature out of range');
    assert(data.humidity >= 0 && data.humidity <= 100, 'Humidity out of range');
    assert(data.soilMoisture >= 0 && data.soilMoisture <= 100, 'Soil moisture out of range');

    // Test historical data
    const historicalData = sensorAgent.getHistoricalData(5);
    assert(Array.isArray(historicalData), 'Historical data should be array');

    test.passed = true;
    test.tests.push({ name: 'Data Collection', passed: true });
    test.tests.push({ name: 'Data Validation', passed: true });
    test.tests.push({ name: 'Historical Data', passed: true });

  } catch (error) {
    test.error = error.message;
    test.tests.push({ name: 'Error', passed: false, error: error.message });
  }

  test.duration = new Date() - startTime;
  return test;
}

/**
 * Test Prediction Agent
 */
function testPredictionAgent() {
  const test = {
    name: 'PredictionAgent',
    passed: false,
    tests: [],
    duration: 0
  };

  const startTime = new Date();

  try {
    // Test prediction generation
    const predictions = predictionAgent.generatePredictions();

    // Validate prediction structure
    assert(predictions.hasOwnProperty('yield'), 'Yield prediction missing');
    assert(predictions.hasOwnProperty('pestRisk'), 'Pest risk prediction missing');
    assert(predictions.hasOwnProperty('irrigation'), 'Irrigation prediction missing');
    assert(predictions.hasOwnProperty('harvest'), 'Harvest prediction missing');
    assert(predictions.hasOwnProperty('quality'), 'Quality prediction missing');

    // Validate prediction ranges
    assert(predictions.yield.score >= 0 && predictions.yield.score <= 100, 'Yield score out of range');
    assert(predictions.pestRisk.score >= 0 && predictions.pestRisk.score <= 100, 'Pest risk score out of range');
    assert(predictions.irrigation.score >= 0 && predictions.irrigation.score <= 100, 'Irrigation score out of range');
    assert(predictions.quality.score >= 0 && predictions.quality.score <= 100, 'Quality score out of range');

    // Validate prediction values
    assert(predictions.yield.predictedYield > 0, 'Predicted yield should be positive');
    assert(predictions.harvest.daysToHarvest >= 0, 'Days to harvest should be non-negative');
    assert(['low', 'medium', 'high'].includes(predictions.pestRisk.level), 'Invalid pest risk level');
    assert(['low', 'medium', 'high'].includes(predictions.irrigation.urgency), 'Invalid irrigation urgency');

    test.passed = true;
    test.tests.push({ name: 'Prediction Generation', passed: true });
    test.tests.push({ name: 'Data Structure', passed: true });
    test.tests.push({ name: 'Value Ranges', passed: true });

  } catch (error) {
    test.error = error.message;
    test.tests.push({ name: 'Error', passed: false, error: error.message });
  }

  test.duration = new Date() - startTime;
  return test;
}

/**
 * Test Resource Agent
 */
function testResourceAgent() {
  const test = {
    name: 'ResourceAgent',
    passed: false,
    tests: [],
    duration: 0
  };

  const startTime = new Date();

  try {
    // Test resource allocation
    const allocation = resourceAgent.allocateResources();

    // Validate allocation structure
    assert(allocation.hasOwnProperty('water'), 'Water allocation missing');
    assert(allocation.hasOwnProperty('fertilizer'), 'Fertilizer allocation missing');
    assert(allocation.hasOwnProperty('labor'), 'Labor allocation missing');
    assert(allocation.hasOwnProperty('priority'), 'Priority missing');

    // Validate allocation values
    assert(allocation.water.amount >= 0, 'Water amount should be non-negative');
    assert(allocation.priority, 'Priority should be set');
    assert(['critical', 'high', 'medium', 'normal'].includes(allocation.priority), 'Invalid priority level');

    // Test resource utilization report
    const report = resourceAgent.getUtilizationReport();
    assert(report.hasOwnProperty('water_utilization'), 'Water utilization report missing');
    assert(report.hasOwnProperty('recommendations'), 'Recommendations missing');

    test.passed = true;
    test.tests.push({ name: 'Resource Allocation', passed: true });
    test.tests.push({ name: 'Utilization Report', passed: true });

  } catch (error) {
    test.error = error.message;
    test.tests.push({ name: 'Error', passed: false, error: error.message });
  }

  test.duration = new Date() - startTime;
  return test;
}

/**
 * Test Market Agent
 */
function testMarketAgent() {
  const test = {
    name: 'MarketAgent',
    passed: false,
    tests: [],
    duration: 0
  };

  const startTime = new Date();

  try {
    // Test market analysis
    const analysis = marketAgent.generateMarketRecommendations();

    // Validate analysis structure
    assert(analysis.hasOwnProperty('price_prediction'), 'Price prediction missing');
    assert(analysis.hasOwnProperty('selling_recommendation'), 'Selling recommendation missing');
    assert(analysis.hasOwnProperty('risk_assessment'), 'Risk assessment missing');

    // Validate price prediction
    assert(analysis.price_prediction.predicted_price > 0, 'Predicted price should be positive');
    assert(analysis.price_prediction.confidence >= 0 && analysis.price_prediction.confidence <= 100, 'Confidence out of range');

    // Validate selling recommendation
    assert(['sell_now', 'prepare_to_sell', 'hold', 'store'].includes(analysis.selling_recommendation.action), 'Invalid selling action');

    // Validate risk assessment
    assert(['low', 'medium', 'high'].includes(analysis.risk_assessment.overall_risk), 'Invalid risk level');
    assert(analysis.risk_assessment.risk_score >= 0 && analysis.risk_assessment.risk_score <= 100, 'Risk score out of range');

    test.passed = true;
    test.tests.push({ name: 'Market Analysis', passed: true });
    test.tests.push({ name: 'Price Prediction', passed: true });
    test.tests.push({ name: 'Risk Assessment', passed: true });

  } catch (error) {
    test.error = error.message;
    test.tests.push({ name: 'Error', passed: false, error: error.message });
  }

  test.duration = new Date() - startTime;
  return test;
}

/**
 * Test Drive Manager
 */
function testDriveManager() {
  const test = {
    name: 'DriveManager',
    passed: false,
    tests: [],
    duration: 0
  };

  const startTime = new Date();

  try {
    // Test folder creation
    const rootFolderId = driveManager.rootFolderId;
    assert(rootFolderId, 'Root folder ID should be set');

    // Test data saving
    const testData = {
      temperature: 25,
      humidity: 60,
      soilMoisture: 50
    };

    const sheetId = driveManager.saveSensorData(testData, 'test_data');
    assert(sheetId, 'Sheet ID should be returned');

    // Test report saving
    const reportData = {
      'Test Report': 'Test value',
      'Status': 'Success'
    };

    const reportId = driveManager.saveReport('test_report', reportData);
    assert(reportId, 'Report ID should be returned');

    test.passed = true;
    test.tests.push({ name: 'Folder Creation', passed: true });
    test.tests.push({ name: 'Data Saving', passed: true });
    test.tests.push({ name: 'Report Saving', passed: true });

  } catch (error) {
    test.error = error.message;
    test.tests.push({ name: 'Error', passed: false, error: error.message });
  }

  test.duration = new Date() - startTime;
  return test;
}

/**
 * Test Integration
 */
function testIntegration() {
  const test = {
    name: 'Integration',
    passed: false,
    tests: [],
    duration: 0
  };

  const startTime = new Date();

  try {
    // Test full workflow
    const report = runAgriSwarmWorkflow();
    assert(report, 'Full workflow should return report');
    assert(report.hasOwnProperty('executive_summary'), 'Report should have executive summary');
    assert(report.hasOwnProperty('predictions'), 'Report should have predictions');
    assert(report.hasOwnProperty('resource_allocation'), 'Report should have resource allocation');
    assert(report.hasOwnProperty('market_analysis'), 'Report should have market analysis');

    // Test web app interface
    const statusResponse = doGet({ parameter: {} });
    assert(statusResponse, 'Web app should return response');

    test.passed = true;
    test.tests.push({ name: 'Full Workflow', passed: true });
    test.tests.push({ name: 'Web Interface', passed: true });

  } catch (error) {
    test.error = error.message;
    test.tests.push({ name: 'Error', passed: false, error: error.message });
  }

  test.duration = new Date() - startTime;
  return test;
}

/**
 * Save test results to Drive
 * @param {Object} results
 */
function saveTestResults(results) {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `test_results_${timestamp}`;

    const reportData = {
      'Test Summary': `${results.summary.passed}/${results.summary.total} tests passed`,
      'Duration': `${results.summary.duration}ms`,
      'Timestamp': results.timestamp
    };

    // Add individual test results
    results.tests.forEach(test => {
      reportData[`${test.name} Result`] = test.passed ? 'PASSED' : 'FAILED';
      reportData[`${test.name} Duration`] = `${test.duration}ms`;
      if (test.error) {
        reportData[`${test.name} Error`] = test.error;
      }
    });

    driveManager.saveReport(fileName, reportData);
    Logger.log('Test results saved');
  } catch (error) {
    Logger.log(`Error saving test results: ${error.message}`);
  }
}

/**
 * Assertion helper function
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Individual test runners (for manual testing)
 */
function runSensorTests() {
  return testSensorAgent();
}

function runPredictionTests() {
  return testPredictionAgent();
}

function runResourceTests() {
  return testResourceAgent();
}

function runMarketTests() {
  return testMarketAgent();
}

function runDriveTests() {
  return testDriveManager();
}

function runIntegrationTests() {
  return testIntegration();
}