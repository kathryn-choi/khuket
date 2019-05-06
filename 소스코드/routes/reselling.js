var express = require('express');
var router = express.Router();


//리셀링 티켓 리스트 가져오기
function get_reselling_list(cb){
    //current_time : current_time, starting_time : starting_time, ticket_owner_index: id, max_price: max_price, current_price: current_price, starting_price: starting_price, bidder_index: -1
    var sqlquery = "SELECT * FROM bidding b";
    var reselling_list = new Array();
    connection.query(sqlquery,function(err,rows){
        if(!err){
            reselling_list=rows;
            cb(reselling_list);
            console.log(reselling_list);
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}

//티켓에 대해 비딩의 타당한지 여부
function check_bidding_valid(bidding_index, bidding_price, right_now_time, cb){
    var current_bidding_info;
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery, bidding_index, function(err, res){
        if(!err){
            current_bidding_info = {
                current_time : res.current_time,
                starting_time : res.starting_time,
                ticket_owner_index: res.ticket_owner_index,
                max_price: res.max_price,
                current_price: res.current_price,
                starting_price: res.starting_price,
                bidder_index: res.bidder_index,
            }
            //메소드 작성하기
            // 현재 시간 전이여야 하며 최댓값보다 작고, 스타팅 타임 이후여야 됨
            if(right_now_time>current_bidding_info.starting_time ) // 시간 관련 조건
            {
                    if (bidding_price > current_bidding_info.current_price && bidding_price <= current_bidding_info.max_price) {
                        return true;
                    }
            }
        }else{
            console.log("비딩 실패");
            //throw err;
        }
    });
}

//alert 직전 비더
function alert_former_bidder(bidding_index, cb) {
    var current_bidding_info;
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery, bidding_index, function (err, res) {
        if (!err) {
            if (res.bidder_index != -1) {
                var notice = "Your bidding for ticket 정보 blahblah has been surpassed \n" + res.notification;
                //티켓 정보
                var sqlquery2 = "UPDATE buyer SET notification=?  WHERE  = ?";
                connection.query(sqlquery, [notice, res.bidder_index], function (err, res) {
                    if (!err) {
                        console.log("alert 성공!");
                        return true;
                    }
                    throw err;
                });
            } else {
                console.log("정보 불러오기 실패");
                //throw err;
            }
        }
        else
        {
            //직전 비더가 없는 관계로 notice 줄 필요 없음
            return true;
        }

    });
}


//reselling_ticket 지우기 (시간 관계 or max price 등등)
function delete_reselling_ticket(bidding_index, cb){
    var sqlquery = "DELETE FROM bidding WHERE bidding_index= ?";
    connection.query(sqlquery, bidding_index, function(err){
        if(!err){
            console.log("비딩 삭제 성공");
        }else{
            console.log("비딩 삭제 실패");
            //throw err;
        }
    });
}

//새로운 참여자로 인한 비딩 수정
router.post('/bidding', function(req, res, next) {
    var bidding_index= req.body.bidding_index;
    var bidder_index = req.body.bidder_index;
    var bidder_bidding_price = req.body.bidder_bidding_price;
    var current_date = new Date();
    var current_time = current_date.getDate() + "/"
        + (current_date.getMonth()+1)  + "/"
        + current_date.getFullYear() + " @ "
        + current_date.getHours() + ":"
        + current_date.getMinutes() + ":"
        + current_date.getSeconds();
    //비딩 가능한지 여부 판별하기
   if(check_bidding_valid(bidding_index, bidder_bidding_price, current_time, cb)==true) {
       //직전 비더에게 알리기
       if(alert_former_bidder(bidding_index) == true) {
           //비딩 가능하면 테이블에 정보 수정하기
           var sql = "UPDATE bidding SET current_price = ?, bidder_index=?  WHERE bidding_index = ?";
           connection.query(sql, [bidder_bidding_price, bidder_index, bidding_index], function (err) {
               if (err) throw err;
               console.log("비딩 정보 수정완료");
           });

           console.log("## post request");
           res.render('reselling');
       }
   }
   else
   {
       console.log("비딩 불가!");
       res.render('bidding');
   }
});

router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                    get_reselling_list(1, function (reselling_list) {
                        callback(null,reselling_list);
                    });
                }
            ],
            function(err, results){
                res.render('bidding', {
                    reselling: results[0]
                });
            }
        );
    }
});

module.exports = router;