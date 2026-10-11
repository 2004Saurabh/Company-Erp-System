import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all audit logs
router.get('/', async (req, res) => {
  try {
    const logs = await query('SELECT * FROM audit_logs ORDER BY date DESC, id DESC LIMIT 200');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add audit log
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `LOG-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await execute(
      `INSERT INTO audit_logs (id, user, role, action, module, details, date, time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        data.user || 'Saurabh Kumar',
        data.role || 'owner',
        data.action || 'ACTION_LOGGED',
        data.module || 'System',
        data.details || '',
        data.date || today,
        data.time || timeNow
      ]
    );

    const created = await getOne('SELECT * FROM audit_logs WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
