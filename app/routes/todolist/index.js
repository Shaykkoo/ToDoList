const todoRoute = require('express').Router(),
    todoController = require('../../controller/todolist');
    const {checkIsAuth} = require("../../config/jwtConfig");

module.exports = (app) => {
    todoRoute.get('/todolists', checkIsAuth, todoController.getAll)
    todoRoute.post('/todolist', checkIsAuth, todoController.create)
    todoRoute.put('/todolist/:uuid', checkIsAuth, todoController.update)
    todoRoute.delete('/todolist/:uuid', checkIsAuth, todoController.delete)
    todoRoute.get('/todolist/:uuid', checkIsAuth, todoController.getById)
    app.use('/api/v1', todoRoute)
}