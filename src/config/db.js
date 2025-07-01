// src/config/db.js
require('dotenv').config(); // Carga las variables de .env
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nombre de la BD
    process.env.DB_USER,     // Usuario
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Para no ver mensajes SQL en consola
    }
);

// Verificar conexión
sequelize.authenticate()
    .then(() => console.log('Conexión a BD exitosa'))
    .catch(err => console.error('Error de conexión a BD:', err));

module.exports = sequelize;