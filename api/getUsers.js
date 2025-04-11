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
  try {
    await connectDB();
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
