// api/deleteUser.js

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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Get ID from query params
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: 'User ID is required' });

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}
