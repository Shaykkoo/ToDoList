const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db');

const User = sequelize.define('User', {
        id : {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true
        },

    }, ({timestamps: true})
);

module.exports = User