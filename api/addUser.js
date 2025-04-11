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
  user_code: {
    type: String,
    unique: true,
    
  },
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

    // Parse body if necessary
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      body = JSON.parse(data);
    }

    // ✅ Generate user_code if missing
    if (!body.user_code) {
      body.user_code = `USR_${Date.now()}`;
    }

    const newUser = new User(body);
    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
}
