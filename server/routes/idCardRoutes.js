import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all ID Card requests / badges
router.get('/', async (req, res) => {
  try {
    const cards = await query('SELECT * FROM id_card_requests ORDER BY id DESC');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ID card by Employee ID
router.get('/employee/:empId', async (req, res) => {
  try {
    const card = await getOne('SELECT * FROM id_card_requests WHERE employeeId = ?', [req.params.empId]);
    if (!card) return res.status(404).json({ error: 'No ID card found for employee' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST employee requests digital ID card
router.post('/request', async (req, res) => {
  try {
    const { employeeId, employeeName, department, designation, photo, bloodGroup, emergencyContact, reason, cardType } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId is required' });

    const existing = await getOne('SELECT * FROM id_card_requests WHERE employeeId = ?', [employeeId]);
    const id = existing?.id || `REQ-ID-${Date.now().toString().slice(-4)}`;
    const today = '2026-10-01';

    if (existing) {
      await execute(
        `UPDATE id_card_requests 
         SET employeeName = ?, department = ?, designation = ?, photo = ?, status = 'Pending',
             requestDate = ?, reason = ?, notes = 'Awaiting HR verification and digital badge authorization.',
             qrData = ?
         WHERE id = ?`,
        [
          employeeName || existing.employeeName,
          department || existing.department,
          designation || existing.designation,
          photo || existing.photo,
          today,
          reason || 'Initial Employee Digital ID Card Generation',
          `NEXORA-PENDING-${employeeId}-${id}`,
          existing.id
        ]
      );
    } else {
      await execute(
        `INSERT INTO id_card_requests (id, employeeId, employeeName, department, designation, photo, status, requestDate, serialNumber, rfidCode, reason, notes, qrData)
         VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, NULL, NULL, ?, 'Awaiting HR verification and digital badge authorization.', ?)`,
        [
          id,
          employeeId,
          employeeName || 'Staff Member',
          department || 'Engineering',
          designation || 'Specialist',
          photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          today,
          reason || 'Initial Employee Digital ID Card Generation',
          `NEXORA-PENDING-${employeeId}-${id}`
        ]
      );
    }

    const created = await getOne('SELECT * FROM id_card_requests WHERE id = ?', [existing ? existing.id : id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST HR approves ID card request
router.post('/:id/approve', async (req, res) => {
  try {
    const target = await getOne('SELECT * FROM id_card_requests WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'ID card request not found' });

    const badgeNum = target.serialNumber || `NEX-ID-${Math.floor(10000 + Math.random() * 90000)}`;
    const approverName = req.body.approvedBy || 'Sophia Montgomery (VP of HR)';
    const today = '2026-10-01';

    await execute(
      `UPDATE id_card_requests 
       SET status = 'Approved', serialNumber = ?, rfidCode = ?, issuedDate = ?, approvedBy = ?,
           notes = ?, qrData = ?
       WHERE id = ?`,
      [
        badgeNum,
        `RFID-SEC-${target.employeeId}`,
        today,
        approverName,
        req.body.notes || 'Official ID credentials verified and authorized by HR Operations.',
        `NEXORA-VERIFIED-${target.employeeId}-SECURE-${badgeNum}`,
        target.id
      ]
    );

    const updated = await getOne('SELECT * FROM id_card_requests WHERE id = ?', [target.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST HR rejects ID card request
router.post('/:id/reject', async (req, res) => {
  try {
    const target = await getOne('SELECT * FROM id_card_requests WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'ID card request not found' });

    const reason = req.body.reason || 'Information mismatch or unclear photo. Please verify details and reapply.';
    await execute(
      `UPDATE id_card_requests 
       SET status = 'Rejected', approvedBy = ?, notes = ?
       WHERE id = ?`,
      [req.body.rejectedBy || 'HR Operations', reason, target.id]
    );

    const updated = await getOne('SELECT * FROM id_card_requests WHERE id = ?', [target.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Admin directly generates / issues official ID badge
router.post('/admin-issue', async (req, res) => {
  try {
    const { employeeId, employeeName, department, designation, photo, badgeNumber, notes, approvedBy } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId is required' });

    const existing = await getOne('SELECT * FROM id_card_requests WHERE employeeId = ?', [employeeId]);
    const id = existing?.id || `REQ-ID-${Date.now().toString().slice(-4)}`;
    const badgeNum = badgeNumber || `NEX-ID-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = '2026-10-01';
    const approver = approvedBy || 'Administrator (Saurabh Kumar)';

    if (existing) {
      await execute(
        `UPDATE id_card_requests 
         SET employeeName = ?, department = ?, designation = ?, photo = ?, status = 'Approved',
             serialNumber = ?, rfidCode = ?, issuedDate = ?, approvedBy = ?, notes = ?, qrData = ?
         WHERE id = ?`,
        [
          employeeName || existing.employeeName,
          department || existing.department,
          designation || existing.designation,
          photo || existing.photo,
          badgeNum,
          `RFID-ADMIN-${employeeId}`,
          today,
          approver,
          notes || 'Direct Administrator security clearance and immediate badge authorization.',
          `NEXORA-ADMIN-VERIFIED-${employeeId}-SECURE-${badgeNum}`,
          existing.id
        ]
      );
    } else {
      await execute(
        `INSERT INTO id_card_requests (id, employeeId, employeeName, department, designation, photo, status, requestDate, issuedDate, serialNumber, rfidCode, approvedBy, notes, qrData)
         VALUES (?, ?, ?, ?, ?, ?, 'Approved', ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          employeeId,
          employeeName || 'Staff Member',
          department || 'Engineering',
          designation || 'Staff Specialist',
          photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          today,
          today,
          badgeNum,
          `RFID-ADMIN-${employeeId}`,
          approver,
          notes || 'Direct Administrator security clearance and immediate badge authorization.',
          `NEXORA-ADMIN-VERIFIED-${employeeId}-SECURE-${badgeNum}`
        ]
      );
    }

    const created = await getOne('SELECT * FROM id_card_requests WHERE id = ?', [existing ? existing.id : id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ID card
router.delete('/:id', async (req, res) => {
  try {
    await execute('DELETE FROM id_card_requests WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'ID card request removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
