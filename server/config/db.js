const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/essamco';

  try {
    console.log('[MongoDB] Connecting to primary database (MongoDB Atlas)...');
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected successfully to Atlas host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
  } catch (atlasError) {
    console.warn(`[MongoDB Notice] Atlas connection failed (${atlasError.message.substring(0, 80)}...).`);
    console.log(`[MongoDB] Falling back to local MongoDB: ${localUri}`);
    try {
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[MongoDB] Connected successfully to local database: ${conn.connection.host}/${conn.connection.name}`);
    } catch (localError) {
      console.error(`[MongoDB Error] Failed to connect to local database: ${localError.message}`);
      console.warn('[MongoDB] Running server in offline-database mode.');
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection lost. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB Event Error]', err);
});

module.exports = connectDB;
