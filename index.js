const express = require("express");
const cors = require("cors");
const logger = require('morgan');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

const db = require("./src/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Aicon application."
    });
});

//default error
app.use((err, req, res, next) => {
    res.send(err.message)
})

const UserRoute = require('./src/routes/user.routes');
const AdminRoute = require('./src/routes/admin.routes');

app.use('/api/', UserRoute);
app.use('/api/admin', AdminRoute);