const { inMemoryGreetings } = require('../data/greetings');
const { poolPromise } = require('../database/db');
const { trackException, trackEvent } = require('../insights/customInsights');


const getAllGreetings = async (req, res) => {

  try {

    if(process.env.USE_DB === 'true') {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM [greetings]');
      res.json(result.recordset);
    } else {
      res.json(inMemoryGreetings);
    }

    trackEvent('Endpoint called - /api/greetings', {
      function: 'getAllGreetings',
      endpoint: `localhost:8080/api/greetings`
    });
   
  } catch (error) {
    console.error('Error fetching greetings:', error.message);

    trackException(error, {
      endpoint: `api/greetings`
    });

    res.status(500).json({ error: 'Failed to fetch greetings' });
  }
};


module.exports = { getAllGreetings };