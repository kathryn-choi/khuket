var express = require('express');
var router = express.Router();
var async = require('async');
var network = require('./network/network.js');

function get_reselling_ticket_list_info(cb) {
    var reselling_ticket_list = new Array();
    var reselling_list = new Array();
    var sqlquery = "SELECT ticket_owner_index, ticket_id FROM bidding b";
    connection.query(sqlquery, function (err, rows) {
        if (!err) {
            reselling_list = rows;
            var gig_index = network.get_ticket_info_by_id(reselling_list.ticket_owner_index, reselling_list.ticket_id).gig_id;
            var sql = "SELECT gig_venue, gig_name, gig_time, gig_date FROM gig WHERE gig_index=?";
            connection.query(sql, gig_index, function (err, rows) {
                gig_info = rows;
                const resell_ticket = {
                    ticket_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_index, reselling_list.ticket_id).ticket_id,
                    section_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_index, reselling_list.ticket_id).section_id,
                    row_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_index, reselling_list.ticket_id).row_id,
                    seat_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_index, reselling_list.ticket_id).seat_id,
                    ticket_price: network.get_ticket_info_by_id(reselling_list.ticket_owner_index, reselling_list.ticket_id).ticket_price,
                    gig_venue: rows.gig_venue,
                    gig_name: rows.gig_name,
                    gig_time: rows.gig_time,
                    gig_date: rows.gig_date,
                }
                var index = reselling_list.bidding_index;
                reselling_ticket_list[index] = resell_ticket;
                cb(reselling_ticket_list);
                console.log(reselling_ticket_list);
                return reselling_ticket_list;
            });
        } else {
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}
//비딩 테이블에 저장된 리스트 가져오기
    function get_reselling_list(cb) {
        //current_time : current_time, starting_time : starting_time, ticket_owner_index: id, max_price: max_price, current_price: current_price, starting_price: starting_price, bidder_index: -1
        var sqlquery = "SELECT * FROM bidding b";
        var reselling_list = new Array();
        connection.query(sqlquery, function (err, rows) {
            if (!err) {
                reselling_list = rows;
                cb(reselling_list);
                console.log(reselling_list);
                return reselling_list;
            } else {
                console.log("내 정보를 가져오는데 실패했습니다!");
                //throw err;
            }
        });
}
//bidding winner가 생겼다고 기존 ticket owner에게 알리기
function alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price) {
    var sqlquery = "SELECT  * FROM bidding b WHERE b.bidding_index = ?";
    connection.query(sqlquery, ticket_owner_id, function (err, res) {
        if (!err) {
            var gig_venue = network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).gig_venue;
            var gig_name =  network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).gig_name;
            var gig_time =  network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).gig_time;
            var section_id= network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).section_id;
            var row_id=network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).row_id;
            var seat_id=network.get_ticket_info_by_id(res.bidder_index, res.ticket_id).seat_id;
             var notice= ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString()
                 + '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString() + " has been sold at " +current_price;
             connection.query("INSERT INTO notification SET ?;", {
                            notification_buyer_index: ticket_owner_id,
                            notice_buyer_text: notice,
                        });
            return true;
        }
        else {
            throw err;
        }
    });
}

//reselling_ticket 지우기 (시간 관계 or max price 등등)
function delete_reselling_ticket(bidding_index, cb) {
    var sqlquery = "DELETE FROM bidding WHERE bidding_index= ?";
    connection.query(sqlquery, bidding_index, function (err) {
        if (!err) {
            console.log("비딩 삭제 성공");
        } else {
            console.log("비딩 삭제 실패");
            throw err;
        }
    });
}

//change ticket owner of bidding winner
function change_ticket_owner(bidding_index, bidder_index, ticket_owner_id, ticket_id, current_price, cb)
{
    if(network.update_ticket_owner(bidder_index, ticket_id)==true) {
        delete_reselling_ticket(bidding_index);
        if(alert_original_ticket_owner(ticket_owner_id,ticket_id, current_price)==true) {
            console.log("alert 성공");
        }
    }
}

//지워야되는 reselling_ticket 판별하기
    function check_bidding_over(cb) {
        var current_bidding_info;
        var sqlquery = "SELECT  * FROM bidding b WHERE ";
        var current_date = new Date();
        var right_now_time = current_date.getDate() + "/"
            + (current_date.getMonth() + 1) + "/"
            + current_date.getFullYear() + " @ "
            + current_date.getHours() + ":"
            + current_date.getMinutes() + ":"
            + current_date.getSeconds();
        connection.query(sqlquery, function (err, res) {
            if (!err) {
                current_bidding_info = {
                    bidding_index: res.bidder_index,
                    current_time: res.current_time,
                    starting_time: res.starting_time,
                    ticket_owner_index: res.ticket_owner_index,
                    max_price: res.max_price,
                    current_price: res.current_price,
                    starting_price: res.starting_price,
                    bidder_index: res.bidder_index,
                    ticket_id: res.ticket_id,
                    end_time: res.end_time,
                }
                //메소드 작성하기
                // 현재 시간 전이여야 하며 최댓값보다 작고, 스타팅 타임 이후여야 됨
                if (right_now_time >= current_bidding_info.end_time || current_bidding_info.current_price == current_bidding_info.max_price) // 시간 관련 조건
                {
                    change_ticket_owner(current_bidding_info.bidding_index, current_bidding_info.bidder_index, current_bidding_info.ticket_owner_index, current_bidding_info.ticket_id, current_bidding_info.current_price);
                }
            }
        });
    }

//끝난 비딩 지우기
router.get('/reselling', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        async.series(
            [
                function (callback) {
                    check_bidding_over(function (reselling_list) {
                        callback(null, reselling_list);
                    });
                }
            ],
            function (err, results) {
                res.render('bidding', {
                    reselling: results[0]
                });
            }
        );
    }
});

//bidding 정보 return
    router.get('/reselling', function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/');
        } else {
            async.series(
                [
                    function (callback) {
                        get_reselling_list(function (reselling_list) {
                            callback(null, reselling_list);
                        });
                    }
                ],
                function (err, results) {
                    res.render('bidding', {
                        reselling: results[0]
                    });
                }
            );
        }
    });

//bidding ticket 관련 정보 보내기
    router.get('/reselling', function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/');
        } else {
            async.series(
                [
                    function (callback) {
                        get_reselling_ticket_list_info(id, function (reselling_ticket_list) {
                            callback(null, reselling_ticket_list);
                        });
                    }
                ],
                function (err, results) {
                    res.render('bidding', {
                        reselling: results[0]
                    });
                }
            );
        }
    });


module.exports = router;