// /server/routes/employee.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET employee by email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ GET error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT employee (update address and photo only)
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { address, city, state, zip } = req.body;

  try {
    const result = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await pool.query(
      `UPDATE employees SET address = $1, city = $2, state = $3, zip = $4 WHERE email = $5`,
      [address, city, state, zip, email]
    );

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('❌ PUT error:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;