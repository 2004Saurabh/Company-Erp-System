import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY id ASC');
    const parsed = projects.map(p => ({
      ...p,
      team: p.team ? JSON.parse(p.team) : []
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST project
router.post('/', async (req, res) => {
  try {
    const p = req.body;
    const newId = p.id || `PRJ-${Date.now().toString().slice(-3)}`;
    const teamStr = JSON.stringify(p.team || []);

    await execute(
      `INSERT INTO projects (id, name, department, departmentId, managerId, status, progress, budget, spent, startDate, deadline, team, priority, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, p.name, p.department || 'Engineering', p.departmentId || null,
        p.managerId || null, p.status || 'Planning', Number(p.progress) || 0,
        Number(p.budget) || 1000000, Number(p.spent) || 0,
        p.startDate || new Date().toISOString().slice(0, 10),
        p.deadline || '2026-12-31', teamStr, p.priority || 'Medium', p.description || ''
      ]
    );

    const created = await getOne('SELECT * FROM projects WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      team: JSON.parse(created.team || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;
    const existing = await getOne('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const teamStr = p.team !== undefined ? JSON.stringify(p.team) : existing.team;

    await execute(
      `UPDATE projects SET
         name = ?, department = ?, departmentId = ?, managerId = ?, status = ?,
         progress = ?, budget = ?, spent = ?, startDate = ?, deadline = ?,
         team = ?, priority = ?, description = ?
       WHERE id = ?`,
      [
        p.name !== undefined ? p.name : existing.name,
        p.department !== undefined ? p.department : existing.department,
        p.departmentId !== undefined ? p.departmentId : existing.departmentId,
        p.managerId !== undefined ? p.managerId : existing.managerId,
        p.status !== undefined ? p.status : existing.status,
        p.progress !== undefined ? Number(p.progress) : existing.progress,
        p.budget !== undefined ? Number(p.budget) : existing.budget,
        p.spent !== undefined ? Number(p.spent) : existing.spent,
        p.startDate !== undefined ? p.startDate : existing.startDate,
        p.deadline !== undefined ? p.deadline : existing.deadline,
        teamStr,
        p.priority !== undefined ? p.priority : existing.priority,
        p.description !== undefined ? p.description : existing.description,
        id
      ]
    );

    const updated = await getOne('SELECT * FROM projects WHERE id = ?', [id]);
    res.json({
      ...updated,
      team: JSON.parse(updated.team || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await execute('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: `Project ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
