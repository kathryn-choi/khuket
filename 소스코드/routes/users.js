const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require("crypto");

/*
router.get('/login', function(req, res, next) {
    res.render("users/login");
});*/

router.get("/logout", function(req,res,next){
  req.session.destroy();
  res.clearCookie('sid');
  res.redirect("/")
});

module.exports = router;