const User = require('../models/user');

const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Convierte requiredRoles a array si es un string
            const allowedRoles = Array.isArray(requiredRoles) 
                ? requiredRoles 
                : [requiredRoles];

            // Verifica si el rol del usuario está en los permitidos
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ 
                    error: `Acceso no autorizado. Rol requerido: ${allowedRoles.join(' o ')}`,
                    yourRole: user.role // Para debugging
                });
            }

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