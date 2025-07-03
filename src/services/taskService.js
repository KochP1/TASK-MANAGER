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
}

module.exports = TaskService;