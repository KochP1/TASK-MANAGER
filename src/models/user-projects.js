const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProjects = sequelize.define('UserProjects', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assigned_at: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user-projects',
    timestamps: false,
    underscored: false
})

module.export = UserProjects