// backend/app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('database.sqlite');

// Sign Up Route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
    if (err) {
      return res.status(500).send('Error signing up');
    }
    res.status(201).send('User created');
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      return res.status(401).send('User not found');
    }

    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Package Damage Detection Route (Placeholder)
app.post('/detect-damage', (req, res) => {
  // Implement your image upload and damage detection logic here
  res.send({ message: 'Detection result' });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000/');
});
