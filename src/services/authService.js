const User = require('../models/user');
const Token = require('../models/token')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    async saveRefreshToken (userId, token) {
        await Token.create({
            token: token,
            type: 'refresh',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            user_id: userId,
        });
    };

    async saveJwtToken (token, time) {
        await Token.create({
            token: token,
            type: 'access',
            expiresAt: new Date(time * 1000)
        });
    };

    async createJwt(id) {
        const accessToken = jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        return accessToken
    }


    async refreshToken(refreshToken) {
        try {
            const verify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const tokenValido = await Token.findOne({
                where: {
                    token: refreshToken.trim(),
                    expiresAt: { [Op.gt]: new Date() },
                    user_id: verify.userId,
                }
            });

            if (!tokenValido) throw new Error('Refresh token inválido');

            return createJwt(verify.userId);
        } catch (error) {
            throw new Error('Token de refresco inválido');
        }
    }

    async logout(token) {
            
        if (!token) {
            throw new Error('Token no encontrado')
        }

        const decoded = jwt.decode(token);
            
        return await this.saveJwtToken(token, decoded.exp)
    }
}

module.exports = AuthService;