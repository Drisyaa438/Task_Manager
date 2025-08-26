const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get tasks'
    });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error getting task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get task'
    });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status = 'pending' } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description, status]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Task created successfully'
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    // Check if task exists
    const checkResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, status, id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Task updated successfully'
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

module.exports = router;