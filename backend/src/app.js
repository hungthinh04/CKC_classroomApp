const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const baivietRoutes = require('./routes/baiviet');


const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors({
  origin: '*',
  exposedHeaders: ['Content-Range'],
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', baivietRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
