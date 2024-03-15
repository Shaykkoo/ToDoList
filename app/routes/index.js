module.exports = (app) => {
    require('./user')(app)
    require('./todolist')(app)
    require('./todoitem')(app)
    require('./auth')(app)
}