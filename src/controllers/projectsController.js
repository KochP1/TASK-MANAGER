const Task = require('../models/tasks');
const ProjectService = require('../services/projectService');
const projectService = new ProjectService();

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
        const { title, description, status, user_id, project_id, due_date } = req.body;
        const task = await Task.create({ title, description, status, user_id, project_id, due_date });
        res.status(200).json({message: 'Tarea creada', tarea: task.id});
    } catch (err) {
        console.error(err);
        res.status(400).json({error: 'Error al crear tarea'});
    }
}

// PUT task

const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, user_id, project_id, due_date } = req.body;
        
        const task = await Task.findByPk(id);

        if (!task) {
            res.status(404).json({error: 'Tarea no encontrada'});
        }

        await task.update({title: title, description: description, status: status, user_id: user_id, project_id: project_id, due_date: due_date})
        res.status(200).json({message: 'Tarea actualizada'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al editar la tarea'});
    }
}

// DELETE task

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            res.status(400).json({error: 'Tarea no encontrada'});
        }
        await task.destroy();
        res.status(200).json({message: 'Tarea eliminada'})
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Error al eliminar tarea'});
    }
}

module.exports = { createProject, createTask, deleteProject, deleteTask, editProject, editTask }