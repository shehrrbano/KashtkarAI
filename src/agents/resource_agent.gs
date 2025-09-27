/**
 * Resource Agent for AgriSwarm
 * Manages water, fertilizer, and other resource allocation
 * Coordinates with other agents for optimal resource distribution
 *
 * @constructor
 */
function ResourceAgent() {
  this.driveManager = new DriveManager();
  this.sensorAgent = new SensorAgent();
  this.predictionAgent = new PredictionAgent();

  this.resources = {
    water: this.initializeWaterResource(),
    fertilizer: this.initializeFertilizerResource(),
    labor: this.initializeLaborResource()
  };

  this.allocationHistory = [];
}

/**
 * Allocate resources based on current conditions and predictions
 * @return {Object} Resource allocation plan
 */
ResourceAgent.prototype.allocateResources = function() {
  const currentData = this.sensorAgent.collectData();
  const predictions = this.predictionAgent.generatePredictions();

  const allocation = {
    water: this.allocateWater(currentData, predictions),
    fertilizer: this.allocateFertilizer(currentData, predictions),
    labor: this.allocateLabor(currentData, predictions),
    priority: this.determinePriority(currentData, predictions),
    timestamp: new Date().toISOString()
  };

  // Store allocation history
  this.storeAllocation(allocation);

  // Execute allocation if needed
  this.executeAllocation(allocation);

  return allocation;
};

/**
 * Allocate water resources
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {Object} Water allocation
 */
ResourceAgent.prototype.allocateWater = function(currentData, predictions) {
  const irrigation = predictions.irrigation;
  const baseAllocation = this.resources.water.available;

  let allocation = {
    amount: 0,
    timing: 'as_needed',
    zones: [],
    efficiency: 1.0
  };

  // Determine allocation based on urgency
  switch (irrigation.urgency) {
    case 'high':
      allocation.amount = baseAllocation * 0.8; // 80% of available
      allocation.timing = 'immediate';
      break;
    case 'medium':
      allocation.amount = baseAllocation * 0.5; // 50% of available
      allocation.timing = 'within_24h';
      break;
    default:
      allocation.amount = baseAllocation * 0.2; // 20% of available
      allocation.timing = 'scheduled';
  }

  // Adjust for crop stage
  const stageMultiplier = this.getCropStageWaterMultiplier(currentData.cropStage);
  allocation.amount *= stageMultiplier;

  // Zone allocation based on soil moisture
  allocation.zones = this.allocateWaterByZone(currentData);

  // Calculate efficiency
  allocation.efficiency = this.calculateWaterEfficiency(currentData, predictions);

  return allocation;
};

/**
 * Allocate fertilizer resources
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {Object} Fertilizer allocation
 */
ResourceAgent.prototype.allocateFertilizer = function(currentData, predictions) {
  const baseAllocation = this.resources.fertilizer.available;
  const cropStage = currentData.cropStage;

  let allocation = {
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    timing: 'scheduled',
    method: 'broadcast'
  };

  // Fertilizer requirements by crop stage
  switch (cropStage) {
    case 'planting':
      allocation.nitrogen = baseAllocation * 0.3;
      allocation.phosphorus = baseAllocation * 0.4;
      allocation.potassium = baseAllocation * 0.2;
      allocation.timing = 'pre_planting';
      break;

    case 'vegetative':
      allocation.nitrogen = baseAllocation * 0.5;
      allocation.phosphorus = baseAllocation * 0.2;
      allocation.potassium = baseAllocation * 0.3;
      allocation.timing = 'side_dress';
      break;

    case 'flowering':
      allocation.nitrogen = baseAllocation * 0.2;
      allocation.phosphorus = baseAllocation * 0.3;
      allocation.potassium = baseAllocation * 0.4;
      allocation.timing = 'flowering';
      break;

    default:
      allocation.nitrogen = baseAllocation * 0.1;
      allocation.phosphorus = baseAllocation * 0.1;
      allocation.potassium = baseAllocation * 0.1;
  }

  return allocation;
};

/**
 * Allocate labor resources
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {Object} Labor allocation
 */
ResourceAgent.prototype.allocateLabor = function(currentData, predictions) {
  const baseLabor = this.resources.labor.available;

  let allocation = {
    fieldwork: 0,
    irrigation: 0,
    pest_control: 0,
    harvest: 0,
    total: 0
  };

  // Base allocation by crop stage
  switch (currentData.cropStage) {
    case 'planting':
      allocation.fieldwork = baseLabor * 0.6;
      allocation.irrigation = baseLabor * 0.3;
      break;

    case 'vegetative':
      allocation.fieldwork = baseLabor * 0.4;
      allocation.irrigation = baseLabor * 0.4;
      allocation.pest_control = baseLabor * 0.2;
      break;

    case 'flowering':
      allocation.pest_control = baseLabor * 0.5;
      allocation.irrigation = baseLabor * 0.3;
      allocation.fieldwork = baseLabor * 0.2;
      break;

    case 'maturity':
    case 'harvest':
      allocation.harvest = baseLabor * 0.7;
      allocation.fieldwork = baseLabor * 0.2;
      allocation.pest_control = baseLabor * 0.1;
      break;

    default:
      allocation.fieldwork = baseLabor * 0.3;
      allocation.irrigation = baseLabor * 0.3;
      allocation.pest_control = baseLabor * 0.2;
      allocation.harvest = baseLabor * 0.2;
  }

  // Adjust based on predictions
  if (predictions.pestRisk.level === 'high') {
    allocation.pest_control += baseLabor * 0.2;
    allocation.fieldwork -= baseLabor * 0.1;
  }

  if (predictions.irrigation.urgency === 'high') {
    allocation.irrigation += baseLabor * 0.2;
    allocation.fieldwork -= baseLabor * 0.1;
  }

  allocation.total = allocation.fieldwork + allocation.irrigation +
                    allocation.pest_control + allocation.harvest;

  return allocation;
};

/**
 * Determine resource allocation priority
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {string} Priority level
 */
ResourceAgent.prototype.determinePriority = function(currentData, predictions) {
  // Emergency conditions get highest priority
  if (currentData.soilMoisture < 20) return 'critical';
  if (currentData.temperature > 35) return 'critical';
  if (predictions.pestRisk.level === 'high') return 'high';
  if (predictions.irrigation.urgency === 'high') return 'high';

  // Normal conditions
  if (predictions.irrigation.urgency === 'medium') return 'medium';
  if (currentData.cropStage === 'flowering') return 'medium';

  return 'normal';
};

/**
 * Allocate water by zones based on soil moisture
 * @param {Object} currentData
 * @return {Array} Zone allocations
 */
ResourceAgent.prototype.allocateWaterByZone = function(currentData) {
  const zones = [
    { name: 'Zone A', priority: 1 },
    { name: 'Zone B', priority: 2 },
    { name: 'Zone C', priority: 3 }
  ];

  // Adjust priorities based on conditions
  if (currentData.soilMoisture < 30) {
    zones[0].priority = 1; // Focus on driest areas first
  }

  return zones.sort((a, b) => a.priority - b.priority);
};

/**
 * Calculate water efficiency
 * @param {Object} currentData
 * @param {Object} predictions
 * @return {number} Efficiency score
 */
ResourceAgent.prototype.calculateWaterEfficiency = function(currentData, predictions) {
  let efficiency = 1.0;

  // Wind reduces efficiency
  if (currentData.windSpeed > 10) efficiency -= 0.2;

  // High temperature increases evaporation loss
  if (currentData.temperature > 30) efficiency -= 0.15;

  // Low humidity increases evaporation
  if (currentData.humidity < 40) efficiency -= 0.1;

  // Optimal timing bonus
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 10) efficiency += 0.1; // Morning irrigation is more efficient

  return Math.max(0.5, Math.min(1.2, efficiency));
};

/**
 * Store resource allocation for tracking
 * @param {Object} allocation
 */
ResourceAgent.prototype.storeAllocation = function(allocation) {
  this.allocationHistory.push(allocation);

  // Keep only last 100 allocations
  if (this.allocationHistory.length > 100) {
    this.allocationHistory = this.allocationHistory.slice(-100);
  }

  // Save to spreadsheet
  try {
    const data = {
      timestamp: allocation.timestamp,
      priority: allocation.priority,
      water_amount: allocation.water.amount,
      fertilizer_nitrogen: allocation.fertilizer.nitrogen,
      labor_total: allocation.labor.total
    };

    const sheetId = this.driveManager.saveSensorData(data, 'resource_allocation');
    Logger.log('Resource allocation stored');
  } catch (error) {
    Logger.log(`Error storing allocation: ${error.message}`);
  }
};

/**
 * Execute resource allocation
 * @param {Object} allocation
 */
ResourceAgent.prototype.executeAllocation = function(allocation) {
  try {
    // Send notifications for critical allocations
    if (allocation.priority === 'critical') {
      this.sendCriticalAlert(allocation);
    }

    // Log allocation execution
    Logger.log(`Executing allocation: ${JSON.stringify(allocation)}`);

    // In a real system, this would trigger IoT devices, send commands, etc.
    // For this demo, we just log the actions

  } catch (error) {
    Logger.log(`Error executing allocation: ${error.message}`);
  }
};

/**
 * Send critical allocation alert
 * @param {Object} allocation
 */
ResourceAgent.prototype.sendCriticalAlert = function(allocation) {
  const subject = `Critical Resource Allocation Required - ${allocation.priority.toUpperCase()}`;
  const body = `
Critical resource allocation needed:

Priority: ${allocation.priority}
Timestamp: ${allocation.timestamp}

Water Allocation:
- Amount: ${Math.round(allocation.water.amount)} liters
- Timing: ${allocation.water.timing}
- Zones: ${allocation.water.zones.map(z => z.name).join(', ')}

Fertilizer Allocation:
- Nitrogen: ${Math.round(allocation.fertilizer.nitrogen)} kg
- Phosphorus: ${Math.round(allocation.fertilizer.phosphorus)} kg
- Potassium: ${Math.round(allocation.fertilizer.potassium)} kg

Labor Allocation:
- Total workers needed: ${Math.round(allocation.labor.total)}
- Fieldwork: ${Math.round(allocation.labor.fieldwork)}
- Irrigation: ${Math.round(allocation.labor.irrigation)}
- Pest Control: ${Math.round(allocation.labor.pest_control)}

Please take immediate action.
  `;

  try {
    GmailApp.sendEmail('shehrbanoxgirlx@gmail.com', subject, body);
    Logger.log('Critical allocation alert sent');
  } catch (error) {
    Logger.log(`Error sending critical alert: ${error.message}`);
  }
};

/**
 * Get water requirement multiplier by crop stage
 * @param {string} stage
 * @return {number}
 */
ResourceAgent.prototype.getCropStageWaterMultiplier = function(stage) {
  const multipliers = {
    'planting': 1.2,
    'germination': 1.4,
    'vegetative': 1.0,
    'flowering': 1.3,
    'maturity': 0.8,
    'harvest': 0.6
  };

  return multipliers[stage] || 1.0;
};

/**
 * Initialize water resource data
 * @return {Object}
 */
ResourceAgent.prototype.initializeWaterResource = function() {
  return {
    available: 10000, // liters
    sources: ['well', 'canal', 'rainwater'],
    cost_per_liter: 0.5, // PKR
    quality: 'good'
  };
};

/**
 * Initialize fertilizer resource data
 * @return {Object}
 */
ResourceAgent.prototype.initializeFertilizerResource = function() {
  return {
    available: 500, // kg
    types: ['urea', 'dap', 'potash'],
    cost_per_kg: 80, // PKR
    expiry_date: '2024-12-31'
  };
};

/**
 * Initialize labor resource data
 * @return {Object}
 */
ResourceAgent.prototype.initializeLaborResource = function() {
  return {
    available: 10, // workers
    skilled: 3,
    cost_per_day: 1000, // PKR
    availability: 'full_time'
  };
};

/**
 * Get resource utilization report
 * @return {Object} Utilization report
 */
ResourceAgent.prototype.getUtilizationReport = function() {
  const recentAllocations = this.allocationHistory.slice(-7); // Last 7 days

  const report = {
    water_utilization: this.calculateResourceUtilization(recentAllocations, 'water'),
    fertilizer_utilization: this.calculateResourceUtilization(recentAllocations, 'fertilizer'),
    labor_utilization: this.calculateResourceUtilization(recentAllocations, 'labor'),
    efficiency_trends: this.calculateEfficiencyTrends(recentAllocations),
    recommendations: this.generateResourceRecommendations(recentAllocations)
  };

  return report;
};

/**
 * Calculate resource utilization
 * @param {Array} allocations
 * @param {string} resourceType
 * @return {Object}
 */
ResourceAgent.prototype.calculateResourceUtilization = function(allocations, resourceType) {
  if (allocations.length === 0) return { used: 0, available: 100, percentage: 0 };

  const totalUsed = allocations.reduce((sum, alloc) => {
    switch (resourceType) {
      case 'water': return sum + alloc.water.amount;
      case 'fertilizer': return sum + (alloc.fertilizer.nitrogen + alloc.fertilizer.phosphorus + alloc.fertilizer.potassium);
      case 'labor': return sum + alloc.labor.total;
      default: return sum;
    }
  }, 0);

  const available = resourceType === 'water' ? this.resources.water.available :
                   resourceType === 'fertilizer' ? this.resources.fertilizer.available :
                   this.resources.labor.available;

  const percentage = Math.round((totalUsed / available) * 100);

  return {
    used: Math.round(totalUsed),
    available: available,
    percentage: percentage
  };
};

/**
 * Calculate efficiency trends
 * @param {Array} allocations
 * @return {Object}
 */
ResourceAgent.prototype.calculateEfficiencyTrends = function(allocations) {
  if (allocations.length < 2) return { trend: 'insufficient_data' };

  const recent = allocations.slice(-3);
  const previous = allocations.slice(-6, -3);

  const recentAvg = recent.reduce((sum, alloc) => sum + alloc.water.efficiency, 0) / recent.length;
  const previousAvg = previous.reduce((sum, alloc) => sum + alloc.water.efficiency, 0) / previous.length;

  const trend = recentAvg > previousAvg ? 'improving' : recentAvg < previousAvg ? 'declining' : 'stable';

  return {
    trend: trend,
    current: Math.round(recentAvg * 100),
    previous: Math.round(previousAvg * 100)
  };
};

/**
 * Generate resource recommendations
 * @param {Array} allocations
 * @return {Array}
 */
ResourceAgent.prototype.generateResourceRecommendations = function(allocations) {
  const recommendations = [];

  const waterUtil = this.calculateResourceUtilization(allocations, 'water');
  const laborUtil = this.calculateResourceUtilization(allocations, 'labor');

  if (waterUtil.percentage > 80) {
    recommendations.push('Consider water conservation measures');
  }

  if (laborUtil.percentage > 90) {
    recommendations.push('Consider hiring additional labor');
  }

  if (waterUtil.percentage < 30) {
    recommendations.push('Water resources are underutilized - check irrigation system');
  }

  return recommendations;
};