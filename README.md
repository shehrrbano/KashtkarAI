# AgriSwarm - Autonomous Multi-Agent System for AgriTech Pakistan

## Overview
AgriSwarm is an autonomous multi-agent swarm system designed for agricultural optimization in Pakistan. Using free Google services as an alternative to Vertex AI, this system enables intelligent crop optimization, precision irrigation, and advisory services through agent-to-agent collaboration.

## Architecture
- **Sensor Agent**: Monitors crop health and environmental data using Google Sheets
- **Prediction Agent**: Forecasts crop yields and pest risks using Google Apps Script logic
- **Resource Agent**: Manages water and resource allocation through automated workflows
- **Market Agent**: Provides market recommendations and pricing information

## Technology Stack (Free Tier)
- **Google Apps Script**: Core agent orchestration and business logic
- **Google Drive**: Data storage and file management
- **Google Sheets**: Data processing and analysis
- **Gmail**: Notifications and alerts
- **Google Cloud Functions**: Optional serverless functions (free tier)

## Project Structure
```
src/
├── agents/          # Agent implementations
│   ├── sensor.gs    # Environmental monitoring
│   ├── prediction.gs # Yield forecasting
│   ├── resource.gs  # Resource allocation
│   └── market.gs    # Market intelligence
├── storage/         # Data management
├── utils/           # Helper functions
tests/               # Test cases
docs/                # Documentation
```

## Setup Instructions

### 1. Google Cloud Project Setup
Run the provided `project_setup.sh` script:
```bash
chmod +x project_setup.sh
./project_setup.sh
```

### 2. Google Apps Script Setup
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the contents of `appsscript.json` to your project settings
4. Upload all `.gs` files from the `src/` directory

### 3. Google Drive Integration
1. Create the following folders in Google Drive:
   - `AgriSwarm-Data/`
   - `AgriSwarm-Reports/`
   - `AgriSwarm-Archive/`

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