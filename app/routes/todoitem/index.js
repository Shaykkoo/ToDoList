const todoitemRoute = require('express').Router(),
    todoitemController = require('../../controller/todoitem');
    const {checkIsAuth} = require("../../config/jwtConfig");

module.exports = (app) => {
    todoitemRoute.get('/todoitemlists', checkIsAuth, todoitemController.getAll)
    todoitemRoute.post('/todoitemlist', checkIsAuth, todoitemController.create)
    todoitemRoute.put('/todoitemlist/:uuid', checkIsAuth, todoitemController.update)
    todoitemRoute.delete('/todoitemlist/:uuid', checkIsAuth, todoitemController.delete)
    todoitemRoute.get('/todoitemlist/:uuid', checkIsAuth, todoitemController.getById)
        app.use('/api/v1', todoitemRoute)
}