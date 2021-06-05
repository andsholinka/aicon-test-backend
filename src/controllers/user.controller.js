require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
const MUUID = require('uuid-mongodb');
const db = require("../models");
const User = db.user;
const Ticket = db.ticket;

class UserController {

    async register(req, res, next) {

        try {
            User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    fullName: req.body.fullName,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    DOB: moment(req.body.dob).format('YYYY-MM-DD'),
                    occupation: req.body.occupation,
                    address: req.body.address,
                    phone: req.body.phone,
                    isVerified: req.body.isVerified ? req.body.isVerified : false,
                })
                .then((data) => {
                    res.status(201).json({
                        status: res.statusCode,
                        data: data,
                    });
                })
                .catch((err) => {
                    res.status(404).send({
                        status: res.statusCode,
                        message: "Some error occurred while creating the User.",
                    });
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async login(req, res, next) {

        try {
            const ip = requestIp.getClientIp(req);

            // if username or email exist
            const user = await User.findOne({
                $or: [{
                        username: req.body.data
                    },
                    {
                        email: req.body.data
                    }
                ]
            })

            if (!user) return res.status(400).json({
                status: res.statusCode,
                message: 'Username or email was not found!'
            })

            // check password
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    status: res.statusCode,
                    message: "Invalid Password!"
                });
            }

            // token
            const token = jwt.sign({
                id: user.id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                status: user.status,
                level: user.level
            }, process.env.SECRET_KEY, {
                expiresIn: 86400
            });
            const updateData = {
                token: token,
                lastLogin: moment().format('YYYY-MM-DD HH:mm:ss'),
                ipAddress: ip
            };

            // update token
            const id = user.id;
            User.findByIdAndUpdate(id, updateData, {
                    new: true,
                    useFindAndModify: false
                }, function (err, doc) {})
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update User with id=${id}. Maybe User was not found!`,
                        });
                    } else res.status(201).send({
                        status: res.statusCode,
                        lastLogin: updateData.lastLogin,
                        IP: updateData.ipAddress,
                        token: updateData.token,
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: "Error updating User with id=" + id,
                    });
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async logout(req, res, next) {

        try {
            await User.updateOne({
                id: req.user._id
            }, {
                $set: {
                    token: null
                }
            })

            res.status(200).json({
                status: res.statusCode,
                message: 'logout successfully, tokens have been removed'
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async updateUserData(req, res, next) {

        try {
            const id = req.user.id;

            User.findByIdAndUpdate(id, req.body, {
                    new: true,
                    useFindAndModify: false
                }, function (err, doc) {})
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update User with id=${id}. Maybe User was not found!`,
                        });
                    } else res.send({
                        status: res.statusCode,
                        data: data
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: "Error updating User with id=" + id,
                    });
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async changePassword(req, res, next) {

        try {
            // if username and email valid
            const user = await User.findOne({
                $and: [{
                        username: req.body.username
                    },
                    {
                        email: req.body.email
                    }
                ]
            })

            if (!user) return res.status(400).json({
                status: res.statusCode,
                message: 'Invalid username or email!'
            })

            let saltRounds = 8;
            const hashedPw = await bcrypt.hash(req.body.password, saltRounds);
            user.password = hashedPw;

            const updateDatauser = await user.save()

            res.status(200).json({
                status: res.statusCode,
                data: updateDatauser
            })
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async createTicket(req, res, next) {

        try {
            const mUUID1 = MUUID.v4();
            if (req.user.level == "1") {
                Ticket.create({
                    username: req.user.username,
                    code: mUUID1.toString(),
                    email: req.user.email,
                    content: req.body.content,
                    category: req.body.category,
                }).then((data) => {
                    res.status(201).send({
                        status: res.statusCode,
                        data: data
                    });
                })
            } else {
                res.status(401).send({
                    status: res.statusCode,
                    message: "your account is not yet a Premium Member, please contact the admin",
                })
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

}

module.exports = new UserController();