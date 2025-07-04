const express = require('express');
const router = express.Router();
const { createProject, createTask, deleteProject, deleteTask, editProject, editTask, getProject, getOneProject, assign_project, update_assign_project } = require('../controllers/projectsController');
const authenticate = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// projects
router.get('/get_project/:id', authenticate, checkRole('admin'), getProject);
router.get('/get_especific_project/:id', authenticate, checkRole('admin'), getOneProject);
router.post('/create_project', authenticate, checkRole('admin') , createProject);
router.post('/assgin_project/:user_id/:project_id', authenticate, checkRole('admin'), assign_project);

router.put('/update_assign_project/:id', authenticate, checkRole('admin'), update_assign_project);

router.put('/edit_project/:id', authenticate, checkRole('admin') , editProject);
router.delete('/delete_project/:id', authenticate, checkRole('admin') , deleteProject);

// tasks
router.post('/create_task', authenticate, checkRole('admin'), createTask);
router.put('/edit_task/:id', authenticate, checkRole('admin'), editTask);
router.delete('/delete_task/:id', authenticate, checkRole('admin'), deleteTask);

module.exports = router;
