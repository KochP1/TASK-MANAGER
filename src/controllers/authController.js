const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = require('../config/jwt');
const User = require('../models/user')
const Token = require('../models/token')
const AuthService = require('../services/authService');
const authService = new AuthService();

// REGISTER

const register = async (req, res) => {
    try {
        const {name, lastName, email, password, role} = req.body
        const user = await User.create({name, lastName, email, password, role})
        res.status(201).json({message: 'Usuario registrado', usuarioId: user.id})
    } catch (err) {
        console.error('Error detallado:', err);
        res.status(400).json({
            error: 'Error al registrar usuario'
        })
    }
};

// LOGIN

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Credenciales inválidas' });

        // Generar tokens
        const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// LOGOUT
const logout = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        
        if (!token) {
        return res.status(400).json({ error: 'Token no proporcionado' });
        }


        const decoded = jwt.decode(token);
        

        await Token.create({
        token,
        type: 'access',
        expiresAt: new Date(decoded.exp * 1000) // Convertir timestamp a Date
        });

        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al cerrar sesión', details: err.message });
    }
};

// PUT user

const update_user = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await authService.update(id, req.body)
        res.status(200).json({message: 'Usuario editado', userId: user.id})
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Error al editar usuario'})
    }
}

// DELETE user

const delete_user = async (req, res) => {
    try {
        const { id } = req.params;
        await authService.delete(id);
        return res.status(200).json({message: 'Usuario eliminado'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al eliminar usuario'})
    }
}

module.exports = { register, login, logout, delete_user, update_user };