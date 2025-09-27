/**
 * Sensor Agent for AgriSwarm
 * Collects environmental and crop health data
 * Uses Google Sheets for data storage and basic analysis
 *
 * @constructor
 */
function SensorAgent() {
  this.driveManager = new DriveManager();
  this.dataSheetId = null;
  this.alertThresholds = {
    temperature: { min: 10, max: 35 },
    humidity: { min: 40, max: 80 },
    soilMoisture: { min: 30, max: 70 }
  };
}

/**
 * Collect sensor data from various sources
 * @return {Object} Sensor data object
 */
SensorAgent.prototype.collectData = function() {
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
};

/**
 * Get temperature reading (simulated)
 * @return {number} Temperature in Celsius
 */
SensorAgent.prototype.getTemperature = function() {
  // Simulate temperature data (normally from IoT sensors)
  const baseTemp = 25; // Base temperature for Pakistan climate
  const variation = (Math.random() - 0.5) * 10; // ±5°C variation
  const seasonal = this.getSeasonalAdjustment();
  return Math.round((baseTemp + variation + seasonal) * 10) / 10;
};

/**
 * Get humidity reading (simulated)
 * @return {number} Humidity percentage
 */
SensorAgent.prototype.getHumidity = function() {
  const baseHumidity = 60;
  const variation = (Math.random() - 0.5) * 20;
  return Math.round(Math.max(0, Math.min(100, baseHumidity + variation)));
};

/**
 * Get soil moisture reading (simulated)
 * @return {number} Soil moisture percentage
 */
SensorAgent.prototype.getSoilMoisture = function() {
  const baseMoisture = 50;
  const variation = (Math.random() - 0.5) * 30;
  return Math.round(Math.max(0, Math.min(100, baseMoisture + variation)));
};

/**
 * Get rainfall data (simulated)
 * @return {number} Rainfall in mm
 */
SensorAgent.prototype.getRainfall = function() {
  // Simulate rainfall (more likely in monsoon season)
  const isMonsoon = this.isMonsoonSeason();
  const rainfall = isMonsoon ? Math.random() * 20 : Math.random() * 2;
  return Math.round(rainfall * 10) / 10;
};

/**
 * Get wind speed (simulated)
 * @return {number} Wind speed in km/h
 */
SensorAgent.prototype.getWindSpeed = function() {
  const baseSpeed = 5;
  const variation = Math.random() * 15;
  return Math.round((baseSpeed + variation) * 10) / 10;
};

/**
 * Get solar radiation (simulated)
 * @return {number} Solar radiation in W/m²
 */
SensorAgent.prototype.getSolarRadiation = function() {
  const timeOfDay = new Date().getHours();
  const baseRadiation = this.getSolarRadiationByTime(timeOfDay);
  const variation = (Math.random() - 0.5) * 200;
  return Math.round(Math.max(0, baseRadiation + variation));
};

/**
 * Get crop growth stage
 * @return {string} Crop stage
 */
SensorAgent.prototype.getCropStage = function() {
  // Simplified crop stage detection
  const dayOfYear = this.getDayOfYear();
  const stages = ['planting', 'germination', 'vegetative', 'flowering', 'maturity', 'harvest'];
  const stageIndex = Math.floor((dayOfYear % 180) / 30); // 6 stages over 180 days
  return stages[stageIndex] || 'unknown';
};

/**
 * Get location data
 * @return {Object} Location object
 */
SensorAgent.prototype.getLocation = function() {
  // Default location for Pakistan agricultural area
  return {
    latitude: 31.5204,
    longitude: 74.3587,
    region: 'Punjab',
    district: 'Lahore'
  };
};

/**
 * Store collected data
 * @param {Object} data
 * @param {Date} timestamp
 */
SensorAgent.prototype.storeData = function(data, timestamp) {
  try {
    if (!this.dataSheetId) {
      this.dataSheetId = this.driveManager.saveSensorData(data, 'sensor_data');
    } else {
      const sheet = SpreadsheetApp.openById(this.dataSheetId);
      this.driveManager.appendDataToSheet(sheet, data, timestamp.toISOString());
    }

    Logger.log(`Sensor data stored: ${JSON.stringify(data)}`);
  } catch (error) {
    Logger.log(`Error storing sensor data: ${error.message}`);
  }
};

/**
 * Check for alert conditions
 * @param {Object} data
 */
SensorAgent.prototype.checkAlerts = function(data) {
  const alerts = [];

  // Temperature alerts
  if (data.temperature < this.alertThresholds.temperature.min) {
    alerts.push(`Low temperature alert: ${data.temperature}°C`);
  }
  if (data.temperature > this.alertThresholds.temperature.max) {
    alerts.push(`High temperature alert: ${data.temperature}°C`);
  }

  // Humidity alerts
  if (data.humidity < this.alertThresholds.humidity.min) {
    alerts.push(`Low humidity alert: ${data.humidity}%`);
  }
  if (data.humidity > this.alertThresholds.humidity.max) {
    alerts.push(`High humidity alert: ${data.humidity}%`);
  }

  // Soil moisture alerts
  if (data.soilMoisture < this.alertThresholds.soilMoisture.min) {
    alerts.push(`Low soil moisture alert: ${data.soilMoisture}%`);
  }
  if (data.soilMoisture > this.alertThresholds.soilMoisture.max) {
    alerts.push(`High soil moisture alert: ${data.soilMoisture}%`);
  }

  // Send alerts if any
  if (alerts.length > 0) {
    this.sendAlerts(alerts, data);
  }
};

/**
 * Send alert notifications
 * @param {Array} alerts
 * @param {Object} data
 */
SensorAgent.prototype.sendAlerts = function(alerts, data) {
  const subject = `AgriSwarm Alert: ${alerts.length} sensor alert(s)`;
  const body = `
AgriSwarm Sensor Alerts:
Location: ${data.location.region}, ${data.location.district}
Timestamp: ${new Date().toISOString()}

Alerts:
${alerts.join('\n')}

Current Readings:
- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Soil Moisture: ${data.soilMoisture}%
- Rainfall: ${data.rainfall}mm
- Wind Speed: ${data.windSpeed} km/h

Please check your crops and irrigation system.
  `;

  try {
    GmailApp.sendEmail('shehrbanoxgirlx@gmail.com', subject, body);
    Logger.log(`Alerts sent: ${alerts.length} alerts`);
  } catch (error) {
    Logger.log(`Error sending alerts: ${error.message}`);
  }
};

/**
 * Get seasonal temperature adjustment
 * @return {number} Seasonal adjustment in °C
 */
SensorAgent.prototype.getSeasonalAdjustment = function() {
  const month = new Date().getMonth() + 1; // 1-12

  // Pakistan seasons: Winter (Dec-Feb), Spring (Mar-May), Summer (Jun-Aug), Monsoon (Sep-Nov)
  if (month >= 3 && month <= 5) return 5;      // Spring
  if (month >= 6 && month <= 8) return 10;     // Summer
  if (month >= 9 && month <= 11) return 3;     // Monsoon
  return -2; // Winter
};

/**
 * Check if it's monsoon season
 * @return {boolean}
 */
SensorAgent.prototype.isMonsoonSeason = function() {
  const month = new Date().getMonth() + 1;
  return month >= 7 && month <= 9; // July-September
};

/**
 * Get solar radiation based on time of day
 * @param {number} hour
 * @return {number}
 */
SensorAgent.prototype.getSolarRadiationByTime = function(hour) {
  if (hour < 6 || hour > 18) return 0;        // Night
  if (hour >= 6 && hour < 12) return 400 + (hour - 6) * 100;  // Morning
  if (hour >= 12 && hour < 15) return 800;    // Peak
  return 800 - (hour - 15) * 200;            // Afternoon
};

/**
 * Get day of year
 * @return {number}
 */
SensorAgent.prototype.getDayOfYear = function() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Get historical data for analysis
 * @param {number} days
 * @return {Array} Historical data
 */
SensorAgent.prototype.getHistoricalData = function(days) {
  try {
    if (!this.dataSheetId) return [];

    const sheet = SpreadsheetApp.openById(this.dataSheetId);
    const lastRow = sheet.getLastRow();
    const startRow = Math.max(2, lastRow - days + 1); // +1 for header row

    const range = sheet.getRange(startRow, 1, days, 8); // 8 columns of data
    const values = range.getValues();

    return values.map(row => ({
      timestamp: row[0],
      temperature: parseFloat(row[1]),
      humidity: parseFloat(row[2]),
      soilMoisture: parseFloat(row[3]),
      rainfall: parseFloat(row[4]),
      windSpeed: parseFloat(row[5]),
      solarRadiation: parseFloat(row[6]),
      cropStage: row[7]
    }));
  } catch (error) {
    Logger.log(`Error getting historical data: ${error.message}`);
    return [];
  }
};