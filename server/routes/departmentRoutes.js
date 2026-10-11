import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all departments
router.get('/', async (req, res) => {
  try {
    const depts = await query('SELECT * FROM departments ORDER BY id ASC');
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST department
router.post('/', async (req, res) => {
  try {
    const d = req.body;
    const newId = d.id || `DEP-${Date.now().toString().slice(-3)}`;
    await execute(
      `INSERT INTO departments (id, name, head, headId, employeeCount, budget, color, icon, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, d.name, d.head || 'To be assigned', d.headId || null, Number(d.employeeCount) || 0, Number(d.budget) || 1000000, d.color || '#3b82f6', d.icon || 'Building2', d.description || '']
    );
    const created = await getOne('SELECT * FROM departments WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update department
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const d = req.body;
    const existing = await getOne('SELECT * FROM departments WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Department not found' });

    await execute(
      `UPDATE departments SET
         name = ?, head = ?, headId = ?, employeeCount = ?, budget = ?, color = ?, icon = ?, description = ?
       WHERE id = ?`,
      [
        d.name !== undefined ? d.name : existing.name,
        d.head !== undefined ? d.head : existing.head,
        d.headId !== undefined ? d.headId : existing.headId,
        d.employeeCount !== undefined ? Number(d.employeeCount) : existing.employeeCount,
        d.budget !== undefined ? Number(d.budget) : existing.budget,
        d.color !== undefined ? d.color : existing.color,
        d.icon !== undefined ? d.icon : existing.icon,
        d.description !== undefined ? d.description : existing.description,
        id
      ]
    );
    const updated = await getOne('SELECT * FROM departments WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE department
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await execute('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ success: true, message: `Department ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
