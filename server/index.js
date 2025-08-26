const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const pool = require('./config/database');

// Import routes
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Database test route (you can remove this later)
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM tasks');
    res.json({ 
      message: 'Database connection successful!', 
      taskCount: result.rows[0].count 
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/tasks`);
});