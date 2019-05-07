var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var request = require('request');
var index = require('./routes/index');
var buyers = require('./routes/buyers');
var bidding = require('./routes/bidding');
var administrators =require('./routes/administrators');
var organizers =require('./routes/organizers');
var gigs =require('./routes/gigs');
var seats =require('./routes/seats');
var sections =require('./routes/sections');
var mypage = require('./routes/mypage');
var reselling = require('./routes/reselling');
var refund = require('./routes/refund');

var passport = require('passport');
var setting = require('./routes/setting');
var session = require('express-session');

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//mount path
/*app.get('/', function (req, res) {
    console.log(app.mountpath);
    res.send('App Homepage');
});*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    port     : 3306,
    database : 'ticketing_service'
});

app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/buyers', buyers);
app.use('/administrators', administrators);
app.use('/organizers', organizers);
app.use('/gigs', gigs);
app.use('/sections', sections);
app.use('/seats', seats);
app.use('/bidding', bidding);
app.use('/setting', setting);
app.use('/mypage', mypage);
app.use('/reselling', reselling);
app.use('/refund', refund);

app.use(express.static('views'));

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

var server = app.listen(3000);
module.exports = app;
console.log("hi");
