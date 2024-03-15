const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const jwtSign = async (payload) => {
    try{
        return jwt.sign(payload, process.env.SECRET_PASS, {
            expiresIn: '1d'
        })
    } catch (e) {
        return e.message
    }
}


const jwtVerify = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_PASS);
        if (decoded.exp < Date.now() / 1000) {
            return false // token expiré
        }
        const user = await UserModel.findByPk(decoded.id)
        if (user.dataValues.token !== token) {
            return false
        }
        return true
    } catch (e) {
        console.log(e.message)
        return false
    }
}

const checkIsAuth = async (req, res, next) => {
    try {
        if(req.originalUrl.includes(process.env.API_PATH)) {
            const authHeader = req.headers['authorization']
            const token = authHeader.split(" ")[1]
            const isValid = await jwtVerify(token)
            if (!isValid){
                return res.status(401).json({msg: 'Unauthorized'})
            }
            next()
        } else {
            next
        }
    } catch (e) {
        console.log(e.message)
        return res.status(400).json({msg: 'BAD REQUEST'})
    }
}

module.exports = {
    jwtSign,
    jwtVerify,
    checkIsAuth
}