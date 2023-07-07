const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('MongoDB Atlas connected successfully!');
  } catch (error) {
    console.log('Error connecting to MongoDB Atlas: ', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


