var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");

router.get('/login', function(req, res, next) {
    let session = req.session;
  
      res.render("users/administrator_login", {
          session : session
      });
  });
  
router.post("/login", function(req,res,next){
let body = req.body;

models.administrator.findOne({
    where: {admin_id : body.admin_id}
})
.then( function(result, err) {
    let dbPassword = result.dataValues.admin_pw;
    
    let inputPassword = body.admin_pw;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    console.log(hashPassword);
    console.log(dbPassword);
    if(dbPassword === hashPassword){
        console.log("비밀번호 일치");
        // 세션 설정
        req.session.admin_id = body.admin_id;
            res.redirect("./adminpage");
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

router.get('/adminpage', function(req, res, next) {
    let session = req.session;
  
      res.render("./adminpage", {
          session : session
    });
});
module.exports = router;