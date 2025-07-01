const sequelize = require('./config/db');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Todo funciona!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Fallo:', err);
        process.exit(1);
    }
}

testConnection();