require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const db = require("../models");
const Admin = db.admin;
const User = db.user;
const Occupation = db.occupation;
const Category = db.category;
const Ticket = db.ticket;

class AdminController {

    async register(req, res, next) {

        try {
            Admin.create({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, 8),
                })
                .then((data) => {
                    res.status(201).send({
                        status: res.statusCode,
                        message: "Admin was registered successfully!"
                    });
                })
                .catch((err) => {
                    res.status(404).send({
                        status: res.statusCode,
                        message: "Some error occurred while creating the Admin.",
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
            // if username exist
            const admin = await Admin.findOne({
                username: req.body.username
            })

            if (!admin) return res.status(400).json({
                status: res.statusCode,
                message: 'Username was not found!'
            })

            // check password
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                admin.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    status: res.statusCode,
                    message: "Invalid Password!"
                });
            }

            // token
            const token = jwt.sign({
                id: admin.id,
                username: admin.username
            }, process.env.SECRET_KEY, {
                expiresIn: 86400
            });
            const updateData = {
                lastLogin: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            // update token
            const id = admin.id;
            Admin.findByIdAndUpdate(id, updateData, {
                    new: true,
                    useFindAndModify: false
                }, function (err, doc) {})
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            status: res.statusCode,
                            message: `Cannot update Admin with id=${id}. Maybe Admin was not found!`,
                        });
                    } else res.status(200).send({
                        status: res.statusCode,
                        lastLogin: updateData.lastLogin,
                        token: token,
                    });
                })
                .catch((err) => {
                    console.error(err.message);
                    res.status(500).json({
                        status: res.statusCode,
                        message: err.message
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
            await Admin.updateOne({
                id: req.user._id
            }, {
                $set: {
                    token: null
                }
            })
            res.status(200).json({
                status: res.statusCode,
                message: 'logout successfully'
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                message: err.message
            });
        }
    }

    async searchUser(req, res, next) {

        try {
            const user = await User.findOne({
                $or: [{
                        username: req.params.data
                    },
                    {
                        email: req.params.data
                    }
                ]
            })

            if (user) {
                res.status(200).send({
                    status: res.statusCode,
                    data: user
                })

            } else {
                res.status(400).json({
                    status: res.statusCode,
                    message: `User with Username or email = ${req.params.data} was not found!`
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

    async getAllDataUsers(req, res, next) {

        const {
            page = 1, limit = 5
        } = req.query;

        try {
            // execute query with page and limit values
            const data = await User.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            // get total documents in the Posts collection 
            const count = await User.countDocuments();

            // return response with posts, total pages, and current page
            res.json({
                totalItems: count,
                data,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async changeStatusUser(req, res, next) {

        try {
            const user = await User.findOne({
                $or: [{
                        username: req.params.data
                    },
                    {
                        email: req.params.data
                    }
                ]
            })
            if (user) {
                user.status = req.body.status;
                const updateDatauser = await user.save()

                res.status(200).json({
                    status: res.statusCode,
                    data: updateDatauser
                })

            } else {
                res.status(400).json({
                    status: res.statusCode,
                    message: `User with Username or email = ${req.params.data} was not found!`
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

    async verifiedUser(req, res, next) {

        try {
            const user = await User.findOne({
                $or: [{
                        username: req.params.data
                    },
                    {
                        email: req.params.data
                    }
                ]
            })
            if (user) {
                user.isVerified = req.body.verified;
                const updateDatauser = await user.save()

                res.status(200).json({
                    status: res.statusCode,
                    data: updateDatauser
                })
            } else {
                res.status(400).json({
                    status: res.statusCode,
                    message: `User with Username or email = ${req.params.data} was not found!`
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

    async changeLevelUser(req, res, next) {

        try {
            const user = await User.findOne({
                $or: [{
                        username: req.params.data
                    },
                    {
                        email: req.params.data
                    }
                ]
            })
            if (user) {
                user.level = req.body.level;
                const updateDatauser = await user.save()

                res.status(200).json({
                    status: res.statusCode,
                    data: updateDatauser
                })
            } else {
                res.status(400).json({
                    status: res.statusCode,
                    message: `User with Username or email = ${req.params.data} was not found!`
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

    async createOccupation(req, res, next) {

        try {
            const occ = new Occupation({
                data: req.body.data
            });

            occ.save((err, occ) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                    return;
                }
            })
            res.status(201).send({
                status: res.statusCode,
                message: "Occupation was created successfully.",
                data: occ
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async createCategory(req, res, next) {

        try {
            const category = new Category({
                data: req.body.data
            });
            category.save((err, category) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                    return;
                }
            })
            res.status(201).send({
                status: res.statusCode,
                message: "Category was created successfully.",
                data: category
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async changeStatusTicket(req, res, next) {

        try {
            const id = req.params.id;
            Ticket.findByIdAndUpdate(id, req.body, {
                    new: true,
                    useFindAndModify: false
                }, function (err, doc) {})
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update Ticket with id=${id}. Maybe Ticket was not found!`,
                        });
                    } else res.status(200).send({
                        status: res.statusCode,
                        data: data
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: "Error updating Ticket with id=" + id,
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

    async searchTicketByQuery(req, res, next) {

        const {
            page = 1, limit = 5
        } = req.query;

        try {
            // execute query with page and limit values
            const data = await Ticket.find({
                    $or: [{
                            code: req.query.data
                        },
                        {
                            email: req.query.data
                        },
                        {
                            username: req.query.data
                        }
                    ]
                })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            // get total documents in the Posts collection 
            const count = await Ticket.countDocuments({
                $or: [{
                        code: req.query.data
                    },
                    {
                        email: req.query.data
                    },
                    {
                        username: req.query.data
                    }
                ]
            });

            // return response with posts, total pages, and current page
            res.json({
                totalItems: count,
                data,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                status: res.statusCode,
                message: err.message
            });
        }
    }

    async searchTicketByRangeTime(req, res, next) {

        const {
            page = 1, limit = 5
        } = req.query;
        const time = req.body

        try {
            let start = moment(time.start).format('YYYY-MM-DD 00:00:00.000+08');
            let end = moment(time.end).format('YYYY-MM-DD 23:59:59.000+08');
            if (time.start === undefined) {
                const history = await Ticket.find()
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .exec();

                const count = await Ticket.countDocuments();

                res.json({
                    totalItems: count,
                    history,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                });
            } else {
                const history = await Ticket.find({
                        createdAt: {
                            $gte: start,
                            $lt: end
                        }
                    })
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .exec();
                const count = await Ticket.countDocuments({
                    createdAt: {
                        $gte: start,
                        $lt: end
                    }
                });

                res.json({
                    totalItems: count,
                    history,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                });
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

module.exports = new AdminController();