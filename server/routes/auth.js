const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ✅ Register Route
router.post('/register', async (req, res) => {
  const {
    email, password, name, type, contact,
    location, empId, title, joiningDate,
    address, city, state, zip
  } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM hrms_users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into hrms_users
    await pool.query(
      'INSERT INTO hrms_users (email, password, is_authorized) VALUES ($1, $2, $3)',
      [email, hashedPassword, true]
    );

    // Insert into employees
    await pool.query(
      `INSERT INTO employees (
        email, name, type, contact, location, empid, title,
        joiningdate, address, city, state, zip
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [email, name, type, contact, location, empId, title, joiningDate, address, city, state, zip]
    );

    res.status(201).json({ message: 'User and employee registered successfully' });

  } catch (err) {
    console.error('🔥 Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM hrms_users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Email not found' });
    if (!user.is_authorized) return res.status(403).json({ message: 'User not authorized' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      email: user.email
    });

  } catch (err) {
    console.error('🔥 Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get employee data (for Home.js)
router.get('/employee/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query(`
      SELECT email, name, type, contact, location,
             empid AS "empId", title,
             TO_CHAR(joiningdate, 'YYYY-MM-DD') AS "joiningDate",
             address, city, state, zip, photo
      FROM employees
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Employee not found' });

    res.json(result.rows[0]);

  } catch (err) {
    console.error('🔥 Fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update address + photo
router.put('/employee/update', async (req, res) => {
  const { email, address, city, state, zip, photo } = req.body;

  try {
    await pool.query(
      `UPDATE employees SET
        address = $1, city = $2, state = $3, zip = $4, photo = $5
       WHERE email = $6`,
      [address, city, state, zip, photo, email]
    );

    res.json({ message: 'Employee data updated' });
  } catch (err) {
    console.error('🔥 Update error:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
