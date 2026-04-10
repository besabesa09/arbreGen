require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const { connectDb } = require('./config/db');

const PORT = process.env.PORT || 3000;
let server;

async function start() {
  try {
    await connectDb();
    server = app.listen(PORT, () => {
      console.log(`ArbreGen server running on http://localhost:${PORT}`);
      console.log(`Swagger docs available on http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.connection.close();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
