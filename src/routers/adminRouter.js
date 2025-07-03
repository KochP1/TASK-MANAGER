const express = require('express');
const router = express.Router();
const { createProject, createTask, deleteProject, deleteTask, editProject, editTask } = require('../controllers/projectsController');
const authenticate = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// projects
router.post('/create_project', authenticate, checkRole('admin') , createProject);
router.put('/edit_project/:id', authenticate, checkRole('admin') , editProject);
router.delete('/delete_project/:id', authenticate, checkRole('admin') , deleteProject);

// tasks
router.post('/create_task', authenticate, checkRole('admin'), createTask);
router.put('/edit_task/:id', authenticate, checkRole('admin'), editTask);
router.delete('/delete_task/:id', authenticate, checkRole('admin'), deleteTask);

module.exports = router;
