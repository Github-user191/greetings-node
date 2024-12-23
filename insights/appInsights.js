const appInsights = require('applicationinsights');

const initializeAppInsights = () => {
  try {
    appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .start();
    
    return appInsights.defaultClient;
  } catch (error) {
    console.error('Failed to initialize Application Insights:', error);
    return null;
  }
};

module.exports = {
  initializeAppInsights
};
