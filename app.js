require('dotenv').config();
// Creating a simple running server
const express = require('express');
require('./config/config.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuring the user.js file so that it can be part of the API
app.use('/api', require('./routes/user.js')); // Use a specific prefix for better organization

// Catch-all handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).send('Endpoint not found');
});

// Port configuration with fallback
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});
