var express = require('express');
var request = require('request');
var router = express.Router();
var mysql      = require('mysql');
var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy;

passport.use(new KakaoStrategy({
        clientID : '5d61e3764a3ee0f12ccace0e1fc18bb5',
        callbackURL :'/auth/login/kakao/callback',
      //clientSecret : 'eUtJGtlLoCZJufevp3LKfDP0KOtZUV7R'
    },
    function(accessToken, refreshToken,params, profile, done){
        //사용자 정보는 profile에
        loginByThirdparty(accessToken, refreshToken, profile);

        console.log("(!)로그인 : " + profile._json.id+"("+profile._json.properties.nickname +")");
        //return done(null,profile)
        return done(null, {
            'user_id': profile._json.id,
            'nickname': profile._json.properties.nickname
        });
    }
));

// kakao 로그인
router.get('/auth/login/kakao',
    passport.authenticate('kakao')
);

// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
    passport.authenticate('kakao', {
        //session: false,
        successRedirect: '/mypage',
        failureRedirect: '/'
    })
);

function loginByThirdparty(accessToken, refreshToken, profile) {
    //예전 코드는 MySQL 버젼이 맞지 않음
    //  var sql = 'INSERT INTO `user`(id) VALUES(?) ON DUPLICATE KEY(PRIMARY) UPDATE id=(?);'
    var sql = "INSERT INTO `user` (id) VALUES (?) ON DUPLICATE KEY UPDATE id=id";
    var kid=[profile._json.id];
    connection.query(sql,kid,function(err,result){
        if (err) {
            console.log("로그인 쿼리중 에러 : " + err);
        } else {
            console.log("로그인 DB처리 완료!");
        }
    });
}

router.get('/auth/logout/kakao',function (req,res) {
    req.logout();
    res.redirect('/');
})

/* GET home page. */
router.get('/',
    function(req,res,next){
        if(req.isAuthenticated()){
            res.redirect('/mypage');
            console.log("(!)이미 로그인");
        }else{
            console.log("(!)로그인세션 없음");
            res.render('index',{
                title: "Ticketing Service"

            });
        }
    });

module.exports = router;
