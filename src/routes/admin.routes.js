const {
    verifySignUp
} = require("../middlewares");
const {
    authJwt
} = require("../middlewares");
const {
    logAdmin
} = require("../middlewares");

const Router = require('express').Router();
const Admin = require('../controllers/admin.controller');

Router.post('/register', verifySignUp.checkDuplicateUsernameAdmin, Admin.register)
    .post('/login', Admin.login)
    .delete('/logout', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.logout)
    .get('/users', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.getAllDataUsers)
    .get('/user/:data', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.searchUser)
    .post('/user/status/:data', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.changeStatusUser)
    .post('/user/verified/:data', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.verifiedUser)
    .post('/user/level/:data', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.changeLevelUser)

    .post('/occupation', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.createOccupation)
    .post('/category', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.createCategory)

    .post('/ticket/status/:id', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.changeStatusTicket)
    .get('/ticket', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.searchTicketByQuery)
    .get('/ticket/time', authJwt.verifyTokenAdmin, logAdmin.hitAPI, Admin.searchTicketByRangeTime)



module.exports = Router;