const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require("crypto");

router.get('/buyer_signup', function(req, res, next) {
  res.render("users/buyer_signup");
});

router.post("/buyer_signup", function(req,res,next){
    let body = req.body;
    let inputPassword = body.buyer_pw;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    
    models.buyer.create({
        buyer_id: body.buyer_id,
        buyer_pw: hashPassword,
        buyer_email: body.buyer_email,
        buyer_contact: body.buyer_contact,
        buyer_account: body.buyer_account,
        buyer_name: body.buyer_name,
        salt: salt
    })
    .then( result => {
        res.redirect("/users/buyer_login");
    })
    .catch( err => {
        console.log(err)
  })
});

router.get('/organizer_signup', function(req, res, next) {
  res.render("users/organizer_signup");
});

router.post("/organizer_signup", function(req,res,next){
    let body = req.body;

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    models.organizer.create({
        organizer_id: body.organizer_id,
        organizer_pw: hashPassword,
        organizer_email: body.organizer_email,
        organizer_contact: body.organizer_contact,
        organizer_account: body.organizer_account,
        organizer_name: body.organizer_name,
        salt: salt
    })
    .then( result => {
        res.redirect("users/organizer_login");
    })
    .catch( err => {
        console.log(err)
  })
})
/*
router.get('/', function(req, res, next) {
  res.send('환영합니다~');
});*/
/*
router.get('/login', function(req, res, next) {
    res.render("users/login");
});*/

router.get('/buyer_login', function(req, res, next) {
  let session = req.session;

    res.render("users/buyer_login", {
        session : session
    });
});

router.post("/buyer_login", function(req,res,next){
  let body = req.body;

  models.buyer.findOne({
      where: {buyer_id : body.buyer_id}
  })
  .then( function(result, err) {
      let dbPassword = result.dataValues.buyer_pw;
      
      let inputPassword = body.buyer_pw;
      let salt = result.dataValues.salt;
      let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
      console.log(hashPassword);
      console.log(dbPassword);
      if(dbPassword === hashPassword){
          console.log("비밀번호 일치");
          // 세션 설정
          req.session.buyer_id = body.buyer_id;
            res.redirect("/mypage");
      }
      else{
          console.log("비밀번호 불일치");
          res.redirect("/users/buyer_login");
      }
  })
  .catch( err => {
      console.log(err);
  });
});

router.get('/organizer_login', function(req, res, next) {
  let session = req.session;

    res.render("users/organizer_login", {
        session : session
    });
});

router.post("/organizer_login", function(req,res,next){
  let body = req.body;

  models.organizer.findOne({
      where: {organizer_id : body.organizer_id}
  })
  .then( function(result, err) {
      let dbPassword = result.dataValues.password;
      let inputPassword = body.organizer_pw;
      let salt = result.dataValues.salt;
      let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
      
      if(dbPassword === hashPassword){
          console.log("비밀번호 일치");
          // 세션 설정
          req.session.organizer_id = body.organizer_id;
          res.redirect("/users/organizer_login");
      }
      else{
          console.log("비밀번호 불일치");
          res.redirect("/users/organizer_login");
      }
  })
  .catch( err => {
      console.log(err);
  });
});

router.get("/logout", function(req,res,next){
  req.session.destroy();
  res.clearCookie('sid');
  res.redirect("/")
});

module.exports = router;