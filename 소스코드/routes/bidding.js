
var express = require('express');
var async = require('async');
var router = express.Router();
var network = require('./network/network.js');

//티켓에 대해 비딩의 타당한지 여부
function check_bidding_valid(bidding_index, bidding_price, right_now_time, cb) {
    var current_bidding_info;
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery, bidding_index, function (err, res) {
        if (!err) {
            current_bidding_info = {
                current_time: res.current_time,
                starting_time: res.starting_time,
                ticket_owner_index: res.ticket_owner_index,
                max_price: res.max_price,
                current_price: res.current_price,
                starting_price: res.starting_price,
                bidder_index: res.bidder_index,
                end_time: res.end_time,
            }
            //메소드 작성하기
            // 현재 시간 전이여야 하며 최댓값보다 작고, 스타팅 타임 이후여야 됨
            if (right_now_time > current_bidding_info.starting_time && right_now_time < current_bidding_info.end_time) // 시간 관련 조건
            {
                if (bidding_price > current_bidding_info.current_price && bidding_price <= current_bidding_info.max_price) {
                    return true;
                }
            }
        } else {
            console.log("비딩 실패");
            //throw err;
        }
    });
}

//alert 직전 비더
function alert_former_bidder(bidding_index, cb) {
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery, bidding_index, function (err, res) {
        if (!err) {
            if (res.bidder_index != -1) {
                var gig_venue = network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).gig_venue;
                var gig_name =  network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).gig_name;
                var gig_time =  network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).gig_time;
                var section_id= network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).section_id;
                var row_id=network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).row_id;
                var seat_id=network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).seat_id;
                var notice= res.ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString()
                    + '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString();
                connection.query("INSERT INTO notification SET ?;", {
                    notification_buyer_index: id,
                    notice_buyer_text: notice,
                });
            } else {
                console.log("정보 불러오기 실패");
                //throw err;
            }
        } else {
            //직전 비더가 없는 관계로 notice 줄 필요 없음
            return true;
        }

    });
}
//새로운 참여자로 인한 비딩 수정
router.post('/bidding', function (req, res, next) {
    var bidding_index = req.body.bidding_index;
    var bidder_index = req.body.bidder_index;
    var bidder_bidding_price = req.body.bidder_bidding_price;
    var current_date = new Date();
    var current_time = current_date.getDate() + "/"
        + (current_date.getMonth() + 1) + "/"
        + current_date.getFullYear() + " @ "
        + current_date.getHours() + ":"
        + current_date.getMinutes() + ":"
        + current_date.getSeconds();

    //비딩 가능한지 여부 판별하기
    if (check_bidding_valid(bidding_index, bidder_bidding_price, current_time, cb) == true) {
        //직전 비더에게 알리기
        if (alert_former_bidder(bidding_index) == true) {
            //비딩 가능하면 테이블에 정보 수정하기
            var sql = "UPDATE bidding SET current_price = ?, bidder_index=?  WHERE bidding_index = ?";
            connection.query(sql, [bidder_bidding_price, bidder_index, bidding_index], function (err) {
                if (err) throw err;
                console.log("비딩 정보 수정완료");
            });

            console.log("## post request");
            res.render('reselling');
        }
    } else {
        console.log("비딩 불가!");
        res.render('bidding');
    }
});


//수정할 예정
router.get('/bidding', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                    get_bidding_list(id, function (myinfo_list) {
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