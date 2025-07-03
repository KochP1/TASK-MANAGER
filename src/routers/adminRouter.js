const express = require('express');
const router = express.Router();
const { createProject, createTask, deleteProject, deleteTask, editProject, editTask } = require('../controllers/projectsController');

router.post('/create_project', createProject);
router.put('/edit_project/:id', editProject);
router.delete('/delete_project/:id', deleteProject);

router.post('/create_task', createTask);
router.put('/edit_task/:id', editTask);
router.delete('/delete_task/:id', deleteTask);

module.exports = router;
