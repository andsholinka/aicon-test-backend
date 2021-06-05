const {
    verifySignUp
} = require("../middlewares");
const {
    authJwt
} = require("../middlewares");

const Router = require('express').Router();
const User = require('../controllers/user.controller');

Router.post('/register', verifySignUp.checkDuplicateUsernameOrEmail, User.register)
    .post('/login', User.login)
    .delete('/logout', authJwt.verifyTokenUser, User.logout)
    .put('/user', authJwt.verifyTokenUser, User.updateUserData)
    .put('/user/password', authJwt.verifyTokenUser, User.changePassword)
    .post('/ticket', authJwt.verifyTokenUser, User.createTicket)

module.exports = Router;