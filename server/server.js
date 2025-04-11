const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const employeeRoutes = require('./routes/employee');
app.use('/employee', employeeRoutes);
const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static('uploads')); // serve photos

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
