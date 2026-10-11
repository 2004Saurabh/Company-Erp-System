import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all leaves
router.get('/', async (req, res) => {
  try {
    const leaves = await query('SELECT * FROM leaves ORDER BY appliedDate DESC, id DESC');
    res.json(leaves.map(l => ({
      ...l,
      appliedOn: l.appliedDate
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST apply for leave
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `LEV-${Date.now().toString().slice(-4)}`;
    const today = '2026-10-01';

    await execute(
      `INSERT INTO leaves (id, employeeId, employeeName, leaveType, startDate, endDate, days, reason, status, appliedDate, reviewedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, NULL)`,
      [
        newId,
        data.employeeId || 'EMP-1004',
        data.employeeName || 'Elena Rostova',
        data.leaveType || 'Casual Leave',
        data.startDate || today,
        data.endDate || today,
        Number(data.days) || 1,
        data.reason || 'Personal matters',
        data.appliedDate || today
      ]
    );

    const created = await getOne('SELECT * FROM leaves WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      appliedOn: created.appliedDate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT approve leave
router.put('/:id/approve', async (req, res) => {
  try {
    const reviewer = req.body.reviewedBy || 'Marcus Sterling';
    await execute(
      "UPDATE leaves SET status = 'Approved', reviewedBy = ? WHERE id = ?",
      [reviewer, req.params.id]
    );

    const updated = await getOne('SELECT * FROM leaves WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Leave not found' });
    res.json({
      ...updated,
      appliedOn: updated.appliedDate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reject leave
router.put('/:id/reject', async (req, res) => {
  try {
    const reviewer = req.body.reviewedBy || 'Marcus Sterling';
    await execute(
      "UPDATE leaves SET status = 'Rejected', reviewedBy = ? WHERE id = ?",
      [reviewer, req.params.id]
    );

    const updated = await getOne('SELECT * FROM leaves WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Leave not found' });
    res.json({
      ...updated,
      appliedOn: updated.appliedDate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET leave balances
router.get('/balances', async (req, res) => {
  try {
    const balances = await query('SELECT * FROM leave_balances');
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
