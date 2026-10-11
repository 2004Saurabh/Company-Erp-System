import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await query('SELECT * FROM employees ORDER BY id ASC');
    const parsed = employees.map(e => ({
      ...e,
      fullName: e.name,
      skills: e.skills ? JSON.parse(e.skills) : []
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single employee
router.get('/:id', async (req, res) => {
  try {
    const emp = await getOne('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json({
      ...emp,
      fullName: emp.name,
      skills: emp.skills ? JSON.parse(emp.skills) : []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create employee
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `EMP-${Date.now().toString().slice(-4)}`;
    const name = data.fullName || data.name || 'New Employee';
    const skillsStr = JSON.stringify(data.skills || []);

    await execute(
      `INSERT INTO employees (id, name, email, role, department, designation, salary, phone, joinDate, status, avatar, managerId, location, skills, performanceScore)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, name, data.email, data.role || 'employee', data.department || 'Engineering',
        data.designation || 'Staff Member', Number(data.salary) || 50000, data.phone || '',
        data.joinDate || new Date().toISOString().slice(0, 10), data.status || 'Active',
        data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        data.managerId || null, data.location || 'Headquarters', skillsStr, Number(data.performanceScore) || 4.2
      ]
    );

    const created = await getOne('SELECT * FROM employees WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      fullName: created.name,
      skills: JSON.parse(created.skills || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const existing = await getOne('SELECT * FROM employees WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Employee not found' });

    const name = data.fullName || data.name || existing.name;
    const skillsStr = data.skills !== undefined ? JSON.stringify(data.skills) : existing.skills;

    await execute(
      `UPDATE employees SET
         name = ?, email = ?, role = ?, department = ?, designation = ?, salary = ?,
         phone = ?, joinDate = ?, status = ?, avatar = ?, managerId = ?, location = ?,
         skills = ?, performanceScore = ?
       WHERE id = ?`,
      [
        name,
        data.email !== undefined ? data.email : existing.email,
        data.role !== undefined ? data.role : existing.role,
        data.department !== undefined ? data.department : existing.department,
        data.designation !== undefined ? data.designation : existing.designation,
        data.salary !== undefined ? Number(data.salary) : existing.salary,
        data.phone !== undefined ? data.phone : existing.phone,
        data.joinDate !== undefined ? data.joinDate : existing.joinDate,
        data.status !== undefined ? data.status : existing.status,
        data.avatar !== undefined ? data.avatar : existing.avatar,
        data.managerId !== undefined ? data.managerId : existing.managerId,
        data.location !== undefined ? data.location : existing.location,
        skillsStr,
        data.performanceScore !== undefined ? Number(data.performanceScore) : existing.performanceScore,
        id
      ]
    );

    const updated = await getOne('SELECT * FROM employees WHERE id = ?', [id]);
    res.json({
      ...updated,
      fullName: updated.name,
      skills: JSON.parse(updated.skills || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await execute('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ success: true, message: `Employee ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT toggle status
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const id = req.params.id;
    const emp = await getOne('SELECT * FROM employees WHERE id = ?', [id]);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    await execute('UPDATE employees SET status = ? WHERE id = ?', [newStatus, id]);

    res.json({ id, status: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
