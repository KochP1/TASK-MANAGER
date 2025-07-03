require('dotenv').config();
const jwt = require('jsonwebtoken');
const Token = require('../models/token')

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido' });
    }

    try {
        // Verificar si el token está en la lista negra
        const isBlacklisted = await Token.findOne({ where: { token } });
        if (isBlacklisted) {
        return res.status(401).json({ error: 'Token inválido (sesión cerrada)' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = authenticate;