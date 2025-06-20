const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'can not get dogs information' });
  }
});

router.get('/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        wr.request_id,
        d.name AS dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'can not get dog requests information' });
  }
});

router.get('/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.username AS walker_username,
        COUNT(wr.rating_id) AS total_ratings,
        ROUND(AVG(wr.rating), 1) AS average_rating,
        COUNT(DISTINCT wa.request_id) AS completed_walks
      FROM Users u
      LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id
      LEFT JOIN WalkRequests rq ON wa.request_id = rq.request_id AND rq.status = 'accepted'
      LEFT JOIN WalkRatings wr ON wr.walker_id = u.user_id AND wr.request_id = wa.request_id
      WHERE u.role = 'walker'
      GROUP BY u.username
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'can not get walkers information' });
  }
});

module.exports = router;
