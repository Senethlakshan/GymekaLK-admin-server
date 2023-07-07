const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Manager = require("../models/managerschema");
const authenticate = require('../middleware/authenticate');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// manager register
router.post('/manager/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const existingManager = await Manager.findOne({ email });
      if (existingManager) {
        return res.status(400).json({ error: 'Email already exists!' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newManager = new Manager({ username, email, password: hashedPassword });
      await newManager.save();
      res.status(201).json({ message: 'Manager registered successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error!' });
    }
  });
  

  // Manager update
router.put('/manager/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const manager = await Manager.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true }
    );

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found!' });
    }

    res.status(200).json({ message: 'Manager updated successfully!', manager });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Manager delete
router.delete('/manager/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const manager = await Manager.findByIdAndDelete(id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found!' });
    }

    res.status(200).json({ message: 'Manager deleted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Get all managers
router.get('/managers', async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json({ managers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// manager login
router.post('/manager/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingManager = await Manager.findOne({ email });
        if (!existingManager) {
            return res.status(400).json({ error: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, existingManager.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: existingManager._id, role: existingManager.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).json({ message: 'Manager logged in successfully!' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error!' });
    }
});

  // manager logout
  router.post('/manager/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Manager logged out successfully!' });
  });
  
  

// validate user
router.get('/validate', authenticate, (req, res) => {
    res.status(200).json({ message: 'Valid user!', role: req.user.role });
});

module.exports = router;
