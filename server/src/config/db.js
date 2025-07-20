require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);


sequelize.authenticate()
    .then(() => console.log('Conexión a BD exitosa'))
    .catch(err => console.error('Error de conexión a BD:', err));

module.exports = sequelize;