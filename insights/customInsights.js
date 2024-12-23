const { initializeAppInsights } = require("./appInsights");

const client = initializeAppInsights();

const trackEvent = (name, properties = {}) => {
    if (client) {
      client.trackEvent({ 
        name: name, 
        properties: {
            ...properties,
            timestamp: new Date().toISOString()
        },
      });
    }
  };
  

const trackException = (exception, properties = {}) => {
  if (client) {
    client.trackException({ 
        exception: exception,
        properties: {
            ...properties,
            timestamp: new Date().toISOString()
        }
    });
  }
};

const trackRequest = (name, url, duration, success = true, properties = {}) => {
  if (client) {
    client.trackRequest({ 
      name,
      url, 
      duration, 
      resultCode: success ? 200 : 400,
      success,
      properties
    });
  }
};

module.exports = {
  trackException,
  trackEvent,
  trackRequest
};
