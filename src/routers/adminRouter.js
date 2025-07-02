const express = require('express');
const router = express.Router();
const { createProject, createTask, deleteProject, deleteTask } = require('../controllers/projectsController');

router.post('/create_project', createProject);
router.delete('/delete_project/:id', deleteProject);
router.post('/create_task', createTask);
router.delete('/delete_task/:id', deleteTask)

module.exports = router;
