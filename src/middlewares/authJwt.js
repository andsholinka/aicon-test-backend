require('dotenv').config();
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Admin = db.admin;

verifyTokenUser = (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token) return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

        jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
            if (err) return res.status(401).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

            const user = await User.findById(decoded.id)
            if (user.token == token) {
                // if (decoded.isVerified == true) {
                req.user = decoded;
                next();
                // } else {
                //     res.status(200).send({
                //         status: res.statusCode,
                //         message: "your account has not been verified, please contact the admin",
                //     })
                // }
            } else {
                res.status(200).send({
                    status: res.statusCode,
                    message: "invalid token",
                })
            }

        });
    } catch (error) {
        res.status(401).send({
            status: res.statusCode,
            message: "has no authority",
        })
    }
};

verifyTokenAdmin = (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token) return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

        jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
            if (err) return res.status(401).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

            const admin = await Admin.findById(decoded.id)
            if (admin) {
                req.user = decoded;
                next();
            } else {
                res.status(401).send({
                    status: res.statusCode,
                    message: "Require Admin Role!",
                })
            }
        });
    } catch (error) {
        res.status(401).send({
            status: res.statusCode,
            message: "has no authority",
        })
    }
};

const authJwt = {
    verifyTokenUser,
    verifyTokenAdmin
};
module.exports = authJwt;