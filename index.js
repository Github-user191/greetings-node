require('dotenv').config();


const express = require('express');
const cors = require('cors');
const { getAllGreetings } = require('./controllers/greetingsController');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


app.get('/api/greetings', getAllGreetings);
app.get('/', getAllGreetings);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});