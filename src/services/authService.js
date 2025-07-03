const User = require('../models/user')

class AuthService {
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