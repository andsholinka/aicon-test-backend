const db = require("../models");
// const ROLES = db.ROLES;
const User = db.user;
const Admin = db.admin;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }

        if (user) {
            res.status(400).send({
                status: res.statusCode,
                message: "Failed! Username is already in use!"
            });
            return;
        }

        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }

            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }

            next();
        });
    });
};

checkDuplicateUsernameAdmin = (req, res, next) => {
    // Username
    Admin.findOne({
        username: req.body.username
    }).exec((err, admin) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }

        if (admin) {
            res.status(400).send({
                status: res.statusCode,
                message: "Failed! Username is already in use!"
            });
            return;
        }

        next();
        // });
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkDuplicateUsernameAdmin
};

module.exports = verifySignUp;