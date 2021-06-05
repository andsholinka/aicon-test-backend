require('dotenv').config();

const mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;
db.user = require("./user.model.js")(mongoose);
db.admin = require("./admin.model.js")(mongoose);
db.occupation = require("./occupation.model.js")(mongoose);
db.category = require("./category.model.js")(mongoose);
db.ticket = require("./ticket.model.js")(mongoose);
db.activity = require("./activity.model.js")(mongoose);

module.exports = db;