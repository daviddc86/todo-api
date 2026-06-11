const mongoose = require('mongoose');

/**
 * Conecta a MongoDB usando la URI del entorno.
 * Lanza error si la conexión falla para que el proceso termine.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
