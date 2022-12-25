const express = require('express');
const cors = require('cors');
const recursive = require('recursive-readdir-sync');
const {handleError} = require('./helpers/errors');

const app = express();

// swagger documentation route, only for dev mode
if (process.env.NODE_ENV !== 'production') require('./helpers/swagger')(app);

// allow requests form anywhere
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// collect controllers recursively
recursive(`${__dirname}/routes`)
    .forEach(file => app.use('/', (req, res, next) => require(file)(req, res, next)));    

// global errors middleware
app.use((err, req, res, next) => handleError(err, req, res, next));
module.exports = app;