const UserModel = require('../../models/user');
const { checkPassword } = require('../../utils/bcrypt');
const { jwtSign } = require("../../config/jwtConfig");
const {hashPassword} = require("../../utils/bcrypt");


exports.signIn = async (req, res) => {
    if (!req.body) return res.status(400).json({msg: 'BAD RESQUEST BODY IS REQUIRED'})
    try {
        const {email, password} = req.body
        const user = await UserModel.findOne({where: {email}})
        if (user.dataValues.email !== email || !checkPassword(password, user.password)) {
            return res.status(400).json({msg: 'BAD REQUEST PASSWORD OR EMAIL NOT VALID'})
        }
        const token = await jwtSign({id: user.id, email: user.email})
        const uUser = await UserModel.update({token}, {where: {id: user.id}})
        console.log(uUser)
        return res.status(200).json({msg: 'OK', user: {...user.dataValues, token}})
    } catch (e) {
        return res.status(400).json({msg: 'BAD REQUEST'})
    }
}
exports.signUp = async (req,res) => {
    const { email, password,} = req.body
    try {
        const user = await userModel.create({
            email,
            password: hashPassword(password),
        })
        if (!user.id){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', user: user.dataValues})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST ' + e.message})
    }
}
