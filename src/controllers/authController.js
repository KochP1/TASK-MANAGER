const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = require('../config/jwt');
const User = require('../models/user')

// REGISTER
const register = async (req, res) => {
    try {
        const {name, lastName, email, password, role} = req.body
        const user = await User.create({name, lastName, email, password, role})
        res.status(201).json({message: 'Usuario registrado', usuarioId: user.id})
    } catch (err) {
        console.error('Error detallado:', err); // ← Agrega esto para debug
        res.status(400).json({
            error: 'Error al registrar usuario',
            details: err.errors?.map(e => e.message) || err.message
        })
    }
};

module.exports = {register}