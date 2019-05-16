var express = require('express');
var router = express.Router();
var async = require('async');
//var network = require('./network/network.js');

function get_reselling_ticket_list_info(cb) {
  /*  var reselling_ticket_list = new Array();
    var reselling_list = get_reselling_list();
    var reselling_list = get_reselling_list();
           // get_ticket_info_by_user : async function (user_id) ===>> returns allTicket but dunno how its gonna work
            var gig_index = network.get_ticket_info_by_id(reselling_list.ticket_owner_id, reselling_list.ticket_id).gig_id;
            var sql = 'SELECT gig_venue, gig_name, gig_time, gig_date FROM gig WHERE gig_index=?';
            connection.query(sql, gig_index, function (err, rows) {
                const resell_ticket = {
                    ticket_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_id, reselling_list.ticket_id).ticket_id,
                    section_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_id, reselling_list.ticket_id).section_id,
                    row_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_id, reselling_list.ticket_id).row_id,
                    seat_id: network.get_ticket_info_by_id(reselling_list.ticket_owner_id, reselling_list.ticket_id).seat_id,
                    ticket_price: network.get_ticket_info_by_id(reselling_list.ticket_owner_id, reselling_list.ticket_id).ticket_price,
                    gig_venue: rows.gig_venue,
                    gig_name: rows.gig_name,
                    gig_time: rows.gig_time,
                    gig_date: rows.gig_date,
                };
                var index = reselling_list.bidding_index;
                reselling_ticket_list[index] = resell_ticket;
                cb(reselling_ticket_list);
                console.log(reselling_ticket_list);
                return reselling_ticket_list;
            });
        } else {
            console.log('내 정보를 가져오는데 실패했습니다!');
            //throw err;
        }
    });*/
}
//비딩 테이블에 저장된 리스트 가져오기
function get_reselling_list(cb) {
    console.log("get_reselling_list");
    check_bidding_over();
    var sqlquery = 'SELECT * FROM bidding b';
    var reselling_list = new Array();
    connection.query(sqlquery, function (err, rows) {
        if (!err) {
            reselling_list = rows;
            cb(reselling_list);
            console.log(reselling_list);
            return reselling_list;
        } else {
            console.log('내 정보를 가져오는데 실패했습니다!');
            //throw err;
        }
    });
}
//bidding winner가 생겼다고 기존 ticket owner에게 알리기
/*
function alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price) {
    var gig_venue = network.get_ticket_info_by_id(ticket_owner_id, ticket_id).gig_venue;
    var gig_name =  network.get_ticket_info_by_id(ticket_owner_id, ticket_id).gig_name;
    var gig_time =  network.get_ticket_info_by_id(ticket_owner_id, ticket_id).gig_time;
    var section_id= network.get_ticket_info_by_id(ticket_owner_id, ticket_id).section_id;
    var row_id=network.get_ticket_info_by_id(ticket_owner_id, ticket_id).row_id;
    var seat_id=network.get_ticket_info_by_id(ticket_owner_id, ticket_id).seat_id;
    var notice= ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString() +
                 '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString() + ' has been sold at ' +current_price;
    connection.query('INSERT INTO notification SET ?;', {
        notification_buyer_index: ticket_owner_id,
        notice_buyer_text: notice,
    });
    return true;
}
*/
//reselling_ticket 지우기 (시간 관계 or max price 등등)
function delete_reselling_ticket(bidding_index, cb) {
    var sqlquery = 'DELETE FROM bidding WHERE bidding_index= ?';
    connection.query(sqlquery, bidding_index, function (err) {
        if (!err) {
            console.log('비딩 삭제 성공');
        } else {
            console.log('비딩 삭제 실패');
            throw err;
        }
    });
}

//change ticket owner of bidding winner
/*
function change_ticket_owner(bidding_index,bidder_id, ticket_owner_id, ticket_id, current_price, bidder_index, cb) {
    if (bidder_index !== -1) {
        if (network.update_ticket_owner(bidder_id, ticket_id) === true) {
            delete_reselling_ticket(bidding_index);
            if (alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price) === true) {
                console.log('alert ticket owner has changed');
            }
        }
    }
    //no bidder -> alert ticket_owner there wasn't any bidder
    else{
        delete_reselling_ticket(bidding_index);
        var gig_venue = network.get_ticket_info_by_id(ticket_owner_id, ticket_id).gig_venue;
        var gig_name =  network.get_ticket_info_by_id(ticket_owner_id, ticket_id).gig_name;
        var gig_time =  network.get_ticket_info_by_id(ticket_owner_id, ticket_id).gig_time;
        var section_id= network.get_ticket_info_by_id(ticket_owner_id, ticket_id).section_id;
        var row_id=network.get_ticket_info_by_id(ticket_owner_id, ticket_id).row_id;
        var seat_id=network.get_ticket_info_by_id(ticket_owner_id, ticket_id).seat_id;
        var notice='Unfortunately there was no bidder for' + ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString() +
            '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString();
        connection.query('INSERT INTO notification SET ?;', {
            notification_buyer_index: ticket_owner_id,
            notice_buyer_text: notice,
        });
        console.log('alert there wasn\'t any bidder');
    }
}*/

//끝난 비딩 체크하기
function check_bidding_over(cb) {
    var current_date = new Date();
    var right_now_time = current_date.getDate() + '/' +
            (current_date.getMonth() + 1) + '/' +
            current_date.getFullYear() + ' @ ' +
            current_date.getHours() + ':' +
            current_date.getMinutes() + ':' +
            current_date.getSeconds();
    var sqlquery = 'SELECT * FROM bidding b';
    var bidding_list = new Array();
    connection.query(sqlquery, function (err, rows) {
        if (!err) {
            bidding_list=rows;
            for (var i = 0; i < bidding_list.length; i++) {
                if (right_now_time >= bidding_list[i].end_time || bidding_list[i].max_price === bidding_list[i].current_price) {
                    console.log('bidding over!');
                 //   change_ticket_owner(bidding_list[i].bidding_index, bidding_list[i].bidder_id, bidding_list[i].ticket_owner_id, bidding_list[i].ticket_id, bidding_list[i].current_price);
                }
            }
        }
        else
        {
            console.log('getting bidding list failed');
            throw err;
        }
    });
}

//bidding 정보 return
router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        async.parallel(
            [
                function (callback) {
                    get_reselling_list(function (reselling_list) {
                        callback(null, reselling_list);
                    });
                }/*,
                function (callback) {
                    get_reselling_ticket_list_info( function (reselling_ticket_list) {
                        callback(null, reselling_ticket_list);
                    });
                }*/
            ],
            function (err, results) {
                res.render('reselling', {
                    reselling_list: results[0],
                    user_id: req.user.user_id,
                  //  reselling_ticket_list: results[0],
                });
            }
        );
    }
});
/*
//bidding ticket 관련 정보 보내기
router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        async.series(
            [
                function (callback) {
                    get_reselling_ticket_list_info( function (reselling_ticket_list) {
                        callback(null, reselling_ticket_list);
                    });
                }
            ],
            function (err, results) {
                res.render('/', {
                    reselling: results[0]
                });
            }
        );
    }
});
*/

module.exports = router;