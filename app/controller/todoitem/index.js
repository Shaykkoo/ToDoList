const jwt = require('jsonwebtoken');
const todoitemModel = require('../../models/todoitem')
const UserModel = require('../../models/user')




exports.getAll = async (req, res) => {
    return res.status(200).json({ msg: 'OK', todoitems: await todoitemModel.findAll()})
}

exports.create = async (req, res) => {
    // get body content of request
    const { description, status, listId} = req.body
    try {
        const todoitem = await todoitemModel.create({
            description,
            status,
            listId,
        })
        if (!todoitem.id){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', todoitem: todoitem.dataValues})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST ' + e.message})
    }
}

exports.update = async (req, res) => {
    try {
        if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
        if (!req.body) return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED'})
        const { description, status, userId } = req.body
        const { uuid } = req.params
        const todoitem = await todoitemModel.update({
            description,
            status,
            userId
        }, {where: { id: uuid}})
        return res.status(200).json({ msg: 'OK', todoitem})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.delete = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        const todoitem = await todoitemModel.destroy( {where: { id: uuid}})
        console.log(todoitem)
        if (!todoitem){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK'})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.getById = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        // const todoitem = await todoitemModel.findByPk(uuid)
        const todoitem = await todoitemModel.findOne({
            include: [
                {
                association: 'todoitem_belongsTo_user', // alias = as
                attributes: { exclude: [ 'createdAt', 'updatedAt', 'password' ] }
            }
            ],
            where: {id: uuid},
            attributes: {
                exclude: [
                    'createdAt'
                ]
            }
        })
        console.log(todoitem.dataValues)
        if (!todoitem){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', todoitem: todoitem.dataValues})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}
