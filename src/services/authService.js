const User = require('../models/user');
const bcrypt = require('bcryptjs');

class AuthService {
    async create(name, lastName, email, password, role) {
        if (!name || !lastName || !email || !password || !role) {
            throw new Error('Faltan campos');
        }

        return await User.create({
            name,
            lastName,
            email,
            password,
            role
        })
    }

    async listUsers() {
        return await User.findAll();
    }

    async getUser(id) {
        const user = await User.findByPk(id);
        return user;
    }
    async update(id, updates) {
        if (updates.password) {
        throw new Error('Password updates not allowed here');
        }

        const user = await User.findByPk(id);
        return await user.update(updates)
    }

    async updatePassword(userId, currentPassword, newPassword) {
        try {
            if (!currentPassword || !newPassword) {
                throw new Error('Debes proporcionar la contraseña actual y la nueva');
            }

            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Contraseña actual incorrecta');
            }

            if (currentPassword === newPassword) {
                throw new Error('La nueva contraseña debe ser diferente a la actual');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });

            return { message: 'Contraseña actualizada exitosamente' };
        } catch (err) {
            console.error('Error en updatePassword:', err);
            throw err;
        }
    }

    async delete(id) {
        const user = await User.findByPk(id);
        return user.destroy();
    }
}

module.exports = AuthService;