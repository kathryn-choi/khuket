// module
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var request = require('request');
var passport = require('passport');
var session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');
var async = require('async');

// routing
var index = require('./routes/index');
var users = require('./routes/users');
var buyers = require('./routes/buyers');
var bidding = require('./routes/bidding');
var administrators = require('./routes/administrators');
var organizers = require('./routes/organizers');
var gigs = require('./routes/gigs');
var mypage = require('./routes/mypage');
var reselling = require('./routes/reselling');
var refund = require('./routes/refund');
var network = require('./ticketing-system/network.js');

//port
passport.serializeUser(function(user, done) {
    console.log('serialized');
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    console.log('deserialized');
    done(null, user);
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password123',
    port     : 3306,
    database : 'ticketing_service',
});

app.use(session({
    key: 'sid', 
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
    }
  }))

network.register_admin("ticketadmin","ticketadmin")
  .then((response) => {
  //return error if error in response
  if (response.error != null) {
      console.log("error")
  } else {
      //else return success
      console.log("Success")
  }
})
  
app.use(express.static('public'));
app.use(express.static('views'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/buyers', buyers);
app.use('/administrators', administrators);
app.use('/organizers', organizers);
app.use('/gigs', gigs);
app.use('/bidding', bidding);
app.use('/mypage', mypage);
app.use('/reselling', reselling);
app.use('/refund', refund);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

// npm start
// or nodemon start (npm install -g nodemon)