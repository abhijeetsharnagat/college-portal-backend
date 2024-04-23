//server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
// In your main server file (e.g., app.js or server.js)
app.use('/upload', express.static('uploads'));

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});