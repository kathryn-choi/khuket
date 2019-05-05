var express = require('express');
var async = require('async');
var router = express.Router();

//id 값을 가진 buyer 개인정보 가져오기
//list of buyer(id)'s info
console.log("mypage!");
function get_my_info(id,cb){
    var sqlquery = "SELECT  b.buyer_name, b.buyer_id, b.buyer_email, b.buyer_contact, b.buyer_account FROM buyer b WHERE b.buyer_index = ?";
    var myinfo = new Array();
    connection.query(sqlquery,id,function(err,rows){
        if(!err){
            myinfo=rows;
            cb(myinfo);
            console.log(myinfo);
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}

//id 값을 가진 buyer가 구매한 티켓들 가져오기
//list of buyer(id)'s tickets
function get_my_tickets(id,cb){
    //ticket 쿼리문 가져오기
     var sqlquery = "SELECT  t.toon_index, t.name, t.thum_link, t.webtoon_link, t.week, t.site FROM user u, user_toon_relation ur, toon t WHERE u.id = '"+id+"' && u.id=ur.user_id && t.toon_index=ur.toon_index;";
    var my_tickets = new Array();
    connection.query(sqlquery,id,function(err,rows,result){
        if(!err){
            my_tickets=rows;
            cb(my_tickets);
            console.log(my_tickets);
        }else{
            console.log("내 티켓 리스트 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                   //get_my_info(req.user.user_id, function (myinfo_list) {
                    get_my_info(1, function (myinfo_list) {
                        callback(null,myinfo_list);
                    });
                }
            ],
            function(err, results){
                res.render('mypage', {
                    myinfo: results[0]
                });
            }
        );
    }
});


module.exports = router;