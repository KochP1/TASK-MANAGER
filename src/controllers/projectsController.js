const Project = require('../models/projects')
const Task = require('../models/tasks');

// POST project

const createProject = async (req, res) => {
    try {
        const { name, description, admin_id} = req.body;
        const project = await Project.create({ name, description, admin_id})
        res.status(200).json({message: 'Proyecto creado', proyecto_id: project.id})
    } catch(err) {
        console.error(err);
        res.status(400).json({error: 'Error al crear proyecto'})
    }
}

// DELETE project

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id)

        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        await project.destroy();
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

module.exports = { createProject, createTask, deleteProject, deleteTask }