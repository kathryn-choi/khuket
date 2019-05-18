
var express = require('express');
var async = require('async');
var router = express.Router();
//var network = require('./network/network.js');


//alert 직전 비더
function alert_former_bidder(bidding_index) {
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery, bidding_index, function (err, rows) {
        if (!err) {
                var result=rows;
            if (result[0].bidder_id !== '-1') {
               /* var gig_venue = network.get_ticket_info_by_id(res.bidder_id, res.ticket_id).gig_venue;
                var gig_name =  network.get_ticket_info_by_id(res.bidder_id, res.ticket_id).gig_name;
                var gig_time =  network.get_ticket_info_by_id(res.bidder_id, res.ticket_id).gig_time;
                var section_id= network.get_ticket_info_by_id(res.bidder_id, res.ticket_id).section_id;
                var row_id=network.get_ticket_info_by_id(res.bidder_id, res.ticket_id).row_id;
                var seat_id=network.get_ticket_info_by_id(res.bidder_id, res.ticket_id).seat_id;
                var notice= res.ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString()
                    + '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString();*/
               var notice="you have been overbid!"; // 티켓 정보 추가할 예정
                connection.query("INSERT INTO notification SET ?;", {
                    notice_buyer_id: result[0].bidder_id,
                    notice_buyer_text: notice,
                });

            } else {
                //직전 비더가 없는 관계로 notice 줄 필요 없음

            }
        } else {
          console.log("select failed");
          return false;

        }

    });
}


router.post('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        var sqlquery = 'SELECT * FROM bidding b WHERE bidding_index=?';
        var reselling_list = new Array();
        connection.query(sqlquery, req.body.bidding_index, function (err, rows) {
            if (!err) {
                reselling_list = rows;
                console.log(reselling_list);
                console.log(req.body.bidding_id);
                res.render('bidding', {user_id : req.body.bidding_id, bidding_index :req.body.bidding_index, current_price : reselling_list[0].current_price, max_price: reselling_list[0].max_price});
            } else {
                console.log('내 정보를 가져오는데 실패했습니다!');
                res.redirect('back');
                //throw err;
            }
        });
    }else{
        var sqlquery = 'SELECT * FROM bidding b WHERE bidding_index=?';
        var reselling_list = new Array();
        connection.query(sqlquery, req.body.bidding_index, function (err, rows) {
            if (!err) {
                reselling_list = rows;
                console.log(reselling_list);
                res.render('bidding', {user_id : req.user.user_id, bidding_index :req.body.bidding_index, current_price : reselling_list[0].current_price, max_price: reselling_list[0].max_price});
            } else {
                console.log('내 정보를 가져오는데 실패했습니다!');
                res.redirect('back');
                //throw err;
            }
        });
    }
});

//새로운 참여자로 인한 비딩 수정
router.post('/add_bidding', function (req, res, next) {
    var bidding_index = req.body.bidding_index;
    var bidder_id = req.body.bidder_id;
    var bidder_bidding_price = req.body.bidder_bidding_price;

    console.log("bidding_index : "+bidding_index);
    console.log("bidder_id :" + bidder_id);
    console.log("bidder_bidding_price" + bidder_bidding_price);

    var current_bidding_info=new Array();
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery,bidding_index, function (err, rows) {
        if (!err) {
            current_bidding_info = rows;
            console.log(current_bidding_info);
            var start_time=current_bidding_info[0].starting_time;
            var current_time=current_bidding_info[0].current_time;
            var end_time=current_bidding_info[0].end_time; //왜 인식 못하는지 모름...
            if(current_time>=start_time && current_time <end_time) {
                if (bidder_bidding_price > current_bidding_info[0].current_price && bidder_bidding_price <= current_bidding_info[0].max_price) {
                    console.log('성공!');
                    var sql = "UPDATE bidding SET current_price = ?, bidder_id=?  WHERE bidding_index = ?";
                    connection.query(sql, [bidder_bidding_price, bidder_id, bidding_index], function (err) {
                        if (err) {
                            console.log("updating failed");
                            throw err;
                        }
                        else {
                            console.log("비딩 정보 수정완료");
                        }
                    });
                    alert_former_bidder(bidding_index);
                    res.redirect('http://localhost:3000/reselling');
                }
            }
            else{
                console.log('실패실패!');
                throw err;
            }
        } else {
            console.log("비딩 실패");
            throw err;
        }
    });



    //비딩 가능한지 여부 판별하기
/*    if (check_bidding_valid(bidding_index, bidder_bidding_price) === true) {
        //직전 비더에게 알리기
        if (alert_former_bidder(bidding_index) === true) {
            //비딩 가능하면 테이블에 정보 수정하기
            var sql = "UPDATE bidding SET current_price = ?, bidder_id=?  WHERE bidding_index = ?";
            connection.query(sql, [bidder_bidding_price, bidder_id, bidding_index], function (err) {
                if (err) {
                    console.log("updating failed");
                    throw err;
                }
                else {
                    console.log("비딩 정보 수정완료");
                }
            });
            console.log("## post request");
            res.render('reselling');
        }
    } else {
        console.log("비딩 불가!");
        res.render('reselling');
    }*/
});

module.exports = router;