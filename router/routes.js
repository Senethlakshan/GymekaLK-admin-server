const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require("../models/adminschema");
const Manager = require("../models/managerschema");
const authenticate = require('../middleware/authenticate');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

//admin register
router.post('/admin/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});


// admin login
router.post('/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(400).json({ error: 'Invalid email or password!' });
      }
  
      const isMatch = await bcrypt.compare(password, existingAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password!' });
      }
  
      const token = jwt.sign(
        { id: existingAdmin._id, role: existingAdmin.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
      );
  
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
  
      res.status(200).json({ message: 'Admin logged in successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error!' });
    }
  });
  
  // admin logout
  router.post('/admin/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Admin logged out successfully!' });
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
    
    // validate user
    router.get('/validate', authenticate, (req, res) => {
    res.status(200).json({ message: 'Valid user!', role: req.user.role });
    });
    
    module.exports = router;
