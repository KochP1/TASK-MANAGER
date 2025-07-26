const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { getTasksByProject, editTaskProgress, getProjectsByUser } = require('../controllers/projectsController')

router.get('/user_projects/:userId/projects', authenticate, checkRole(['admin', 'user']), getProjectsByUser);
// TASKS

router.get('/get_tasks_by_projects/:id', authenticate, checkRole(['admin', 'user']), getTasksByProject);
router.patch('/update_task_progress/:id', authenticate, checkRole(['admin', 'user']), editTaskProgress);

module.exports = router;