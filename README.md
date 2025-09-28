# Kashtkar.ai - AI-Powered Agricultural Intelligence Platform

## Overview
Kashtkar.ai is an intelligent agricultural platform designed for farmers in Pakistan. Using advanced AI and free Google services, this system enables intelligent crop optimization, precision farming, and comprehensive agricultural advisory services through multi-agent collaboration.

## Architecture
- **Sensor Agent**: Monitors crop health and environmental data using Google Sheets
- **Prediction Agent**: Forecasts crop yields and pest risks using AI algorithms
- **Resource Agent**: Manages water and resource allocation through automated workflows
- **Market Agent**: Provides market recommendations and pricing information

## Technology Stack (Free Tier)
- **Google Apps Script**: Core agent orchestration and business logic
- **Google Drive**: Data storage and file management
- **Google Sheets**: Data processing and analysis
- **Gmail**: Notifications and alerts
- **Google AI Studio**: AI-powered location detection and analysis
- **Google Maps**: Interactive mapping and location services

## Project Structure
```
kashtkar.ai/
├── frontend.html          # Main dashboard
├── login.html             # Authentication (Login)
├── signup.html            # Authentication (Signup)
├── backend/
│   └── server.js          # Node.js backend server
├── start_kashtkar.bat     # Windows startup script
├── start_kashtkar.sh      # Linux/Mac startup script
└── README.md              # This file
```

## Setup Instructions

### 1. Environment Setup
1. **Install Node.js** (for backend server)
2. **Install Python** (for frontend server)
3. **Get API Keys**:
   - Google Maps API key
   - Google AI Studio API key

### 2. Start the Application
```bash
# On Windows
start_kashtkar.bat

# On Linux/Mac
chmod +x start_kashtkar.sh
./start_kashtkar.sh
```

### 3. Manual Start (Alternative)
```bash
# Terminal 1 - Start Backend (Port 8080)
cd backend && npm start

# Terminal 2 - Start Frontend (Port 8081)
python -m http.server 8081
```

### 4. Enable APIs
Ensure these Google services are enabled in your project:
- Google Drive API
- Google Sheets API
- Gmail API
- Google Apps Script API

## Agent Descriptions

### Sensor Agent
- Collects environmental data (temperature, humidity, soil moisture)
- Integrates with Google Sheets for data logging
- Triggers alerts based on threshold conditions

### Prediction Agent
- Analyzes historical data patterns
- Forecasts crop yields and pest risks
- Uses rule-based algorithms for decision making

### Resource Agent
- Optimizes irrigation schedules
- Manages resource allocation
- Coordinates with other agents for optimal decisions

### Market Agent
- Provides market price information
- Recommends optimal selling times
- Analyzes market trends

## Development

### Local Testing
```javascript
// Test individual agents
function testSensorAgent() {
  const sensor = new SensorAgent();
  const data = sensor.collectData();
  Logger.log(data);
}
```

### Deployment
1. Publish your Apps Script as a web app
2. Set access to "Anyone" for public access
3. Use the provided web app URL for API calls

## Monitoring
- Google Apps Script execution logs
- Google Drive file access tracking
- Gmail notification history
- Google Cloud Monitoring (if upgraded)

## Cost Structure
- **Free Tier**: Google Apps Script quota (6 min/day execution time)
- **Google Workspace**: Extended quotas and features
- **Cloud Functions**: Optional serverless functions (2M free invocations/month)

## Security
- Service account authentication
- API key management through Google Cloud Secret Manager
- OAuth 2.0 for user authentication
- Data encryption at rest in Google Drive

## Support
For issues and questions:
- Check Google Apps Script quotas and limitations
- Review execution logs in the Apps Script dashboard
- Monitor Google Cloud project usage

## License
This project uses Google services under their respective terms of service.