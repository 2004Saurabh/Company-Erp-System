import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all performance reviews
router.get('/', async (req, res) => {
  try {
    const list = await query('SELECT * FROM performance_reviews ORDER BY date DESC, id DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add performance review
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `PRF-${Date.now().toString().slice(-4)}`;
    const today = '2026-10-01';

    await execute(
      `INSERT INTO performance_reviews (id, employeeId, employeeName, reviewer, reviewPeriod, rating, feedback, goals, date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Reviewed')`,
      [
        newId,
        data.employeeId || 'EMP-1004',
        data.employeeName || 'Elena Rostova',
        data.reviewer || 'Marcus Sterling',
        data.reviewPeriod || 'Q3 2026',
        Number(data.rating) || 4.5,
        data.feedback || 'Outstanding work and dedication.',
        data.goals || 'Lead the upcoming microservices architecture migration.',
        data.date || today
      ]
    );

    const created = await getOne('SELECT * FROM performance_reviews WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
