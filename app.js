const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const passport = require("./passport/config");

const mongoose = require("mongoose");
const mongoDb = process.env.MONGO_DB;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// pass every req except for /login and /signup through Passport token authenticator
app.use(function (req, res, next) {
    if (req.url == "/login" || req.url == "/signup" || req.url == "/uploadImg"){
        return next();
    }
    else {
        passport.authenticate("jwt", {session: false}, function(err, user, info) {
            if (err || !user) {
                return res.status(401).json({
                    message: err
                })
            }
            else{
                req.userId = user._id.toString();
                return next();
            }
        })(req, res, next);
    }
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error response
  res.status(err.status || 500);
  res.json(err.message);

});

const apiURL = process.env.RENDER_API_URL

async function pingRenderServer() {
    try {
        let res = await fetch(apiURL)
        
        console.log(res.status)
    }

    catch(err) {
        console.log(err)
    }
}

function pingTimer() {
    setTimeout(pingTimer, 600000)
    pingRenderServer()
}

pingTimer()

module.exports = app;
