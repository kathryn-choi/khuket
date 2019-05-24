var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");
var network = require('../ticketing-system/network.js');

// function add_gig;

router.get('/signup', function(req, res, next) {
    res.render("organizers/signup");
  });
  
router.post("/signup", function(req,res,next){
    let body = req.body;
    let inputPassword = body.organizer_pw;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    models.organizers.create({
        organizer_id: body.organizer_id,
        organizer_pw: hashPassword,
        organizer_email: body.organizer_email,
        organizer_contact: body.organizer_contact,
        organizer_account: body.organizer_account,
        organizer_name: body.organizer_name,
        salt: salt
    })
    .then( 
        network.register_organizer(organizer_id,organizer_name)
            .then((response) => {
            //return error if error in response
            if (response.error != null) {
                res.json({
                error: response.error
                });
            } else {
                //else return success
                res.json({
                success: response
                });
            }
        })
    , result => {
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

    models.organizers.findOne({
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
        req.session.organizer_index = result.dataValues.organizer_index;
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

// 메인페이지에 공연 목록들 출력
// 공연 상세정보 뒤에 결과(승인 요청중, 등록 완료, 등록 거절)도 같이 출력
router.get('/', function(req, res, next) {
    let session = req.session;

    models.gigs.findAll().then( result => {
        res.render("organizers/mainpage", {
            session: session,
            result: result
        });
    });
    
});

router.get('/add_gig', function(req, res, next) {
    let session = req.session;
    
    res.render("organizers/add_gig", {
        session : session
    });
});
  
router.post("/add_gig", function(req,res,next){
    let body = req.body;

    console.log(req.session);
    models.gigs.create({
        gig_organizer_index : req.session.organizer_index,
        gig_venue: body.gig_venue,
        gig_name: body.gig_name,
        gig_date_time: body.gig_date_time,
        gig_total_seatnum: body.gig_total_seatnum,
        pending: 2, // 1이면 승인, 0이면 거절, 2면 승인 요청 기다림
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

module.exports = router;