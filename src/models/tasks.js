const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed')
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATE,
        field: 'due_date',
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'tasks',
    timestamps: false,
    underscored: false
});

module.exports = Task;