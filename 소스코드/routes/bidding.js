var express = require('express');
var async = require('async');
var router = express.Router();
var network = require('../ticketing-system/network.js');

//alert 직전 비더
function alert_former_bidder(bidding_index, cb) {
    var sqlquery = "SELECT  * FROM biddings WHERE bidding_index = ?";
    connection.query(sqlquery, bidding_index, function (err, row) {
        if (!err) {
            var result=row;
            console.log("row: " + result);
            var bidder_id= result[0].bidder_id;
            var ticket_id=result[0].ticket_id;
            var ticket_owner_id=result[0].ticket_owner_id;
            console.log("bid : " +bidder_id);
            console.log("ticket_id" + ticket_id);
            if (bidder_id != '-1') {
                network.get_ticket_info_by_id(ticket_owner_id, ticket_id).then((response) => {
                    var ticket = response;  
                    for(i=0; i<ticket.length; i++) {
                    var ticket_id=ticket[i].ticket_id;
                    var gig_venue = ticket[i].gig_venue;
                    var gig_name =  ticket[i].gig_name;
                    var gig_datetime =  ticket[i].gig_datetime;
                    var section_id= ticket[i].section_id;
                    var row_id=ticket[i].row_id;
                    var seat_id=ticket[i].seat_id;
                    var notice= ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString()
                        + '\n Time : ' + gig_datetime.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString() + "has been overbid!";
                    connection.query("INSERT INTO notifications SET ?;", {
                        notice_buyer_id: bidder_id,
                        notice_buyer_text: notice,
                    });
                }
                });
            } else {
                //직전 비더가 없는 관계로 notice 줄 필요 없음
            }
            cb(true);
        } else {
          console.log("select failed");
          cb(false);
        }
    });
}

router.post('/', function(req, res, next) {
    let session = req.session;
        var sqlquery = `SELECT * FROM biddings WHERE ticket_id = ?`;
        var reselling_list = new Array();
        console.log("ticketid : ", req.body.ticket_id);
        connection.query(sqlquery, req.body.ticket_id, function (err, row) {
            if (!err) {
                reselling_list = row;
                console.log(reselling_list);
                res.render('bidding', {user_id : req.session.buyer_id, bidding_index :reselling_list[0].bidding_index, current_price : reselling_list[0].current_price, max_price: reselling_list[0].max_price});
            } else {
                console.log('내 정보를 가져오는데 실패했습니다!');
                res.redirect('back');
            }
        });
});

function addbidding(bidding_index, bidder_id, bidder_bidding_price, cb){
    var current_bidding_info=new Array();
    var sqlquery = "SELECT  * FROM biddings WHERE bidding_index = ?";
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
                    var sql = "UPDATE biddings SET current_price = ?, bidder_id=?  WHERE bidding_index = ?";
                    connection.query(sql, [bidder_bidding_price, bidder_id, bidding_index], function (err) {
                        if (err) {
                            console.log("updating failed");
                            cb(false, null);
                        }
                        else {
                            console.log("비딩 정보 수정완료");
                            alert_former_bidder(bidding_index, function(result){
                                if(result==true){
                                    console.log("notice update true")
                                    cb(true, bidding_index);
                                }
                            });
                        }
                    });
                }
            }
            else{
                console.log('실패실패!');
                cb(false, null);
            }
        } else {
            console.log("비딩 실패");
            cb(false, null);
        }
    });
}

//새로운 참여자로 인한 비딩 수정
router.post('/add_bidding', function (req, res, next) {
    var bidding_index = req.body.bidding_index;
    var bidder_id = req.session.buyer_id;
    var bidder_bidding_price = req.body.bidder_bidding_price;
  
    console.log("bidder_id :" + bidder_id);
    
    async.series(
        [
            function (callback) {
            addbidding(bidding_index, bidder_id, bidder_bidding_price, function(result, bidding_index){
                if(result==true){
                    callback(true, null);
                }else{
                    callback(false, null);
                }
            });
            }
        ],
        function (result, blah) {
            if(result==true){
                res.redirect('/reselling');
           /* res.render('reselling', {
                reselling_list: result[0]
                });*/
            }else{
                console.log("add bidding failed");
                res.redirect('back');
            }
        }
    );
});


 /* if (check_bidding_valid(bidding_index, bidder_bidding_price) === true) {
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
    }
});*/

module.exports = router;