require('express');
const db = require("../models");
// const logger = require('morgan');
// const express = require("express");
// const app = express();

const Activity = db.activity;

hitAPI = (req, res, next) => {

    try {
        Activity.create({
            api: req.url,
            username: req.user.username,
        })
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: res.statusCode,
            message: err.message
        });
    }
};

const logAdmin = {
    hitAPI
};

module.exports = logAdmin;