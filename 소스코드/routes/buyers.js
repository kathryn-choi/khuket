var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");

router.get('/signup', function(req, res, next) {
    res.render("buyers/signup");
  });
  
router.post("/signup", function(req,res,next){
    let body = req.body;
    let inputPassword = body.buyer_pw;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    
    models.buyers.create({
        buyer_id: body.buyer_id,
        buyer_pw: hashPassword,
        buyer_email: body.buyer_email,
        buyer_contact: body.buyer_contact,
        buyer_account: body.buyer_account,
        buyer_name: body.buyer_name,
        salt: salt
    })
    .then( result => {
        res.redirect("./login");
    })
    .catch( err => {
        console.log(err)
})
});

router.get('/login', function(req, res, next) {
    let session = req.session;

    res.render("buyers/login", {
        session : session
    });
});

router.post("/login", function(req,res,next){
    let body = req.body;

    models.buyers.findOne({
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
            res.redirect("./login");
        }
    })
    .catch( err => {
        console.log(err);
    });
});

module.exports = router;