const express = require('express');
const router = express.Router();
const { createProject, createTask } = require('../controllers/projectsController');

router.post('/create_project', createProject);
router.post('/create_task', createTask)

module.exports = router;
