import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const list = await query('SELECT * FROM notifications ORDER BY id DESC');
    res.json(list.map(n => ({
      ...n,
      read: Boolean(n.read),
      roles: n.roles ? JSON.parse(n.roles) : ['owner', 'hr', 'manager', 'employee']
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add notification
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `NOTIF-${Date.now().toString().slice(-4)}`;
    const rolesStr = JSON.stringify(data.roles || data.targetRole || ['owner', 'hr', 'manager', 'employee']);

    await execute(
      `INSERT INTO notifications (id, title, message, type, time, read, roles, link)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        newId,
        data.title,
        data.message || '',
        data.type || 'info',
        data.time || new Date().toISOString(),
        rolesStr,
        data.link || '/'
      ]
    );

    const created = await getOne('SELECT * FROM notifications WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      read: false,
      roles: JSON.parse(created.roles || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    await execute('UPDATE notifications SET read = 1 WHERE id = ?', [req.params.id]);
    const updated = await getOne('SELECT * FROM notifications WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Notification not found' });
    res.json({
      ...updated,
      read: true,
      roles: updated.roles ? JSON.parse(updated.roles) : []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark all as read
router.put('/read-all', async (req, res) => {
  try {
    await execute('UPDATE notifications SET read = 1');
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE notification
router.delete('/:id', async (req, res) => {
  try {
    await execute('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
