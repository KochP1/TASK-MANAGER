const ProjectService = require('../services/projectService');
const projectService = new ProjectService();

const TaskService = require('../services/taskService');
const taskService = new TaskService();

// GET project => id

const getProject = async (req, res) => {
    try {
        const { id } = req.params;

        const projects = await projectService.getAllByAdmin(id)

        if (!projects) {
            res.status(404).json({error: 'El proyecto no existe'});
        }

        res.status(200).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al buscar proyecto'});
    }
}

const getOneProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name} = req.body;

        const project = await projectService.getByAdmin(id, name);

        if (!project) {
            res.status(404).json({error: 'El proyecto no existe'});
        }

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al buscar proyecto'});

    }
}

const getProjectById = async (req, res) => {
    try {

        const { id } = req.params;

        const project = await projectService.getById(id);

        if (!project) {
            res.status(404).json({error: 'El proyecto no existe'});
        }

        res.json(project);

    } catch(error) {
        console.error(error);
        res.status(500).json({errror: 'Error al buscar proyecto'})
    }
}

const getAllProjects = async (req, res) => {
    try {

        const project = await projectService.getAll();

        if (!project) {
            res.status(404).json({error: 'No hay proyectos'});
        }

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al buscar proyecto'});
    }
}

const getProjectsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'ID de usuario es requerido' });
        }

        const userProjects = await projectService.getProjectsByUser(userId);
        
        if (!userProjects || userProjects.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron proyectos asignados a este usuario',
                code: 'NO_PROJECTS_FOUND'
            });
        }

        res.json(userProjects);
    } catch (err) {
        console.error('Error en getProjectsByUser:', err);
        res.status(500).json({ 
            error: 'Error al obtener proyectos del usuario',
            details: err.message 
        });
    }
};

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

// POST user-project

const assign_project = async (req, res) => {
    try {
        const { user_id, project_id } = req.params;
        
        const assign = await projectService.assignProject(user_id, project_id);
        res.status(200).json({message: 'Proyecto asignado', user: assign.user_id})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al asignar proyecto'});
    }
}

// PUT user-project

const update_assign_project = async (req, res) => {
    try {
        const { id } = req.params;
        const assign = await projectService.updateAssignProject(id, req.body);
        res.status(200).json({message: 'Asignacion de proyecto modificado'})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al modificar asignar proyecto'});
    }
}

// GET TASK

const getTasksByProject = async (req, res) => {
    try {
        const { id } = req.params;

        const tasks = await taskService.getAllByProject(id, req.userId)

        if (!tasks) {
            res.status(404).json({error: 'No hay tareas'});
        }

        res.json(tasks);
    } catch (err) {
        console.error(error);
        res.status(500).json({error: 'Error al buscar tareas'});
    }
}

const getTasks = async (req, res) => {
    try {
        const { id } = req.params;

        const tasks = await taskService.getByProject(id)

        if (!tasks) {
            res.status(404).json({error: 'No hay tareas'});
        }

        res.json(tasks);
    } catch (err) {
        console.error(error);
        res.status(500).json({error: 'Error al buscar tareas'});
    }
}

const getTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await taskService.getById(id)

        if (!task) {
            res.status(404).json({error: 'No hay tareas'});
        }

        res.json(task);
    } catch (err) {
        console.error(error);
        res.status(500).json({error: 'Error al buscar tareas'});
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

const editTaskProgress = async (req, res) => {
    try {
        const task = await taskService.updateProgress(
            req.params.id,
            req.body
        );
        res.json({message: 'Tarea actualizado', taskId: task.id});
    } catch (err) {
        console.error(err)
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

module.exports = { createProject, createTask, deleteProject, deleteTask, editProject, editTask, getProject, getOneProject, getTasksByProject, editTaskProgress, assign_project, update_assign_project, getProjectById, getTasks, getTask, getAllProjects, getProjectsByUser}