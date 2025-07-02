const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Token = sequelize.define('Token', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('access', 'refresh'),
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
    }, {
    tableName: 'blacklisted_tokens',
    timestamps: false,
    underscored: true
});

module.exports = Token;