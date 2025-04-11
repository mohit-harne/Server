// api/addUser.js

import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testingdatabase',
  });
};

const userSchema = new mongoose.Schema({
  first_name: String,
  email: String,
  phone: String,
  dob: Date,
  address: String,
  gender: String,
  blood_group: String,
  languages_known: [String],
  role: String,
  status: String,
  image: String,
}, { collection: 'testingcollections' });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
}
