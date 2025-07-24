require('dotenv').config();
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

        if (!email || !password) {
            return res.status(400).json({error: 'Faltan campos'})
        }

        const user = await authService.login(email, password)

        const accessToken = await authService.createJwt(user.id)
        const refreshToken = await authService.createRefreshToken(user.id);

        await authService.saveRefreshToken(user.id, refreshToken);


        res.json({ accessToken, refreshToken, user });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refresh } = req.body;
        
        if (!refresh) {
            return res.status(400).json({ error: 'Refresh token requerido' });
        }

        const token = await authService.refreshToken(refresh);
        res.json({ jwt: token });

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Token inválido' });
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

        await authService.logout(token)
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

const update_password = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await authService.updatePassword(id, req.body.currentPassword, req.body.newPassword)
        res.status(200).json({message: 'Contraseña editado', userId: user.id})

    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Error al editar contraseña'})
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

module.exports = { register, login, logout, delete_user, update_user, list_users, get_user_by_id, update_password, refreshAccessToken };