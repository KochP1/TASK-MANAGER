const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProjects = sequelize.define('UserProjects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assigned_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_projects',
    timestamps: false,
    underscored: false
})

module.exports = UserProjects