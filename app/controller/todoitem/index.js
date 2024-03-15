const jwt = require('jsonwebtoken');
const todoitemModel = require('../../models/todoitem')
const UserModel = require('../../models/user')




exports.getAll = async (req, res) => {
    return res.status(200).json({ msg: 'OK', todoitems: await todoitemModel.findAll()})
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
            const { nom, price, quantity,contenu} = req.body
            try {
                const todoitem = await todoitemModel.create({
                    nom,
                    contenu,
                    dateCreation: currentDateYear,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    userId:decoded.id
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
          });
      } else {
          res.status(401).json({ error: 'Token manquant dans le header d\'autorisation'});
      }
}

exports.update = async (req, res) => {
    try {
        if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
        if (!req.body) return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED'})
        const { nom, price, quantity,contenu,dateCreation, userId } = req.body
        const { uuid } = req.params
        const todoitem = await todoitemModel.update({
            nom,
            contenu,
            dateCreation,
            price: parseFloat(price),
            quantity: parseInt(quantity),
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
