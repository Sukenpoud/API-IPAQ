const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');
const logger = require('./logger');
// Import the `dotenv` package
require('dotenv').config();


const app = express();
app.use(helmet());
app.use(compression());

//Passby CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, UserID, Email');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const dbID = process.env.DB_ID;
const dbPW = process.env.DB_PW;
const DB = 'mongodb+srv://'+dbID+':'+dbPW+'@cluster0.nssey38.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "api-ipaq" })
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => {
        logger.error('MongoDB ERROR CONNECT', err)
    });

app.use(bodyParser.json());

// import routes
const ipRoutes = require('./routes/ip');
const userRoutes = require('./routes/user');

app.use('/api/ip', ipRoutes);
app.use('/api/auth', userRoutes);

// export app
module.exports = app;


// navigator.storage et/ou window.sessionStorage et/ou window.localStorage et/ou cookies
// window.sessionStorage privilégié pour le token