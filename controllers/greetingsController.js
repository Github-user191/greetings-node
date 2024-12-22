const { poolPromise } = require('../database/db');

const getAllGreetings = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [greetings].[dbo].[greetings]');
    res.json(result.recordset);
   
  } catch (err) {
    console.error('Error fetching greetings:', err.message);
    res.status(500).json({ error: 'Failed to fetch greetings' });
  }
};


module.exports = { getAllGreetings };
