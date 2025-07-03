const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { getTasksByProject } = require('../controllers/projectsController')

// TASKS

router.get('/get_tasks_by_projects/:id', authenticate, checkRole(['admin', 'user']), getTasksByProject)

module.exports = router;