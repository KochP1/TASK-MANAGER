const Task = require('../models/tasks');

class TaskService {
    async create(title, description, user_id, project_id, due_date) {
        if (!title || !description || !user_id || !project_id || !due_date) {
            throw new Error ('Faltan campos');
        }

        if (!user_id || !project_id || !due_date) {
            throw new Error ('Faltan campos');
        }

        return await Task.create({
            title,
            description,
            user_id,
            project_id,
            due_date
        })
    }

    async update(id, updates) {
        const task = await this.getById(id);
        return await task.update(updates);
    }

    async updateProgress(id, newProgress) {
        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (!validStatuses.includes(newProgress)) {
            throw new Error(`Estado inválido. Usar: ${validStatuses.join(', ')}`);
        }

        const task = await Task.findByPk(id);
        return await task.update(newProgress)
    }

    async delete(id) {
        const task = await this.getById(id);
        await task.destroy();
        return {message: 'Tarea eliminada'}
    }

    async getById(id) {
        const task = await Task.findByPk(id);
        if (!task) throw new Error('Proyecto no econtrado')
        return task;
    }

    async getAllByProject(project_id, user) {
        return await Task.findAll({
            where: {project_id: project_id, user_id: user},
            order: [['due_date', 'DESC']]
        });
    }

    async getByProject(project_id) {
        return await Task.findAll({
            where: {project_id: project_id},
            order: [['due_date', 'DESC']]
        });
    }
}

module.exports = TaskService;