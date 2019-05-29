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
        var sql = 'INSERT INTO `buyers` (`buyer_id`, `buyer_pw`, `buyer_name`) VALUES ? ON DUPLICATE KEY UPDATE buyer_id=buyer_id;';
        var values = [[profile._json.id, profile._json.id, profile._json.properties.nickname]];
        connection.query(sql, [values], function (err) {
            if (err) {
                console.log("카카오계정 추가중 에러!");
                throw err;
            } else {
                console.log("추가되었습니다.");
            }
        });
}

router.get('/auth/logout/kakao',function (req,res) {
    req.logout();
    res.redirect('/');
})

/* GET home page.*/ 
router.get('/', function(req,res,next) {
    let session = req.session;
    if(req.isAuthenticated()){
        res.redirect('/mypage');
        console.log("(!)카카오로 이미 로그인");
    }else{
        console.log("(!)카카오 로그인 아님");
        res.render('index',{
            session : session
        });
    }
});

module.exports = router;
