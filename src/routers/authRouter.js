const express = require('express')
const router = express.Router();
const { register, login, logout, delete_user, update_user, list_users, get_user_by_id } = require('../controllers/authController')
const authenticate = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/list_users', authenticate, checkRole('admin'), list_users)
router.get('/get_user/:id', authenticate, checkRole('admin'), get_user_by_id)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout)
router.delete('/delete_user/:id', authenticate, checkRole('admin'), delete_user)
router.put('/update_user/:id', authenticate, checkRole('admin'), update_user)

module.exports = router;