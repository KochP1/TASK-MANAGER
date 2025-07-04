const Project = require('../models/projects');
const UserProjects = require('../models/user-projects');

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

    async assignProject(user_id, project_id) {
        if (!user_id || !project_id) {
            throw new Error('Faltan campos');
        }

        return await UserProjects.create({
            user_id,
            project_id
        });
    }

    async updateAssignProject(id, updates) {

        const assign = await UserProjects.findByPk(id);

        return await assign.update(updates);
    }

    async getById(id) {
        const project = await Project.findByPk(id);
        if (!project) throw new Error('Proyecto no encontrado');
        return project;
    }

    async getAllByAdmin(adminId) {
        return await Project.findAll({ 
            where: { admin_id: adminId },
            order: [['created_at', 'DESC']]
        });
    }

    async getByAdmin(adminId, projectName) {
        return await Project.findOne({ 
            where: { admin_id: adminId, name: projectName},
        });
    }
}

module.exports = ProjectService;