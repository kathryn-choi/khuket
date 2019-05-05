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

//새로운 참여자로 인한 비딩 수정
router.post('/', function(req, res, next) {
    var bidding_index= req.body.bidding_index;
    var bidder_index = req.body.bidder_index;
    var bidder_bidding_price = req.body.bidder_bidding_price;
    var currentdate = new Date();
    var current_time = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    //비딩 가능한지 여부 판별하기
    check_bidding_valid(bidding_index, bidder_bidding_price, current_time, cb)
    //비딩 가능하면 테이블에 정보 수정하기
    var sqlquery = "UPDATE bidding SET current_price = '"+bidder_bidding_price+ '" WHERE bidder_index = "'+bidder_index+'";
    connection.query(sqlquery,function(err,rows){
        if (err) throw err;
        console.log("비딩 정보 수정완료");
    });

    console.log("## post request");
    res.render('reselling' );
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