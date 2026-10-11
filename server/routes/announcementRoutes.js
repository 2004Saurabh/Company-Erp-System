import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all announcements
router.get('/', async (req, res) => {
  try {
    const list = await query('SELECT * FROM announcements ORDER BY pinned DESC, date DESC, id DESC');
    res.json(list.map(a => ({
      ...a,
      pinned: Boolean(a.pinned),
      readBy: a.readBy ? JSON.parse(a.readBy) : []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add announcement
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `ANC-${Date.now().toString().slice(-4)}`;
    const today = '2026-10-01';

    await execute(
      `INSERT INTO announcements (id, title, description, date, priority, pinned, author, category, readBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        data.title,
        data.description || '',
        data.date || today,
        data.priority || 'Medium',
        data.pinned ? 1 : 0,
        data.author || 'Saurabh Kumar',
        data.category || 'General',
        JSON.stringify(data.readBy || [])
      ]
    );

    const created = await getOne('SELECT * FROM announcements WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      pinned: Boolean(created.pinned),
      readBy: JSON.parse(created.readBy || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT toggle pin
router.put('/:id/pin', async (req, res) => {
  try {
    const target = await getOne('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'Announcement not found' });

    const newPinned = target.pinned ? 0 : 1;
    await execute('UPDATE announcements SET pinned = ? WHERE id = ?', [newPinned, target.id]);

    const updated = await getOne('SELECT * FROM announcements WHERE id = ?', [target.id]);
    res.json({
      ...updated,
      pinned: Boolean(updated.pinned),
      readBy: JSON.parse(updated.readBy || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST mark as read by user
router.post('/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    const target = await getOne('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'Announcement not found' });

    const readBy = target.readBy ? JSON.parse(target.readBy) : [];
    if (userId && !readBy.includes(userId)) {
      readBy.push(userId);
      await execute('UPDATE announcements SET readBy = ? WHERE id = ?', [JSON.stringify(readBy), target.id]);
    }

    const updated = await getOne('SELECT * FROM announcements WHERE id = ?', [target.id]);
    res.json({
      ...updated,
      pinned: Boolean(updated.pinned),
      readBy: JSON.parse(updated.readBy || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE announcement
router.delete('/:id', async (req, res) => {
  try {
    await execute('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
