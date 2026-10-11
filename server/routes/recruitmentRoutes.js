import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all job openings
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await query('SELECT * FROM job_openings ORDER BY postedDate DESC');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add job opening
router.post('/jobs', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `JOB-${Date.now().toString().slice(-4)}`;
    const today = '2026-10-01';

    await execute(
      `INSERT INTO job_openings (id, title, department, location, type, experience, applicantsCount, status, salaryRange, postedDate)
       VALUES (?, ?, ?, ?, ?, ?, 0, 'Open', ?, ?)`,
      [
        newId,
        data.title,
        data.department || 'Engineering',
        data.location || 'Headquarters',
        data.type || 'Full-time',
        data.experience || '3+ years',
        data.salaryRange || '₹12,00,000 - ₹18,00,000',
        data.postedDate || today
      ]
    );

    const created = await getOne('SELECT * FROM job_openings WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await query('SELECT * FROM candidates ORDER BY appliedDate DESC');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add candidate
router.post('/candidates', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `CND-${Date.now().toString().slice(-4)}`;
    const today = '2026-10-01';

    await execute(
      `INSERT INTO candidates (id, name, email, phone, appliedRole, jobId, stage, rating, appliedDate, experience, resumeUrl)
       VALUES (?, ?, ?, ?, ?, ?, 'Applied', ?, ?, ?, ?)`,
      [
        newId,
        data.name,
        data.email,
        data.phone || '',
        data.appliedRole || '',
        data.jobId || null,
        Number(data.rating) || 4.0,
        data.appliedDate || today,
        data.experience || '2+ years',
        data.resumeUrl || ''
      ]
    );

    // Increment applicants count on job if jobId exists
    if (data.jobId) {
      await execute('UPDATE job_openings SET applicantsCount = applicantsCount + 1 WHERE id = ?', [data.jobId]);
    }

    const created = await getOne('SELECT * FROM candidates WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update candidate stage
router.put('/candidates/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    await execute('UPDATE candidates SET stage = ? WHERE id = ?', [stage, req.params.id]);
    const updated = await getOne('SELECT * FROM candidates WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Candidate not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
