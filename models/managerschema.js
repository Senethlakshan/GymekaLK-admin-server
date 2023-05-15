const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'manager',
  },
});


// createing model
const Manager = new mongoose.model('Managerinfo', managerSchema);

module.exports = Manager;
