/**
 * Prediction Agent for AgriSwarm
 * Analyzes sensor data and predicts crop outcomes
 * Uses rule-based algorithms and historical data analysis
 *
 * @constructor
 */
function PredictionAgent() {
  this.sensorAgent = new SensorAgent();
  this.driveManager = new DriveManager();
  this.predictionModels = {
    yield: this.initializeYieldModel(),
    pest: this.initializePestModel(),
    irrigation: this.initializeIrrigationModel()
  };
}

/**
 * Generate comprehensive predictions
 * @return {Object} Prediction results
 */
PredictionAgent.prototype.generatePredictions = function() {
  const currentData = this.sensorAgent.collectData();
  const historicalData = this.sensorAgent.getHistoricalData(30);

  const predictions = {
    yield: this.predictYield(currentData, historicalData),
    pestRisk: this.predictPestRisk(currentData, historicalData),
    irrigation: this.predictIrrigationNeeds(currentData, historicalData),
    harvest: this.predictHarvestDate(currentData, historicalData),
    quality: this.predictCropQuality(currentData, historicalData),
    timestamp: new Date().toISOString()
  };

  // Store predictions
  this.storePredictions(predictions);

  return predictions;
};

/**
 * Predict crop yield
 * @param {Object} currentData
 * @param {Array} historicalData
 * @return {Object} Yield prediction
 */
PredictionAgent.prototype.predictYield = function(currentData, historicalData) {
  // Simple yield prediction model based on environmental factors
  let yieldScore = 50; // Base score

  // Temperature impact (optimal: 20-30°C)
  const tempOptimal = (currentData.temperature >= 20 && currentData.temperature <= 30) ? 20 : -10;
  yieldScore += tempOptimal;

  // Water availability impact
  const waterScore = this.calculateWaterScore(currentData);
  yieldScore += waterScore;

  // Solar radiation impact
  const solarScore = (currentData.solarRadiation > 400) ? 15 : -5;
  yieldScore += solarScore;

  // Historical performance
  const historicalAvg = this.calculateHistoricalAverage(historicalData);
  yieldScore = (yieldScore + historicalAvg) / 2;

  // Convert to yield estimate (kg/acre)
  const baseYield = 800; // Base yield for wheat in Pakistan
  const predictedYield = Math.round(baseYield * (yieldScore / 100));

  return {
    score: Math.round(yieldScore),
    predictedYield: predictedYield,
    confidence: this.calculateConfidence(historicalData),
    factors: {
      temperature: tempOptimal,
      water: waterScore,
      solar: solarScore,
      historical: historicalAvg
    }
  };
};

/**
 * Predict pest risk
 * @param {Object} currentData
 * @param {Array} historicalData
 * @return {Object} Pest risk assessment
 */
PredictionAgent.prototype.predictPestRisk = function(currentData, historicalData) {
  let riskScore = 0;

  // High humidity increases pest risk
  if (currentData.humidity > 70) riskScore += 30;
  else if (currentData.humidity > 60) riskScore += 15;

  // High temperature increases pest activity
  if (currentData.temperature > 28) riskScore += 25;
  else if (currentData.temperature > 25) riskScore += 10;

  // Recent rainfall can increase pest pressure
  if (currentData.rainfall > 5) riskScore += 20;

  // Dense crop stage increases vulnerability
  if (['flowering', 'maturity'].includes(currentData.cropStage)) {
    riskScore += 15;
  }

  // Historical pest patterns
  const historicalRisk = this.analyzeHistoricalPestRisk(historicalData);
  riskScore = (riskScore + historicalRisk) / 2;

  const riskLevel = riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low';

  return {
    score: Math.round(riskScore),
    level: riskLevel,
    confidence: this.calculateConfidence(historicalData),
    recommendations: this.getPestRecommendations(riskLevel, currentData)
  };
};

/**
 * Predict irrigation needs
 * @param {Object} currentData
 * @param {Array} historicalData
 * @return {Object} Irrigation recommendation
 */
PredictionAgent.prototype.predictIrrigationNeeds = function(currentData, historicalData) {
  let irrigationScore = 50;

  // Soil moisture is primary factor
  if (currentData.soilMoisture < 30) irrigationScore += 40;
  else if (currentData.soilMoisture < 50) irrigationScore += 20;
  else if (currentData.soilMoisture > 70) irrigationScore -= 20;

  // High temperature increases water demand
  if (currentData.temperature > 30) irrigationScore += 25;
  else if (currentData.temperature > 25) irrigationScore += 10;

  // Low humidity increases evapotranspiration
  if (currentData.humidity < 40) irrigationScore += 20;
  else if (currentData.humidity < 60) irrigationScore += 10;

  // Wind speed affects water loss
  if (currentData.windSpeed > 10) irrigationScore += 15;

  // Crop stage water requirements
  const stageMultiplier = this.getCropStageWaterMultiplier(currentData.cropStage);
  irrigationScore *= stageMultiplier;

  const urgency = irrigationScore > 80 ? 'high' : irrigationScore > 60 ? 'medium' : 'low';
  const amount = irrigationScore > 80 ? 'heavy' : irrigationScore > 60 ? 'moderate' : 'light';

  return {
    score: Math.round(irrigationScore),
    urgency: urgency,
    amount: amount,
    timing: this.getIrrigationTiming(urgency),
    confidence: this.calculateConfidence(historicalData)
  };
};

/**
 * Predict harvest date
 * @param {Object} currentData
 * @param {Array} historicalData
 * @return {Object} Harvest prediction
 */
PredictionAgent.prototype.predictHarvestDate = function(currentData, historicalData) {
  const today = new Date();
  let daysToHarvest = 90; // Default for wheat

  // Adjust based on current conditions
  if (currentData.temperature > 25) daysToHarvest -= 10; // Warmer = faster growth
  if (currentData.soilMoisture > 60) daysToHarvest -= 5;  // Good moisture = faster growth
  if (currentData.solarRadiation > 600) daysToHarvest -= 5; // Good sunlight = faster growth

  // Adjust based on crop stage
  const stageDays = this.getDaysFromCropStage(currentData.cropStage);
  daysToHarvest = Math.max(30, daysToHarvest + stageDays);

  const harvestDate = new Date(today);
  harvestDate.setDate(today.getDate() + daysToHarvest);

  return {
    daysToHarvest: daysToHarvest,
    estimatedDate: harvestDate.toISOString().split('T')[0],
    confidence: this.calculateConfidence(historicalData),
    factors: {
      temperature: currentData.temperature,
      moisture: currentData.soilMoisture,
      stage: currentData.cropStage
    }
  };
};

/**
 * Predict crop quality
 * @param {Object} currentData
 * @param {Array} historicalData
 * @return {Object} Quality assessment
 */
PredictionAgent.prototype.predictCropQuality = function(currentData, historicalData) {
  let qualityScore = 75; // Base quality score

  // Optimal temperature range
  if (currentData.temperature >= 18 && currentData.temperature <= 25) {
    qualityScore += 15;
  } else if (currentData.temperature < 15 || currentData.temperature > 30) {
    qualityScore -= 20;
  }

  // Water stress affects quality
  if (currentData.soilMoisture < 30 || currentData.soilMoisture > 80) {
    qualityScore -= 15;
  }

  // Pest pressure affects quality
  if (currentData.humidity > 75 && currentData.temperature > 25) {
    qualityScore -= 10;
  }

  // Solar radiation for photosynthesis
  if (currentData.solarRadiation > 500) {
    qualityScore += 10;
  }

  const qualityGrade = qualityScore > 85 ? 'premium' : qualityScore > 70 ? 'good' : 'standard';

  return {
    score: Math.round(qualityScore),
    grade: qualityGrade,
    confidence: this.calculateConfidence(historicalData),
    marketValue: this.estimateMarketValue(qualityGrade)
  };
};

/**
 * Store predictions for historical analysis
 * @param {Object} predictions
 */
PredictionAgent.prototype.storePredictions = function(predictions) {
  try {
    const fileName = `predictions_${new Date().toISOString().split('T')[0]}`;
    const reportData = {
      'Yield Prediction': `Score: ${predictions.yield.score}, Expected: ${predictions.yield.predictedYield} kg/acre`,
      'Pest Risk': `Level: ${predictions.pestRisk.level}, Score: ${predictions.pestRisk.score}`,
      'Irrigation': `Urgency: ${predictions.irrigation.urgency}, Amount: ${predictions.irrigation.amount}`,
      'Harvest Date': `${predictions.harvest.estimatedDate} (${predictions.harvest.daysToHarvest} days)`,
      'Quality Grade': `${predictions.quality.grade} (${predictions.quality.score} score)`
    };

    this.driveManager.saveReport(fileName, reportData);
    Logger.log('Predictions stored successfully');
  } catch (error) {
    Logger.log(`Error storing predictions: ${error.message}`);
  }
};

/**
 * Calculate water score based on current conditions
 * @param {Object} data
 * @return {number}
 */
PredictionAgent.prototype.calculateWaterScore = function(data) {
  let score = 0;

  if (data.soilMoisture >= 40 && data.soilMoisture <= 70) score += 25;
  else if (data.soilMoisture < 30) score -= 20;
  else if (data.soilMoisture > 80) score -= 10;

  if (data.rainfall > 0) score += 10;

  return score;
};

/**
 * Calculate historical average yield score
 * @param {Array} historicalData
 * @return {number}
 */
PredictionAgent.prototype.calculateHistoricalAverage = function(historicalData) {
  if (historicalData.length === 0) return 50;

  const recentData = historicalData.slice(-10); // Last 10 readings
  const avgTemp = recentData.reduce((sum, d) => sum + (d.temperature || 25), 0) / recentData.length;
  const avgMoisture = recentData.reduce((sum, d) => sum + (d.soilMoisture || 50), 0) / recentData.length;

  return ((avgTemp / 30 * 50) + (avgMoisture / 70 * 50)) / 2;
};

/**
 * Analyze historical pest risk patterns
 * @param {Array} historicalData
 * @return {number}
 */
PredictionAgent.prototype.analyzeHistoricalPestRisk = function(historicalData) {
  if (historicalData.length === 0) return 0;

  const recentData = historicalData.slice(-7); // Last week
  let riskSum = 0;

  recentData.forEach(data => {
    if (data.humidity > 70) riskSum += 30;
    if (data.temperature > 25) riskSum += 20;
  });

  return riskSum / recentData.length;
};

/**
 * Get pest management recommendations
 * @param {string} riskLevel
 * @param {Object} data
 * @return {Array}
 */
PredictionAgent.prototype.getPestRecommendations = function(riskLevel, data) {
  const recommendations = [];

  if (riskLevel === 'high') {
    recommendations.push('Increase field monitoring frequency');
    recommendations.push('Consider preventive pesticide application');
    recommendations.push('Check for pest damage daily');
  } else if (riskLevel === 'medium') {
    recommendations.push('Monitor fields every 2-3 days');
    recommendations.push('Prepare pesticide application if needed');
  } else {
    recommendations.push('Continue regular monitoring');
  }

  return recommendations;
};

/**
 * Get irrigation timing recommendation
 * @param {string} urgency
 * @return {string}
 */
PredictionAgent.prototype.getIrrigationTiming = function(urgency) {
  switch (urgency) {
    case 'high': return 'Within 24 hours';
    case 'medium': return 'Within 48 hours';
    default: return 'Within 1 week';
  }
};

/**
 * Get water requirement multiplier by crop stage
 * @param {string} stage
 * @return {number}
 */
PredictionAgent.prototype.getCropStageWaterMultiplier = function(stage) {
  const multipliers = {
    'planting': 0.8,
    'germination': 1.2,
    'vegetative': 1.0,
    'flowering': 1.3,
    'maturity': 0.9,
    'harvest': 0.6
  };

  return multipliers[stage] || 1.0;
};

/**
 * Get days to add based on crop stage
 * @param {string} stage
 * @return {number}
 */
PredictionAgent.prototype.getDaysFromCropStage = function(stage) {
  const stageDays = {
    'planting': 80,
    'germination': 60,
    'vegetative': 40,
    'flowering': 20,
    'maturity': 10,
    'harvest': 0
  };

  return stageDays[stage] || 45;
};

/**
 * Calculate confidence level based on data availability
 * @param {Array} historicalData
 * @return {number}
 */
PredictionAgent.prototype.calculateConfidence = function(historicalData) {
  if (historicalData.length < 5) return 60;
  if (historicalData.length < 15) return 75;
  if (historicalData.length < 30) return 85;
  return 95;
};

/**
 * Estimate market value based on quality
 * @param {string} grade
 * @return {number}
 */
PredictionAgent.prototype.estimateMarketValue = function(grade) {
  const basePrice = 50; // Base price per kg in PKR
  const multipliers = {
    'premium': 1.3,
    'good': 1.1,
    'standard': 1.0
  };

  return Math.round(basePrice * (multipliers[grade] || 1.0));
};