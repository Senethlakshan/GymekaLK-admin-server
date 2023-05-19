const mongoose = require('mongoose');

const adminschema = new mongoose.Schema({
  branchCode: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
    required: true,
  },
  managerName: {
    type: String,
    required: true,
  },
});

const Branch = mongoose.model('Branches', adminschema);

module.exports = Branch;
