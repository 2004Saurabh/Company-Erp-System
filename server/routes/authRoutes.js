import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (!user) {
      return res.status(401).json({ error: 'User not found with this email' });
    }

    if (password && user.password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid password credentials' });
    }

    // Return safe user object
    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      user: safeUser,
      token: `token_${safeUser.id}_${Date.now()}`
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, title, department, phone, avatar, joiningDate, status, location, employeeId FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
