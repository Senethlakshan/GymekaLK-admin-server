const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Branch = require('../models/branchesmodel');

// Create a branch
router.post('/branches', authenticate, async (req, res) => {
  try {
    const { branchCode, location, openTime, closeTime, managerName } = req.body;

    const existingBranch = await Branch.findOne({ branchCode });
    if (existingBranch) {
      return res.status(400).json({ error: 'Branch code already exists!' });
    }

    const newBranch = new Branch({ branchCode, location, openTime, closeTime, managerName });
    await newBranch.save();

    res.status(201).json({ message: 'Branch created successfully!', branch: newBranch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Get all branches
router.get('/branches', authenticate, async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({ branches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Update a branch
router.put('/branches/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { branchCode, location, openTime, closeTime, managerName } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      id,
      { branchCode, location, openTime, closeTime, managerName },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found!' });
    }

    res.status(200).json({ message: 'Branch updated successfully!', branch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Delete a branch
router.delete('/branches/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found!' });
    }

    res.status(200).json({ message: 'Branch deleted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});





module.exports = router;
