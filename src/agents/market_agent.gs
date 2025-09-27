/**
 * Market Agent for AgriSwarm
 * Provides market intelligence, price predictions, and selling recommendations
 * Integrates with external market data and local trends
 *
 * @constructor
 */
function MarketAgent() {
  this.driveManager = new DriveManager();
  this.sensorAgent = new SensorAgent();
  this.predictionAgent = new PredictionAgent();

  this.marketData = {
    crops: this.initializeCropData(),
    markets: this.initializeMarketData(),
    trends: this.initializeTrendData()
  };

  this.priceHistory = [];
}

/**
 * Generate market recommendations
 * @return {Object} Market analysis and recommendations
 */
MarketAgent.prototype.generateMarketRecommendations = function() {
  const currentData = this.sensorAgent.collectData();
  const predictions = this.predictionAgent.generatePredictions();

  const analysis = {
    price_prediction: this.predictPrices(currentData, predictions),
    selling_recommendation: this.getSellingRecommendation(currentData, predictions),
    market_trends: this.analyzeMarketTrends(),
    competitor_analysis: this.analyzeCompetitors(),
    risk_assessment: this.assessMarketRisks(currentData, predictions),
    timestamp: new Date().toISOString()
  };

  // Store analysis
  this.storeMarketAnalysis(analysis);

  return analysis;
};

/**
 * Predict market prices for crops
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {Object} Price predictions
 */
MarketAgent.prototype.predictPrices = function(currentData, predictions) {
  const crop = this.identifyCropType(currentData);
  const basePrice = this.marketData.crops[crop].basePrice;

  let priceMultiplier = 1.0;

  // Quality adjustment
  const qualityMultiplier = this.getQualityPriceMultiplier(predictions.quality.grade);
  priceMultiplier *= qualityMultiplier;

  // Supply-demand adjustment
  const supplyDemandMultiplier = this.calculateSupplyDemandMultiplier();
  priceMultiplier *= supplyDemandMultiplier;

  // Seasonal adjustment
  const seasonalMultiplier = this.getSeasonalPriceMultiplier();
  priceMultiplier *= seasonalMultiplier;

  // Market trend adjustment
  const trendMultiplier = this.getMarketTrendMultiplier();
  priceMultiplier *= trendMultiplier;

  const predictedPrice = Math.round(basePrice * priceMultiplier);
  const priceRange = {
    low: Math.round(predictedPrice * 0.9),
    high: Math.round(predictedPrice * 1.1)
  };

  return {
    crop: crop,
    current_price: basePrice,
    predicted_price: predictedPrice,
    price_range: priceRange,
    confidence: this.calculatePriceConfidence(),
    factors: {
      quality: qualityMultiplier,
      supply_demand: supplyDemandMultiplier,
      seasonal: seasonalMultiplier,
      trend: trendMultiplier
    }
  };
};

/**
 * Get selling recommendation
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {Object} Selling recommendation
 */
MarketAgent.prototype.getSellingRecommendation = function(currentData, predictions) {
  const pricePrediction = this.predictPrices(currentData, predictions);
  const daysToHarvest = predictions.harvest.daysToHarvest;

  let recommendation = {
    action: 'hold',
    timing: 'not_applicable',
    reasoning: '',
    confidence: 75
  };

  // Immediate selling opportunities
  if (pricePrediction.predicted_price > pricePrediction.current_price * 1.15) {
    recommendation.action = 'sell_now';
    recommendation.timing = 'immediate';
    recommendation.reasoning = 'Strong price premium available in current market';
    recommendation.confidence = 85;
  }
  // Near-term selling (within 2 weeks)
  else if (daysToHarvest <= 14 && pricePrediction.predicted_price > pricePrediction.current_price * 1.05) {
    recommendation.action = 'prepare_to_sell';
    recommendation.timing = 'within_2_weeks';
    recommendation.reasoning = 'Harvest approaching with favorable price trend';
    recommendation.confidence = 80;
  }
  // Hold for better prices
  else if (pricePrediction.predicted_price < pricePrediction.current_price * 0.95) {
    recommendation.action = 'hold';
    recommendation.timing = 'wait_for_better_prices';
    recommendation.reasoning = 'Market prices expected to improve';
    recommendation.confidence = 70;
  }
  // Storage recommendation
  else if (predictions.quality.grade === 'premium') {
    recommendation.action = 'store';
    recommendation.timing = 'consider_storage';
    recommendation.reasoning = 'Premium quality crop - storage may increase value';
    recommendation.confidence = 75;
  }

  return recommendation;
};

/**
 * Analyze market trends
 * @return {Object} Market trend analysis
 */
MarketAgent.prototype.analyzeMarketTrends = function() {
  const trends = {
    short_term: this.analyzeShortTermTrends(),
    long_term: this.analyzeLongTermTrends(),
    seasonal_patterns: this.analyzeSeasonalPatterns(),
    regional_comparison: this.analyzeRegionalComparison()
  };

  return trends;
};

/**
 * Analyze competitor activities
 * @return {Object} Competitor analysis
 */
MarketAgent.prototype.analyzeCompetitors = function() {
  const competitors = {
    local_farmers: this.analyzeLocalFarmers(),
    wholesale_markets: this.analyzeWholesaleMarkets(),
    export_opportunities: this.analyzeExportOpportunities(),
    price_competition: this.analyzePriceCompetition()
  };

  return competitors;
};

/**
 * Assess market risks
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {Object} Risk assessment
 */
MarketAgent.prototype.assessMarketRisks = function(currentData, predictions) {
  const risks = [];

  // Price volatility risk
  if (this.calculatePriceVolatility() > 20) {
    risks.push({
      type: 'price_volatility',
      level: 'medium',
      description: 'High price fluctuations in recent weeks',
      mitigation: 'Consider forward contracts or price hedging'
    });
  }

  // Supply glut risk
  if (this.isSupplyGlutExpected()) {
    risks.push({
      type: 'oversupply',
      level: 'high',
      description: 'Market oversupply expected due to favorable weather',
      mitigation: 'Consider early harvest or storage options'
    });
  }

  // Quality risk
  if (predictions.quality.score < 70) {
    risks.push({
      type: 'quality',
      level: 'medium',
      description: 'Crop quality may affect market price',
      mitigation: 'Focus on post-harvest handling and quality improvement'
    });
  }

  // Weather risk
  if (currentData.temperature > 35 || currentData.temperature < 10) {
    risks.push({
      type: 'weather',
      level: 'high',
      description: 'Extreme weather may damage crops before harvest',
      mitigation: 'Monitor weather forecasts and consider early harvest'
    });
  }

  const overall_risk = risks.length > 2 ? 'high' : risks.length > 0 ? 'medium' : 'low';

  return {
    overall_risk: overall_risk,
    risks: risks,
    risk_score: this.calculateRiskScore(risks)
  };
};

/**
 * Store market analysis for historical tracking
 * @param {Object} analysis
 */
MarketAgent.prototype.storeMarketAnalysis = function(analysis) {
  this.priceHistory.push({
    timestamp: analysis.timestamp,
    price: analysis.price_prediction.predicted_price,
    crop: analysis.price_prediction.crop
  });

  // Keep only last 90 days of history
  if (this.priceHistory.length > 90) {
    this.priceHistory = this.priceHistory.slice(-90);
  }

  try {
    const data = {
      timestamp: analysis.timestamp,
      predicted_price: analysis.price_prediction.predicted_price,
      recommendation: analysis.selling_recommendation.action,
      risk_level: analysis.risk_assessment.overall_risk
    };

    const sheetId = this.driveManager.saveSensorData(data, 'market_analysis');
    Logger.log('Market analysis stored');
  } catch (error) {
    Logger.log(`Error storing market analysis: ${error.message}`);
  }
};

/**
 * Identify crop type based on sensor data
 * @param {Object} data
 * @return {string}
 */
MarketAgent.prototype.identifyCropType = function(data) {
  // Default to wheat for this demo
  // In a real system, this would use more sophisticated crop identification
  return 'wheat';
};

/**
 * Get quality-based price multiplier
 * @param {string} grade
 * @return {number}
 */
MarketAgent.prototype.getQualityPriceMultiplier = function(grade) {
  const multipliers = {
    'premium': 1.3,
    'good': 1.1,
    'standard': 1.0
  };

  return multipliers[grade] || 1.0;
};

/**
 * Calculate supply-demand multiplier
 * @return {number}
 */
MarketAgent.prototype.calculateSupplyDemandMultiplier = function() {
  // Simplified supply-demand calculation
  const month = new Date().getMonth() + 1;

  // Post-harvest months typically have higher supply
  if (month >= 4 && month <= 6) return 0.9; // Wheat harvest season
  if (month >= 10 && month <= 12) return 0.95; // Pre-harvest shortage

  return 1.0;
};

/**
 * Get seasonal price multiplier
 * @return {number}
 */
MarketAgent.prototype.getSeasonalPriceMultiplier = function() {
  const month = new Date().getMonth() + 1;

  // Prices typically higher before harvest season
  if (month >= 1 && month <= 3) return 1.2; // Pre-harvest high prices
  if (month >= 4 && month <= 6) return 0.9; // Post-harvest low prices
  if (month >= 7 && month <= 9) return 1.0; // Monsoon season
  if (month >= 10 && month <= 12) return 1.1; // Recovery period

  return 1.0;
};

/**
 * Get market trend multiplier
 * @return {number}
 */
MarketAgent.prototype.getMarketTrendMultiplier = function() {
  if (this.priceHistory.length < 7) return 1.0;

  const recent = this.priceHistory.slice(-7);
  const previous = this.priceHistory.slice(-14, -7);

  if (previous.length === 0) return 1.0;

  const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length;
  const previousAvg = previous.reduce((sum, p) => sum + p.price, 0) / previous.length;

  const trend = recentAvg / previousAvg;

  return Math.max(0.8, Math.min(1.3, trend));
};

/**
 * Calculate price confidence
 * @return {number}
 */
MarketAgent.prototype.calculatePriceConfidence = function() {
  const dataPoints = this.priceHistory.length;
  const volatility = this.calculatePriceVolatility();

  let confidence = 50; // Base confidence

  if (dataPoints > 30) confidence += 20;
  else if (dataPoints > 15) confidence += 10;

  if (volatility < 10) confidence += 15;
  else if (volatility < 20) confidence += 5;
  else confidence -= 10;

  return Math.min(95, Math.max(30, confidence));
};

/**
 * Calculate price volatility
 * @return {number}
 */
MarketAgent.prototype.calculatePriceVolatility = function() {
  if (this.priceHistory.length < 7) return 0;

  const recent = this.priceHistory.slice(-7);
  const prices = recent.map(p => p.price);

  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance) / mean * 100;

  return Math.round(volatility);
};

/**
 * Analyze short-term trends (7 days)
 * @return {Object}
 */
MarketAgent.prototype.analyzeShortTermTrends = function() {
  if (this.priceHistory.length < 7) {
    return { trend: 'insufficient_data', confidence: 0 };
  }

  const recent = this.priceHistory.slice(-7);
  const prices = recent.map(p => p.price);

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;

  const trend = change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable';

  return {
    trend: trend,
    change_percentage: Math.round(change * 10) / 10,
    confidence: 80
  };
};

/**
 * Analyze long-term trends (30 days)
 * @return {Object}
 */
MarketAgent.prototype.analyzeLongTermTrends = function() {
  if (this.priceHistory.length < 30) {
    return { trend: 'insufficient_data', confidence: 0 };
  }

  const recent = this.priceHistory.slice(-30);
  const prices = recent.map(p => p.price);

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;

  const trend = change > 10 ? 'increasing' : change < -10 ? 'decreasing' : 'stable';

  return {
    trend: trend,
    change_percentage: Math.round(change * 10) / 10,
    confidence: 85
  };
};

/**
 * Analyze seasonal patterns
 * @return {Object}
 */
MarketAgent.prototype.analyzeSeasonalPatterns = function() {
  const month = new Date().getMonth() + 1;
  const patterns = {
    1: { pattern: 'pre_harvest_shortage', expected_change: '+15%' },
    2: { pattern: 'pre_harvest_shortage', expected_change: '+12%' },
    3: { pattern: 'pre_harvest_shortage', expected_change: '+10%' },
    4: { pattern: 'harvest_season', expected_change: '-20%' },
    5: { pattern: 'post_harvest_oversupply', expected_change: '-15%' },
    6: { pattern: 'post_harvest_oversupply', expected_change: '-10%' },
    7: { pattern: 'monsoon_uncertainty', expected_change: '+/-5%' },
    8: { pattern: 'monsoon_uncertainty', expected_change: '+/-5%' },
    9: { pattern: 'monsoon_uncertainty', expected_change: '+/-5%' },
    10: { pattern: 'recovery_period', expected_change: '+8%' },
    11: { pattern: 'recovery_period', expected_change: '+10%' },
    12: { pattern: 'pre_harvest_shortage', expected_change: '+12%' }
  };

  return patterns[month] || { pattern: 'unknown', expected_change: '0%' };
};

/**
 * Analyze regional price comparison
 * @return {Object}
 */
MarketAgent.prototype.analyzeRegionalComparison = function() {
  const regions = [
    { name: 'Lahore', price: 52, trend: 'stable' },
    { name: 'Karachi', price: 48, trend: 'decreasing' },
    { name: 'Islamabad', price: 55, trend: 'increasing' },
    { name: 'Faisalabad', price: 50, trend: 'stable' }
  ];

  const avgPrice = regions.reduce((sum, r) => sum + r.price, 0) / regions.length;

  return {
    regions: regions,
    average_price: Math.round(avgPrice),
    best_market: regions.reduce((best, current) => current.price > best.price ? current : best).name,
    price_variation: Math.round((Math.max(...regions.map(r => r.price)) - Math.min(...regions.map(r => r.price))) / avgPrice * 100)
  };
};

/**
 * Analyze local farmer competition
 * @return {Object}
 */
MarketAgent.prototype.analyzeLocalFarmers = function() {
  return {
    competitor_count: 15,
    avg_farm_size: 25, // acres
    avg_yield: 750, // kg/acre
    market_share: 8, // percentage
    competitive_advantage: 'early_harvest_timing'
  };
};

/**
 * Analyze wholesale market conditions
 * @return {Object}
 */
MarketAgent.prototype.analyzeWholesaleMarkets = function() {
  return {
    primary_markets: ['Lahore Grain Market', 'Karachi Wholesale Market'],
    avg_daily_volume: 500, // tons
    price_premium: 5, // percentage over farm gate
    demand_trend: 'stable'
  };
};

/**
 * Analyze export opportunities
 * @return {Object}
 */
MarketAgent.prototype.analyzeExportOpportunities = function() {
  return {
    export_potential: 'medium',
    target_markets: ['UAE', 'Saudi Arabia', 'Iran'],
    price_premium: 25, // percentage
    requirements: ['quality_certification', 'export_license'],
    competition: 'high'
  };
};

/**
 * Analyze price competition
 * @return {Object}
 */
MarketAgent.prototype.analyzePriceCompetition = function() {
  return {
    price_position: 'competitive',
    market_segment: 'mid_range',
    competitive_factors: ['quality', 'timing', 'location'],
    recommended_strategy: 'quality_differentiation'
  };
};

/**
 * Check if supply glut is expected
 * @return {boolean}
 */
MarketAgent.prototype.isSupplyGlutExpected = function() {
  const month = new Date().getMonth() + 1;
  return month >= 4 && month <= 6; // Harvest season
};

/**
 * Calculate overall risk score
 * @param {Array} risks
 * @return {number}
 */
MarketAgent.prototype.calculateRiskScore = function(risks) {
  const riskWeights = {
    'high': 30,
    'medium': 15,
    'low': 5
  };

  const totalRisk = risks.reduce((sum, risk) => sum + (riskWeights[risk.level] || 5), 0);
  return Math.min(100, totalRisk);
};

/**
 * Initialize crop data
 * @return {Object}
 */
MarketAgent.prototype.initializeCropData = function() {
  return {
    wheat: {
      basePrice: 50, // PKR per kg
      season: 'winter',
      demand: 'high',
      shelfLife: 365 // days
    },
    rice: {
      basePrice: 45,
      season: 'monsoon',
      demand: 'high',
      shelfLife: 270
    },
    cotton: {
      basePrice: 120, // per kg
      season: 'summer',
      demand: 'medium',
      shelfLife: 180
    }
  };
};

/**
 * Initialize market data
 * @return {Object}
 */
MarketAgent.prototype.initializeMarketData = function() {
  return {
    location: 'Lahore, Punjab',
    market_type: 'wholesale',
    trading_hours: '6:00-12:00',
    commission_rate: 2, // percentage
    transport_cost: 5 // PKR per kg
  };
};

/**
 * Initialize trend data
 * @return {Object}
 */
MarketAgent.prototype.initializeTrendData = function() {
  return {
    inflation_rate: 8.5, // percentage
    currency_trend: 'stable',
    global_demand: 'increasing',
    local_supply: 'adequate'
  };
};