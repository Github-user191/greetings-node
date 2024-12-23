const { inMemoryGreetings } = require('../data/greetings');
const { poolPromise } = require('../database/db');
const { trackException, trackEvent } = require('../insights/customInsights');


const getAllGreetings = async (req, res) => {

  console.log("CONN STRING ", process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)

  console.log("USE_DB ", process.env.USE_DB)
  try {
    if(process.env.USE_DB === 'true') {

      console.log("GETTING ALL GREETINGS with DB")
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM [greetings].[dbo].[greetings]');
      res.json(result.recordset);
    } else {
      console.log("GETTING ALL GREETINGS with IN MEM")

      res.json(inMemoryGreetings);
    }

    // trackEvent('Endpoint called - /api/greetings', {
    //   source: 'getAllGreetings',
    //   endpoint: `${hostname}/api/greetings`
    // });
   
  } catch (error) {
    console.error('Error fetching greetings:', error.message);

    // trackException(error, {
    //   source: 'getAllGreetings',
    //   endpoint: `${hostname}/api/greetings`
    // });

    res.status(500).json({ error: 'Failed to fetch greetings' });
  }
};




module.exports = { getAllGreetings };