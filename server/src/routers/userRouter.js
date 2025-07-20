const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { getTasksByProject, editTaskProgress } = require('../controllers/projectsController')

// TASKS

router.get('/get_tasks_by_projects/:id', authenticate, checkRole(['admin', 'user']), getTasksByProject);
router.patch('/update_task_progress/:id', authenticate, checkRole(['admin', 'user']), editTaskProgress);

module.exports = router;