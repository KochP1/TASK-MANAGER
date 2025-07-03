const ProjectService = require('../services/projectService');
const projectService = new ProjectService();

const TaskService = require('../services/taskService');
const taskService = new TaskService();

// POST project

const createProject = async (req, res) => {
    try {
        const project = await projectService.create(
            req.body.name, 
            req.body.description, 
            req.body.admin_id
        );
        res.status(201).json({message: 'Proyecto creado', projectId: project.id});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT project

const editProject = async (req, res) => {
    try {
        const project = await projectService.update(
            req.params.id,
            req.body
        );
        res.json({message: 'Proyecto actualizado', projectId: project.id});
    } catch (err) {
        res.status(err.message.includes('no encontrad') ? 404 : 400).json({ error: err.message });
    }
};

// DELETE project

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        await projectService.delete(id);
        res.status(200).json({message: 'Proyecto eliminado'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al eliminar proyecto'});
    }
}


// POST TASK

const createTask = async (req, res) => {
    
    try {
        const task = await taskService.create(
            req.body.title, 
            req.body.description, 
            req.body.user_id,
            req.body.project_id,
            req.body.due_date
        );
        res.status(201).json({message: 'Tarea creado', taskId: task.id});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// PUT task

const editTask = async (req, res) => {
    try {
        const task = await taskService.update(
            req.params.id,
            req.body
        );
        res.json({message: 'Tarea actualizado', taskId: task.id});
    } catch (err) {
        res.status(err.message.includes('no encontrado') ? 404 : 400).json({ error: err.message });
    }
}

// DELETE task

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        await taskService.delete(id);
        res.status(200).json({message: 'Tarea eliminado'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al eliminar tarea'});
    }
}

module.exports = { createProject, createTask, deleteProject, deleteTask, editProject, editTask }