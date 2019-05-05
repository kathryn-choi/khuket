var express = require('express');
var router = express.Router();


//티켓에 대해 비딩의 타당한지 여부
function check_bidding_valid(bidding_index, bidding_price, current_time, cb){
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    var current_bidding_info = {
        current_time : current_time,
        starting_time : starting_time,
        ticket_owner_index: id,
        max_price: max_price,
        current_price: current_price,
        starting_price: starting_price,
        bidder_index: bidder_index,
    }
    connection.query(sqlquery, bidding_index, function(err){
        if(!err){
        //메소드 작성하기
        // 현재 시간 전이여야 하며 최댓값보다 작고, 스타팅 타임 이후여야 됨
        }else{
            console.log("비딩 실패");
            //throw err;
        }
    });
}

router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){

                    get_bidding_list(1, function (myinfo_list) {
                        callback(null,myinfo_list);
                    });
                }
            ],
            function(err, results){
                res.render('bidding', {
                    bidding: results[0]
                });
            }
        );
    }
});

module.exports = router;