import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/myapp';

mongoose.connect(MONGO_URL).then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  languages_known: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const userModel = mongoose.model('testingcollections', userSchema); // ✅ correct usage

app.get('/getUsers', async (req, res) => {
  try {
    const userData = await userModel.find();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
