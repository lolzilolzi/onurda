const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ✅ Serve static files from the correct folder
app.use(express.static(path.join(__dirname, 'onur', 'public')));

// 🔁 Redirect "/" to index.html explicitly (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'onur', 'public', 'index.html'));
});

const client = new MongoClient(process.env.MONGO_URI);
let messages;

async function startServer() {
  try {
    await client.connect();
    const db = client.db('onurBirthday');
    messages = db.collection('messages');
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

startServer();

// 📬 POST route
app.post('/api/messages', async (req, res) => {
  const { ad, mesaj } = req.body;
  if (!ad || !mesaj) return res.status(400).json({ error: 'Missing fields' });
  await messages.insertOne({ ad, mesaj, date: new Date() });
  res.json({ success: true });
});

// 📤 GET route
app.get('/api/messages', async (req, res) => {
  const allMessages = await messages.find().sort({ date: -1 }).toArray();
  res.json(allMessages);
});
