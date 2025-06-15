const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/ratings', ratingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
