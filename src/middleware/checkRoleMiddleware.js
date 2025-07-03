const User = require('../models/user');

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
        // 1. Obtener usuario de la base de datos (incluyendo su rol actualizado)
        const user = await User.findByPk(req.userId); // req.userId viene del middleware de autenticación
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Verificar rol (puedes usar jerarquías: admin > manager > user)
        if (user.role !== requiredRole) {
            return res.status(403).json({ error: 'Acceso no autorizado para tu rol' });
        }

        // 3. Adjuntar datos del usuario al request para uso posterior
        req.userData = {
            id: user.id,
            role: user.role,
            email: user.email
        };

        next();
        } catch (err) {
        console.error('Error en checkRole:', err);
        res.status(500).json({ error: 'Error al verificar rol' });
        }
    };
};

module.exports = checkRole;