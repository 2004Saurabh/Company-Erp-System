import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all company WiFis
router.get('/', async (req, res) => {
  try {
    const wifis = await query('SELECT * FROM company_wifis ORDER BY id ASC');
    res.json(wifis.map(w => ({
      ...w,
      isPrimary: Boolean(w.isPrimary),
      attendanceEnabled: Boolean(w.attendanceEnabled)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add company WiFi
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `WIFI-${Date.now().toString().slice(-4)}`;
    const attendanceEnabled = data.attendanceEnabled !== undefined ? (data.attendanceEnabled ? 1 : 0) : 1;
    const isPrimary = data.isPrimary ? 1 : 0;

    await execute(
      `INSERT INTO company_wifis (id, ssid, bssid, ipRange, location, isPrimary, attendanceEnabled)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        data.ssid.trim(),
        data.bssid || '00:11:22:33:44:55',
        data.ipRange || '192.168.1.0/24',
        data.location || 'Branch Office',
        isPrimary,
        attendanceEnabled
      ]
    );

    const created = await getOne('SELECT * FROM company_wifis WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      isPrimary: Boolean(created.isPrimary),
      attendanceEnabled: Boolean(created.attendanceEnabled)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT toggle attendance permission for WiFi network
router.put('/:id/attendance', async (req, res) => {
  try {
    const target = await getOne('SELECT * FROM company_wifis WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'WiFi network not found' });

    const newStatus = req.body.attendanceEnabled !== undefined 
      ? (req.body.attendanceEnabled ? 1 : 0)
      : (target.attendanceEnabled ? 0 : 1);

    await execute('UPDATE company_wifis SET attendanceEnabled = ? WHERE id = ?', [newStatus, target.id]);

    const updated = await getOne('SELECT * FROM company_wifis WHERE id = ?', [target.id]);
    res.json({
      ...updated,
      isPrimary: Boolean(updated.isPrimary),
      attendanceEnabled: Boolean(updated.attendanceEnabled)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE company WiFi
router.delete('/:id', async (req, res) => {
  try {
    const countResult = await getOne('SELECT COUNT(*) as count FROM company_wifis');
    if (countResult && countResult.count <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last remaining authorized office WiFi network' });
    }

    await execute('DELETE FROM company_wifis WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'WiFi network deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
