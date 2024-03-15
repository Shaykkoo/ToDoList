const jwt = require('jsonwebtoken');
const todolistModel = require('../../models/todolist')
const todoitemModel = require('../../models/todoitem')

const UserModel = require('../../models/user')

exports.getAll = async (req, res) => {
    return res.status(200).json({ msg: 'OK', todolists: await todolistModel.findAll(), todoitems: await todoitemModel.findOne()})
}

exports.create = async (req, res) => {
    // get body content of request
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; // Extraction du token à partir du header d'autorisation

    if (token) {
        req.token = token;
        console.log(token) // Ajout du token à l'objet req pour le rendre disponible dans les routes suivantes
    }

      // Vérifier et décoder le token


      if (token) {
          jwt.verify(token, process.env.SECRET_PASS,async (err, decoded) => {
              if (err) {
                  res.status(401).json({ error: 'Token invalide' });
              } else {
                  // Le token est valide, vous pouvez accéder aux informations décryptées dans l'objet 'decoded'
                  console.log(decoded.id)
                  // get body content of request
            const { nom } = req.body
            try {
                const todolist = await todolistModel.create({
                    nom,
                    userId:decoded.id
                })
                if (!todolist.id){
                    res.status(400).json({ msg: 'BAD REQUEST'})
                }
                return res.status(200).json({ msg: 'OK', todolist: todolist.dataValues})
            } catch (e) {
                console.error(e.message)
                res.status(400).json({ msg: 'BAD REQUEST ' + e.message})
            }
        }
    });
      } else {
          res.status(401).json({ error: 'Token manquant dans le header d\'autorisation'});
      }
}

exports.update = async (req, res) => {
    try {
        if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
        if (!req.body) return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED'})
        const { nom, userId } = req.body
        const { uuid } = req.params
        const todolist = await todolistModel.update({
            nom,
            userId
        }, {where: { id: uuid}})
        return res.status(200).json({ msg: 'OK', todolist})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.delete = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        const todolist = await todolistModel.destroy( {where: { id: uuid}})
        console.log(todolist)
        if (!todolist){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK'})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.getById = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        // const todolist = await todolistModel.findByPk(uuid)
        const todolist = await todolistModel.findOne({
            include: [
                {
                association: 'todolist_belongsTo_user', // alias = as
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
        console.log(todolist.dataValues)
        if (!todolist){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', todolist: todolist.dataValues})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}
