# AgriSwarm Runbook - Operations Manual

## Quick Start Guide

### 1. System Access
- **Google Apps Script**: https://script.google.com
- **Project ID**: agricompetition
- **Admin Email**: shehrbanoxgirlx@gmail.com
- **Web App URL**: [Deployed URL after deployment]

### 2. Daily Operations
```javascript
// Run full workflow
runAgriSwarmWorkflow()

// Check system status
doGet({parameter: {action: 'status'}})

// Get sensor data
doGet({parameter: {action: 'sensor'}})
```

### 3. Manual Testing
```javascript
// Run all tests
runAllTests()

// Run smoke tests
runSmokeTests()

// Test individual components
testSensorAgent()
testPredictionAgent()
testResourceAgent()
testMarketAgent()
```

## System Architecture

### Agent Responsibilities
- **Sensor Agent**: Collects environmental data, monitors crop conditions
- **Prediction Agent**: Forecasts yields, pest risks, irrigation needs
- **Resource Agent**: Manages water, fertilizer, labor allocation
- **Market Agent**: Provides price predictions, selling recommendations

### Data Flow
1. Sensor Agent collects environmental data
2. Prediction Agent analyzes data and generates forecasts
3. Resource Agent allocates resources based on predictions
4. Market Agent provides selling recommendations
5. All data stored in Google Drive
6. Alerts sent via Gmail

## Deployment Procedures

### Initial Deployment
1. Copy all `.gs` files to Google Apps Script project
2. Configure `appsscript.json` with project settings
3. Deploy as Web App with "Anyone" access
4. Set up time-based triggers for daily execution

### Version Updates
1. Update code in Apps Script editor
2. Test changes using manual functions
3. Create new deployment version
4. Update web app URL if needed

## Monitoring and Alerting

### Key Metrics to Monitor
- **Execution Success Rate**: Should be >95%
- **Data Storage Growth**: Monitor Drive usage
- **Alert Frequency**: Track system health
- **Prediction Accuracy**: Review forecast quality

### Alert Response Procedures
1. **Critical Alerts** (Immediate response required)
   - System errors or failures
   - Critical resource shortages
   - Extreme sensor readings

2. **Warning Alerts** (Review within 24 hours)
   - High resource utilization
   - Moderate pest risk
   - Unusual sensor patterns

3. **Info Alerts** (Weekly review)
   - Daily summary reports
   - System maintenance reminders

### Troubleshooting Common Issues

#### Apps Script Quota Exceeded
- **Symptoms**: Functions fail with quota error
- **Solution**: Optimize code, reduce API calls, wait for quota reset
- **Prevention**: Monitor quota usage, implement batch operations

#### Drive Storage Issues
- **Symptoms**: Cannot save data files
- **Solution**: Archive old data, increase storage if needed
- **Prevention**: Automated archiving, storage monitoring

#### Gmail Sending Failures
- **Symptoms**: Alerts not received
- **Solution**: Check Gmail quota, verify email settings
- **Prevention**: Monitor sending success, implement retry logic

## Maintenance Procedures

### Daily Maintenance
- Review execution logs in Apps Script dashboard
- Check for failed executions
- Verify data files are being created
- Review system-generated alerts

### Weekly Maintenance
- Run comprehensive test suite
- Review performance metrics
- Analyze prediction accuracy
- Check resource utilization trends
- Archive old data files

### Monthly Maintenance
- Full system backup
- Performance optimization review
- Security configuration audit
- User feedback collection
- Plan system improvements

## API Reference

### Web App Endpoints
```
GET /?action=status          # System status
GET /?action=run            # Run full workflow
GET /?action=sensor         # Get sensor data
GET /?action=predictions    # Get predictions
GET /?action=resources      # Get resource allocation
GET /?action=market         # Get market analysis
```

### Manual Functions
```javascript
// Core workflow
runAgriSwarmWorkflow()      # Main workflow execution

// Individual agents
testSensorAgent()          # Test sensor functionality
testPredictionAgent()      # Test prediction engine
testResourceAgent()        # Test resource allocation
testMarketAgent()          # Test market analysis

// System management
initializeAgriSwarm()      # Initialize all components
runAllTests()             # Run complete test suite
runSmokeTests()           # Run scenario tests
```

## Performance Optimization

### Code Optimization
- Use batch operations for Drive/Sheets APIs
- Implement caching for frequently accessed data
- Minimize API calls in loops
- Use exponential backoff for retries

### Data Management
- Regular archiving of old data
- Compression of large datasets
- Partitioning of time-series data
- Cleanup of temporary files

### Resource Management
- Monitor Apps Script quotas
- Optimize memory usage
- Implement efficient algorithms
- Use appropriate data structures

## Security Considerations

### Access Control
- Service account permissions
- Web app access settings
- Drive folder permissions
- Gmail notification settings

### Data Protection
- Encryption at rest (Google Drive)
- Secure API communications
- Access logging and auditing
- Regular security reviews

## Support and Contact

### Primary Contact
- **Email**: shehrbanoxgirlx@gmail.com
- **Project**: agricompetition
- **Region**: us-central1

### Documentation
- **README.md**: Project overview and setup
- **CITATIONS.md**: Google services references
- **handover.json**: Complete project handover
- **Plan.JSON**: Original project plan

### Emergency Procedures
1. Check Apps Script execution logs
2. Verify Google Drive connectivity
3. Test individual components
4. Review recent changes
5. Contact support if needed

## Future Enhancements

### Phase 2 Features
- IoT sensor integration
- Machine learning predictions
- Mobile application
- Advanced analytics

### Scalability Improvements
- Multi-farm management
- Advanced weather integration
- Supply chain optimization
- Financial reporting

---

*This runbook was generated as part of the AgriSwarm project completion*
*Last updated: 2025-09-27*