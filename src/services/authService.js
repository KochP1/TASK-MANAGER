const User = require('../models/user')

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
        const user = await User.findByPk(id);
        return await user.update(updates)
    }

    async delete(id) {
        const user = await User.findByPk(id);
        return user.destroy();
    }
}

module.exports = AuthService;