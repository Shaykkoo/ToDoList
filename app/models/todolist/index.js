const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db'),
      UserModel = require('../user')

const ToDoList = sequelize.define('Todolist', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            allowNull: false,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
    }, {timestamps: true})

ToDoList.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'list_belongsTo_user'
})

UserModel.hasMany(ToDoList, {
    foreignKey: 'userId',
    as: 'user_has_one_list'
})



module.exports = ToDoList


