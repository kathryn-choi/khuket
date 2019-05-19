var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


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
  
module.exports = router;