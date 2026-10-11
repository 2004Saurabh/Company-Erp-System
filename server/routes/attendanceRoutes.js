import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// GET all attendance records
router.get('/', async (req, res) => {
  try {
    const records = await query('SELECT * FROM attendance ORDER BY date DESC, id DESC');
    const parsed = records.map(r => ({
      ...r,
      isWFH: Boolean(r.isWFH),
      networkVerified: Boolean(r.networkVerified)
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET today's attendance records
router.get('/today', async (req, res) => {
  try {
    const today = req.query.date || '2026-10-01';
    const records = await query('SELECT * FROM attendance WHERE date = ? ORDER BY id DESC', [today]);
    const parsed = records.map(r => ({
      ...r,
      isWFH: Boolean(r.isWFH),
      networkVerified: Boolean(r.networkVerified)
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST check-in
router.post('/check-in', async (req, res) => {
  try {
    const { employeeId, employeeName, department, date, networkName, networkIp, networkLocation } = req.body;
    const effectiveDate = date || '2026-10-01';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const empId = employeeId || 'EMP-1004';
    const empName = employeeName || 'Elena Rostova';

    // Check if already checked in today
    const existing = await getOne(
      'SELECT * FROM attendance WHERE employeeId = ? AND date = ?',
      [empId, effectiveDate]
    );

    if (existing && existing.checkIn) {
      return res.status(400).json({ error: 'Already checked in for today', existing });
    }

    const newId = existing?.id || `ATT-${Date.now().toString().slice(-4)}`;

    if (existing) {
      await execute(
        `UPDATE attendance SET checkIn = ?, checkOut = NULL, workHours = 0.1, status = 'Present',
         isWFH = 0, workMode = 'In Office', networkName = ?, networkVerified = 1, notes = 'Checked in via Office WiFi'
         WHERE id = ?`,
        [timeNow, networkName || 'NEXORA-CORP-5G', existing.id]
      );
    } else {
      await execute(
        `INSERT INTO attendance (id, employeeId, employeeName, date, checkIn, checkOut, workHours, status, isWFH, workMode, networkName, networkVerified, notes)
         VALUES (?, ?, ?, ?, ?, NULL, 0.1, 'Present', 0, 'In Office', ?, 1, 'Checked in via Office WiFi')`,
        [newId, empId, empName, effectiveDate, timeNow, networkName || 'NEXORA-CORP-5G']
      );
    }

    const created = await getOne('SELECT * FROM attendance WHERE id = ?', [existing ? existing.id : newId]);
    res.status(201).json({
      ...created,
      department: department || 'Engineering',
      isWFH: false,
      networkVerified: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST check-out
router.post('/check-out', async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    const effectiveDate = date || '2026-10-01';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const empId = employeeId || 'EMP-1004';

    const existing = await getOne(
      'SELECT * FROM attendance WHERE employeeId = ? AND date = ?',
      [empId, effectiveDate]
    );

    if (!existing) {
      return res.status(404).json({ error: 'No check-in record found for today' });
    }

    const finalHours = Math.max(existing.workHours || 4.5, 8.2);
    await execute(
      'UPDATE attendance SET checkOut = ?, workHours = ? WHERE id = ?',
      [timeNow, finalHours, existing.id]
    );

    const updated = await getOne('SELECT * FROM attendance WHERE id = ?', [existing.id]);
    res.json({
      ...updated,
      isWFH: Boolean(updated.isWFH),
      networkVerified: Boolean(updated.networkVerified)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST reset attendance (for demo/testing)
router.post('/reset', async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    const empId = employeeId || 'EMP-1004';
    const effectiveDate = date || '2026-10-01';

    await execute(
      `UPDATE attendance SET checkIn = NULL, checkOut = NULL, workHours = 0, status = 'Absent'
       WHERE employeeId = ? AND date = ?`,
      [empId, effectiveDate]
    );

    res.json({ success: true, message: `Attendance reset for employee ${empId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= WFH ATTENDANCE & AUTHORIZATION =================

// GET all WFH authorized employees
router.get('/wfh-authorized', async (req, res) => {
  try {
    const records = await query('SELECT * FROM wfh_authorized ORDER BY id DESC');
    res.json(records.map(r => ({
      ...r,
      idCardVerified: Boolean(r.idCardVerified)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST authorize employee for WFH (Admin Action)
router.post('/wfh-authorize', async (req, res) => {
  try {
    const { employeeId, employeeName, department, designation, reason, validUntil, notes, authorizedBy } = req.body;
    if (!employeeId) {
      return res.status(400).json({ error: 'employeeId is required' });
    }

    // Check existing
    const existing = await getOne('SELECT * FROM wfh_authorized WHERE employeeId = ?', [employeeId]);
    const id = existing?.id || `WFH-AUTH-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().slice(0, 10);

    if (existing) {
      await execute(
        `UPDATE wfh_authorized 
         SET employeeName = ?, department = ?, designation = ?, authorizedBy = ?, authorizedDate = ?, validUntil = ?, status = 'Authorized', reason = ?, notes = ?
         WHERE id = ?`,
        [
          employeeName || existing.employeeName,
          department || existing.department,
          designation || existing.designation,
          authorizedBy || 'Administrator (Saurabh Kumar)',
          today,
          validUntil || '2026-10-31',
          reason || existing.reason,
          notes || existing.notes,
          existing.id
        ]
      );
    } else {
      await execute(
        `INSERT INTO wfh_authorized (id, employeeId, employeeName, department, designation, authorizedBy, authorizedDate, validUntil, status, reason, idCardVerified, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Authorized', ?, 1, ?)`,
        [
          id,
          employeeId,
          employeeName || 'Authorized Staff',
          department || 'Engineering',
          designation || 'Staff',
          authorizedBy || 'Administrator (Saurabh Kumar)',
          today,
          validUntil || '2026-10-31',
          reason || 'Approved Remote Assignment',
          notes || 'Admin ID verified & authorized for remote shift attendance'
        ]
      );
    }

    const created = await getOne('SELECT * FROM wfh_authorized WHERE id = ?', [existing ? existing.id : id]);
    res.status(201).json({
      ...created,
      idCardVerified: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE revoke WFH authorization (Admin Action)
router.delete('/wfh-authorize/:employeeId', async (req, res) => {
  try {
    await execute('DELETE FROM wfh_authorized WHERE employeeId = ?', [req.params.employeeId]);
    res.json({ success: true, message: `WFH authorization revoked for employee ${req.params.employeeId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST HR marks WFH attendance
router.post('/wfh', async (req, res) => {
  try {
    const { employeeId, employeeName, department, date, checkIn, checkOut, status, workHours, notes, markedBy } = req.body;
    const effectiveDate = date || '2026-10-01';

    // Verify admin authorization
    const authRecord = await getOne(
      "SELECT * FROM wfh_authorized WHERE (employeeId = ? OR employeeName = ?) AND status = 'Authorized'",
      [employeeId, employeeName || '']
    );

    if (!authRecord) {
      return res.status(403).json({
        error: `Employee ID "${employeeId}" is not authorized for Work From Home by Administrator. Admin must authorize this ID card first!`,
        reason: 'NOT_AUTHORIZED_BY_ADMIN'
      });
    }

    const calculatedHours = checkOut ? Number(workHours || 8.5) : (status === 'Late' ? 7.0 : 8.0);
    const existing = await getOne(
      'SELECT * FROM attendance WHERE employeeId = ? AND date = ?',
      [employeeId, effectiveDate]
    );

    const id = existing?.id || `ATT-WFH-${Date.now().toString().slice(-4)}`;

    if (existing) {
      await execute(
        `UPDATE attendance 
         SET checkIn = ?, checkOut = ?, workHours = ?, status = ?, isWFH = 1, workMode = 'Work From Home',
             networkName = 'Work From Home (Admin ID Authorized)', networkVerified = 1, notes = ?
         WHERE id = ?`,
        [
          checkIn || '09:00 AM',
          checkOut || (status === 'Present' || status === 'Late' ? '05:30 PM' : null),
          calculatedHours,
          status || 'Present',
          notes || `WFH Approved by Admin (${authRecord.id}) & Marked by HR`,
          existing.id
        ]
      );
    } else {
      await execute(
        `INSERT INTO attendance (id, employeeId, employeeName, date, checkIn, checkOut, workHours, status, isWFH, workMode, networkName, networkVerified, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'Work From Home', 'Work From Home (Admin ID Authorized)', 1, ?)`,
        [
          id,
          employeeId,
          employeeName || authRecord.employeeName,
          effectiveDate,
          checkIn || '09:00 AM',
          checkOut || (status === 'Present' || status === 'Late' ? '05:30 PM' : null),
          calculatedHours,
          status || 'Present',
          notes || `WFH Approved by Admin (${authRecord.id}) & Marked by HR`
        ]
      );
    }

    const updated = await getOne('SELECT * FROM attendance WHERE id = ?', [existing ? existing.id : id]);
    res.json({
      ...updated,
      isWFH: true,
      workMode: 'Work From Home',
      adminAuthorized: true,
      adminAuthId: authRecord.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
