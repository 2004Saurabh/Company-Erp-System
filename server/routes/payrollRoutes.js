import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all payroll records
router.get('/', async (req, res) => {
  try {
    const records = await query('SELECT * FROM payroll ORDER BY id ASC');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create payroll record
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `PAY-${Date.now().toString().slice(-4)}`;
    const basic = Number(data.basicSalary) || 50000;
    const allowances = Number(data.allowances) || 0;
    const deductions = Number(data.deductions) || 0;
    const net = data.netSalary !== undefined ? Number(data.netSalary) : (basic + allowances - deductions);

    await execute(
      `INSERT INTO payroll (id, employeeId, employeeName, month, basicSalary, allowances, deductions, netSalary, status, paymentDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        data.employeeId,
        data.employeeName,
        data.month || 'September 2026',
        basic,
        allowances,
        deductions,
        net,
        data.status || 'Paid',
        data.paymentDate || '2026-09-30'
      ]
    );

    const created = await getOne('SELECT * FROM payroll WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark payroll as paid
router.put('/:id/pay', async (req, res) => {
  try {
    const today = '2026-10-01';
    await execute(
      "UPDATE payroll SET status = 'Paid', paymentDate = ? WHERE id = ?",
      [today, req.params.id]
    );

    const updated = await getOne('SELECT * FROM payroll WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Payroll record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
