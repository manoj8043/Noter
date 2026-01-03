const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Note = require('../models/Note');

// @route   GET api/notes
// @desc    Get all notes for user
// @access  Private (Device ID)
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ 
      $or: [
        { user: req.user.id },
        { sharedWith: req.user.id }
      ],
      isDeleted: false 
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notes
// @desc    Create a note
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newNote = new Note({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    // Check ownership or shared access
    if (note.user.toString() !== req.user.id && !note.sharedWith.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, content, isArchived, isDeleted } = req.body;

    if (title) note.title = title;
    if (content) note.content = content;
    if (isArchived !== undefined) note.isArchived = isArchived;
    if (isDeleted !== undefined) note.isDeleted = isDeleted;
    
    note.updatedAt = Date.now();

    await note.save();
    
    // Emit update via Socket.IO
    const io = req.app.get('io');
    // Emit to specific room (note ID) if implemented, or just broadcast for now
    // Ideally, clients subscribe to note updates
    
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/notes/:id
// @desc    Delete a note (Soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    note.isDeleted = true;
    await note.save();

    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
