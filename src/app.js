const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./routes/userRoutes');
const treeRoutes = require('./routes/treeRoutes');
const { specs } = require('./swagger');
const { ensureDbConnected, getDbStatus } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/db-status', getDbStatus);
app.use('/api', ensureDbConnected);

app.use('/api/users', userRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route introuvable.' });
  }

  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Une erreur serveur est survenue.'
  });
});

module.exports = app;
