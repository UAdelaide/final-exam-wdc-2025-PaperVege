// app.js
const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
const pool = require('./db');

app.use(express.json());
app.use('/api', apiRoutes);

const initData = async () => {
  try {
    await pool.query(`INSERT IGNORE INTO Users (user_id, username, email, password_hash, role)
                      VALUES (1, 'alice123', 'alice@example.com', 'hash1', 'owner'),
                             (2, 'carol123', 'carol@example.com', 'hash2', 'owner'),
                             (3, 'bobwalker', 'bob@example.com', 'hash3', 'walker'),
                             (4, 'newwalker', 'new@example.com', 'hash4', 'walker')`);

    await pool.query(`INSERT IGNORE INTO Dogs (dog_id, dog_name, size, owner_id)
                      VALUES (1, 'Max', 'medium', 1),
                             (2, 'Bella', 'small', 2)`);

    await pool.query(`INSERT IGNORE INTO WalkRequests (request_id, dog_id, requested_time, duration_minutes, location, status)
                      VALUES (1, 1, '2025-06-10 08:00:00', 30, 'Parklands', 'open')`);

    await pool.query(`INSERT IGNORE INTO Walks (walk_id, request_id, walker_id, status)
                      VALUES (1, 1, 3, 'completed')`);

    await pool.query(`INSERT IGNORE INTO Ratings (rating_id, walk_id, rating)
                      VALUES (1, 1, 4),
                             (2, 1, 5)`);

    console.log('The initial data has been inserted.');
  } catch (err) {
    console.error('The insertion of the initial data failed:', err);
  }
};

app.listen(3000, async () => {
  await initData();
  console.log('Dogs informations on http://localhost:3000/api/dogs');
  console.log('Walkrequests on http://localhost:3000/api/walkrequests/open');
  console.log('Walkers informations on http://localhost:3000/api/walkers/summary');
});
