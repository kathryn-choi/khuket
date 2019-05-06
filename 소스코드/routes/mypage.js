var express = require('express');
var async = require('async');
var router = express.Router();

//id 값을 가진 buyer 개인정보 가져오기
//list of buyer(id)'s info
console.log("mypage!");
function get_my_info(id,cb){
    var sqlquery = "SELECT  b.buyer_name, b.buyer_id, b.buyer_email, b.buyer_contact, b.buyer_account FROM buyer b WHERE b.buyer_index = ?";
    var myinfo;
    connection.query(sqlquery,id,function(err,res){
        if(!err){
            myinfo={
                buyer_name: res.buyer_name,
                buyer_id: res.buyer_id,
                buyer_email: res.buyer_email,
                buyer_contact: res.buyer_contact,
                buyer_account: res.buyer_account,
                notification: res.notification
            }
            cb(myinfo);
            console.log(myinfo);
            return myinfo;
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
   //  var sqlquery = "SELECT  t.toon_index, t.name, t.thum_link, t.webtoon_link, t.week, t.site FROM user u, user_toon_relation ur, toon t WHERE u.id = '"+id+"' && u.id=ur.user_id && t.toon_index=ur.toon_index;";
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

//티켓 resell하기
function resell_ticket(id, starting_time, max_price, current_price, starting_price,cb){
    var current_date = new Date();
    var current_time = "Last Sync: " + current_date.getDate() + "/"
        + (current_date.getMonth()+1)  + "/"
        + current_date.getFullYear() + " @ "
        + current_date.getHours() + ":"
        + current_date.getMinutes() + ":"
        + current_date.getSeconds();
        connection.query("INSERT INTO bidding SET ?;", {
            current_time : current_time,
            starting_time : starting_time,
            ticket_owner_index: id,
            max_price: max_price,
            current_price: current_price,
            starting_price: starting_price,
            bidder_index: -1,
        },function (err) {
            if(err) {
                throw err;
                console.log("비딩 추가중 에러!")
            } else{
                // alert("추가되었습니다.")
                cb();
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
                    get_my_info(id, function (myinfo_list) {
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