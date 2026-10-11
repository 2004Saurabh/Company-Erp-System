import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

const parseTask = (t) => ({
  ...t,
  tags: t.tags ? JSON.parse(t.tags) : [],
  comments: t.comments ? JSON.parse(t.comments) : [],
  attachments: t.attachments ? JSON.parse(t.attachments) : []
});

// GET all tasks (with query params)
router.get('/', async (req, res) => {
  try {
    const { assignedToId, assignedManagerId, department, status, projectId } = req.query;
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (assignedToId) {
      sql += ' AND assignedToId = ?';
      params.push(assignedToId);
    }
    if (assignedManagerId) {
      sql += ' AND assignedManagerId = ?';
      params.push(assignedManagerId);
    }
    if (department) {
      sql += ' AND department = ?';
      params.push(department);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (projectId) {
      sql += ' AND projectId = ?';
      params.push(projectId);
    }

    sql += ' ORDER BY createdDate DESC, id DESC';
    const tasks = await query(sql, params);
    res.json(tasks.map(parseTask));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await getOne('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(parseTask(task));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const t = req.body;
    const newId = t.id || `TSK-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().slice(0, 10);

    await execute(
      `INSERT INTO tasks (
         id, title, description, assignedTo, assignedToId, assignedManager, assignedManagerId,
         department, project, projectId, priority, status, startDate, dueDate, completionDate,
         estimatedHours, actualHours, tags, comments, attachments, createdBy, createdDate
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        t.title || 'Untitled Task',
        t.description || '',
        t.assignedTo || 'Unassigned',
        t.assignedToId || 'EMP-1001',
        t.assignedManager || 'Marcus Sterling',
        t.assignedManagerId || 'EMP-1002',
        t.department || 'Engineering',
        t.project || 'General Operations',
        t.projectId || null,
        t.priority || 'Medium',
        t.status || 'Pending',
        t.startDate || today,
        t.dueDate || today,
        t.completionDate || null,
        Number(t.estimatedHours) || 8,
        Number(t.actualHours) || 0,
        JSON.stringify(t.tags || []),
        JSON.stringify(t.comments || []),
        JSON.stringify(t.attachments || []),
        t.createdBy || 'Administrator',
        t.createdDate || today
      ]
    );

    const created = await getOne('SELECT * FROM tasks WHERE id = ?', [newId]);
    res.status(201).json(parseTask(created));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update full task
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const t = req.body;
    const existing = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await execute(
      `UPDATE tasks SET
         title = ?, description = ?, assignedTo = ?, assignedToId = ?,
         assignedManager = ?, assignedManagerId = ?, department = ?,
         project = ?, projectId = ?, priority = ?, status = ?,
         startDate = ?, dueDate = ?, completionDate = ?, estimatedHours = ?,
         actualHours = ?, tags = ?, comments = ?, attachments = ?
       WHERE id = ?`,
      [
        t.title !== undefined ? t.title : existing.title,
        t.description !== undefined ? t.description : existing.description,
        t.assignedTo !== undefined ? t.assignedTo : existing.assignedTo,
        t.assignedToId !== undefined ? t.assignedToId : existing.assignedToId,
        t.assignedManager !== undefined ? t.assignedManager : existing.assignedManager,
        t.assignedManagerId !== undefined ? t.assignedManagerId : existing.assignedManagerId,
        t.department !== undefined ? t.department : existing.department,
        t.project !== undefined ? t.project : existing.project,
        t.projectId !== undefined ? t.projectId : existing.projectId,
        t.priority !== undefined ? t.priority : existing.priority,
        t.status !== undefined ? t.status : existing.status,
        t.startDate !== undefined ? t.startDate : existing.startDate,
        t.dueDate !== undefined ? t.dueDate : existing.dueDate,
        t.completionDate !== undefined ? t.completionDate : existing.completionDate,
        t.estimatedHours !== undefined ? Number(t.estimatedHours) : existing.estimatedHours,
        t.actualHours !== undefined ? Number(t.actualHours) : existing.actualHours,
        t.tags !== undefined ? JSON.stringify(t.tags) : existing.tags,
        t.comments !== undefined ? JSON.stringify(t.comments) : existing.comments,
        t.attachments !== undefined ? JSON.stringify(t.attachments) : existing.attachments,
        id
      ]
    );

    const updated = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(parseTask(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update task status
router.patch('/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const existing = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    let completionDate = existing.completionDate;
    if (status === 'Completed' && !completionDate) {
      completionDate = new Date().toISOString().slice(0, 10);
    } else if (status !== 'Completed') {
      completionDate = null;
    }

    await execute(
      'UPDATE tasks SET status = ?, completionDate = ? WHERE id = ?',
      [status, completionDate, id]
    );

    const updated = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(parseTask(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const id = req.params.id;
    const { comment, author } = req.body;
    if (!comment) return res.status(400).json({ error: 'Comment text is required' });

    const existing = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const currentComments = existing.comments ? JSON.parse(existing.comments) : [];
    const newComment = {
      id: `COM-${Date.now().toString().slice(-4)}`,
      author: author || 'Current User',
      text: comment,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    currentComments.push(newComment);

    await execute(
      'UPDATE tasks SET comments = ? WHERE id = ?',
      [JSON.stringify(currentComments), id]
    );

    const updated = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(parseTask(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await execute('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ success: true, message: `Task ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
