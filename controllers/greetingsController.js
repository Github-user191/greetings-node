const { inMemoryGreetings } = require('../data/greetings');
const { poolPromise } = require('../database/db');


const getAllGreetings = async (req, res) => {
  try {
    if(process.env.USE_DB === 'true') {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM [greetings].[dbo].[greetings]');
      res.json(result.recordset);
    } else {
      res.json(inMemoryGreetings);
    }
   
  } catch (err) {
    console.error('Error fetching greetings:', err.message);
    res.status(500).json({ error: 'Failed to fetch greetings' });
  }
};


module.exports = { getAllGreetings };
