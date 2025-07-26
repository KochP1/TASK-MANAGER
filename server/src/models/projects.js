const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UserProjects = require('./user-projects');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'projects',
    timestamps: false,
    underscored: false
});

module.exports = Project;