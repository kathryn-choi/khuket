var express = require('express');
var request = require('request');
var router = express.Router();
var mysql      = require('mysql');
var passport = require('passport');
   
/* GET home page.*/ 
router.get('/', function(req,res,next) {
    res.render('index', {
        session: req.session
    });
});

module.exports = router;
