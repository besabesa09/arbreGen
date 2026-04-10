const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

async function connectDb() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('❌ Erreur MongoDB: variable MONGO_URI non definie');
    console.log('URI utilisee: Non definie');
    throw new Error('MONGO_URI is not defined');
  }

  return mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })
    .then(() => {
      console.log('✅ MongoDB connecte avec succes');
    })
    .catch((err) => {
      console.log('❌ Erreur MongoDB:', err.message);
      console.log('URI utilisee:', process.env.MONGO_URI ? 'Definie' : 'Non definie');
      throw err;
    });
}

function ensureDbConnected(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Base de donnees non connectee',
      status: mongoose.connection.readyState
    });
  }

  next();
}

function getDbStatus(req, res) {
  const stateLabels = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.json({
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    state: stateLabels[mongoose.connection.readyState] || 'unknown'
  });
}

module.exports = {
  connectDb,
  ensureDbConnected,
  getDbStatus
};
