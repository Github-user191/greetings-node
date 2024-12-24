const sql = require('mssql');
const { trackException } = require('../insights/customInsights');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustedConnection: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  }
};

let poolPromise;

const getPoolPromise = () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log('Connected to MSSQL');
        return pool;
      })
      .catch((error) => {
        console.error('Database Connection Failed:', error.message);

        trackException(error, {
          
        });
      });
  }
  return poolPromise;
};


// Seed the database
const seedDatabase = async () => {
  try {
    const pool = await getPoolPromise();

    // Create the database if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'greetings')
      CREATE DATABASE greetings;
    `);
    
    console.log('Database created or already exists.');

    // Reconfigure to use the greetings database
    config.database = process.env.DB_NAME;
    const newPool = await new sql.ConnectionPool(config).connect();

    // Create the Greetings table if it doesn't exist
    await newPool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='greetings' AND xtype='U')
      CREATE TABLE greetings (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        Language NVARCHAR(250) NOT NULL UNIQUE,
        Greeting NVARCHAR(250) NOT NULL
      );
    `);

    console.log('Table created or already exists.');

    const result = await newPool.request().query('SELECT COUNT(*) AS count FROM greetings');

    if (result.recordset[0].count === 0) {
      const insertQuery = `
        INSERT INTO greetings (Language, Greeting) VALUES 
        (N'English', N'Hello'),
        (N'Spanish', N'Hola'),
        (N'French', N'Bonjour'),
        (N'German', N'Hallo'),
        (N'Italian', N'Ciao'),
        (N'Japanese', N'こんにちは'),
        (N'Chinese', N'你好'),
        (N'Hindi', N'नमस्ते'),
        (N'Russian', N'Привет'),
        (N'Portuguese', N'Olá'),
        (N'Arabic', N'أهلاً'),
        (N'Korean', N'안녕하세요'),
        (N'Dutch', N'Hallo'),
        (N'Swedish', N'Hej'),
        (N'Turkish', N'Merhaba');
      `;
    
      await newPool.request().query(insertQuery);

      console.log('Sample data inserted into Greetings table.');
    }
  } catch (err) {
    console.error('Error seeding the database:', err.message);
  }
};

if(process.env.USE_DB === 'true') {
  seedDatabase();
}


module.exports = { sql, poolPromise };