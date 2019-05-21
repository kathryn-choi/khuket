var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");

// function add_gig;

router.get('/', function(req, res, next) {
    let session = req.session;
  
    res.render("organizers/mainpage", {
        session : session
    });
});

router.get('/signup', function(req, res, next) {
    res.render("organizers/signup");
  });
  
router.post("/signup", function(req,res,next){
    let body = req.body;
    let inputPassword = body.organizer_pw;
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
        res.redirect("./login");
    })
    .catch( err => {
        console.log(err)
})
})

router.get('/login', function(req, res, next) {
    let session = req.session;
  
      res.render("organizers/login", {
          session : session
      });
  });
  
router.post("/login", function(req,res,next){
    let body = req.body;

    models.organizer.findOne({
    where: {organizer_id : body.organizer_id}
    })
    .then( function(result, err) {
        let dbPassword = result.dataValues.organizer_pw;
        let inputPassword = body.organizer_pw;
        let salt = result.dataValues.salt;
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        console.log(hashPassword);
        console.log(dbPassword);
    if(dbPassword === hashPassword){
        console.log("비밀번호 일치");
        // 세션 설정
        req.session.organizer_id = body.organizer_id;
        res.redirect("/organizers");
    }
    else{
        console.log("비밀번호 불일치");
        res.redirect("./login");
    }
    })
    .catch( err => {
        console.log(err);
    });
});

router.get('/add_gig', function(req, res, next) {
    res.render("organizers/add_gig");
});
  
router.post("/add_gig", function(req,res,next){
    let body = req.body;

    models.gig.create({
        gig_organizer_index : req.session.gig_organizer_index_idx, // 수정 필요, 잘 모르겠음
        gig_venue: body.gig_venue,
        gig_name: body.gig_name,
        gig_date_time: body.gig_date_time,
        gig_total_seatnum: body.gig_total_seatnum,
        pending: 1, // 수정 필요
        gig_image: body.gig_image,
        gig_description: body.gig_description,
        gig_type : body.gig_type
    })
    .then( result => {
        res.redirect("./");
    })
    .catch( err => {
        console.log(err)
})
});

router.get('/show_gigs', function(req, res, next) {
    res.render("organizers/show_gigs");
});

module.exports = router;