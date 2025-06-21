const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(session({
  name: 'dogwalk.sid', 
  secret: process.env.SESSION_SECRET || 'keyboard-cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 2 
  }
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/userRoutes');
const walkRoutes = require('./routes/walkRoutes');
const dogRoutes = require('./routes/dogRoutes');

app.use('/api/users', userRoutes);
app.use('/api/walks', walkRoutes);
app.use('/dogs', dogRoutes);

module.exports = app;