const todoitemRoute = require('express').Router(),
    todoitemController = require('../../controller/todoitem');
    const {checkIsAuth} = require("../../config/jwtConfig");

module.exports = (app) => {
    todoitemRoute.get('/todoitems', checkIsAuth, todoitemController.getAll)
    todoitemRoute.post('/todoitem', checkIsAuth, todoitemController.create)
    todoitemRoute.put('/todoitem/:uuid', checkIsAuth, todoitemController.update)
    todoitemRoute.delete('/todoitem/:uuid', checkIsAuth, todoitemController.delete)
    todoitemRoute.get('/todoitem/:uuid', checkIsAuth, todoitemController.getById)
        app.use('/api/v1', todoitemRoute)
}