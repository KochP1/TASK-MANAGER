const Project = require('../models/projects');

class ProjectService {
    async create(name, description, adminId) {
        if (!name || !adminId) {
            throw new Error('Nombre y adminId son requeridos');
        }
        
        return await Project.create({ 
            name, 
            description, 
            admin_id: adminId 
        });
    }

    async update(id, updates) {
        const project = await this.getById(id);
        return await project.update(updates);
    }

    async delete(id) {
        const project = await this.getById(id);
        await project.destroy();
        return { message: 'Proyecto eliminado' };
    }

    async getById(id) {
        const project = await Project.findByPk(id);
        if (!project) throw new Error('Proyecto no encontrado');
        return project;
    }

    async getAllByAdmin(adminId) {
        return await Project.findAll({ 
            where: { admin_id: adminId },
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = ProjectService;