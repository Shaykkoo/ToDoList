
const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db'),
      TodolistModel = require('../todolist')

const ToDoItem = sequelize.define('Todoitem', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            allowNull: false,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TodolistModel,
                key: 'id'
            }
        },
    }, {timestamps: true})

ToDoItem.belongsTo(TodolistModel, {
    foreignKey: 'listId',
    as: 'todoitem_belongsTo_todolist'
})

TodolistModel.hasMany(ToDoItem, {
    foreignKey: 'listId',
    as: 'todolist_has_one_todoitem'
})

module.exports = ToDoItem