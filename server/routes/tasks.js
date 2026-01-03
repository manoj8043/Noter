const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      $or: [
        { user: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      status: req.body.status,
      tags: req.body.tags
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id && !task.sharedWith.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, description, dueDate, priority, isCompleted, status, tags } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (tags) task.tags = tags;
    
    // Legacy support: sync isCompleted with status
    if (isCompleted !== undefined) {
      task.isCompleted = isCompleted;
      if (isCompleted && task.status !== 'done') task.status = 'done';
      if (!isCompleted && task.status === 'done') task.status = 'todo';
    }
    
    // If status is updated to done, check isCompleted
    if (status === 'done') task.isCompleted = true;
    if (status && status !== 'done') task.isCompleted = false;

    task.updatedAt = Date.now();

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
