require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user')
const Token = require('../models/token')
const AuthService = require('../services/authService');
const authService = new AuthService();

// REGISTER

const register = async (req, res) => {
    try {
        const user = authService.create(req.body.name, req.body.lastName, req.body.email, req.body.password, req.body.role)
        res.status(201).json({message: 'Usuario registrado', usuarioId: user.id})
    } catch (err) {
        console.error('Error detallado:', err);
        res.status(500).json({
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
        const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

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

// GET user

const list_users = async (req, res) => {
    try {
        const users = await authService.listUsers();
        if (!users) {
            return res.status(404).json({error: 'No se encontraron usuarios'});
        }

        return res.json(users)

    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Error al obtener usuarios'});
    }
}

const get_user_by_id = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authService.getUser(id)

        if (!user) {
            return res.status(404).json({error: 'No se encontraron el usuario'});
        }

        return res.json(user)

    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Error al obtener usuarios'});
    }
}

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

module.exports = { register, login, logout, delete_user, update_user, list_users, get_user_by_id };