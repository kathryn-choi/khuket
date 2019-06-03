var express = require('express');
var router = express.Router();
var async = require('async');
var network = require('../ticketing-system/network.js');

//비딩 테이블에 저장된 리스트 가져오기
function get_reselling_list(cb) {
    console.log("get_reselling_list");
    check_bidding_over(function(result){
        if(result==true){
            var sqlquery = 'SELECT * FROM biddings b';
            var reselling_list = new Array();
            connection.query(sqlquery, function (err, rows) {
                if (!err) {
                    reselling_list = rows;
                    console.log(reselling_list);
                    cb(true, reselling_list);
                } else {
                    console.log('내 정보를 가져오는데 실패했습니다!');
                    cb(false, null);
                }
            });
        }else{
            cb(false, null);
        }
    });
}

//reselling ticket list info
function get_reselling_ticket_list_info(cb) {
    var reselling_ticket_list = new Array();
   get_reselling_list(function (result, reselling_list) {
        if(result==true){
           var length=reselling_list.length;
           var count=0;
           for(var i=0; i<reselling_list.length; i++){
               var ticket_owner_id=reselling_list[i].ticket_owner_id;
               var ticket_id=reselling_list[i].ticket_id;
                network.get_ticket_info_by_id(ticket_owner_id, ticket_id).then((response) => {
                    var resellticket=response;
                    const resell_ticket = {
                        ticket_id: resellticket.ticket_id,
                        section_id: resellticket.section_id,
                        row_id: resellticket.row_id,
                        seat_id: resellticket.seat_id,
                        ticket_price: resellticket.ticket_price,
                        gig_index: resellticket.gig_id,
                        gig_venue: resellticket.gig_venue,
                        gig_name: resellticket.gig_name,
                        gig_datetime: resellticket.gig_datetime,
                        starting_time: reselling_list[i].starting_time,
                        end_time: reselling_list[i].end_time,
                        max_price: reselling_list[i].max_price,
                        current_price: reselling_list[i].current_price,
                    };
                    reselling_ticket_list.push(resell_ticket);
                    count=count+1;
                    console.log(reselling_ticket_list);
                    if(count==length){
                        cb(true, reselling_ticket_list);
                    }
                });
            }         
        } else {
            console.log('내 정보를 가져오는데 실패했습니다!');
            cb(false, null);
        }
    });
    cb(false, null);
}

//bidding winner가 생겼다고 기존 ticket owner에게 알리기
function alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price,cb) {
    network.get_ticket_info_by_id(ticket_owner_id, res.ticket_id).then((response) => {
    var ticket=response;
    var gig_venue = ticket.gig_venue;
    var gig_name =  ticket.gig_name;
    var gig_datetime =  ticket.gig_datetime;
    var section_id= ticket.section_id;
    var row_id=ticket.row_id;
    var seat_id=ticket.seat_id;
    var notice= ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString() +
                 '\n DateTime : ' + gig_datetime.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString() + ' has been sold at ' +current_price;
    connection.query('INSERT INTO notification SET ?;', {
        notification_buyer_index: ticket_owner_id,
        notice_buyer_text: notice,
        });
        cb(true);
    });
    cb(false);
}

//reselling_ticket 지우기 (시간 관계 or max price 등등)
function delete_reselling_ticket(bidding_index, cb) {
    var sqlquery = 'DELETE FROM biddings WHERE bidding_index= ?';
    connection.query(sqlquery, bidding_index, function (err) {
        if (!err) {
            console.log('비딩 삭제 성공');
            cb(true);
        } else {
            console.log('비딩 삭제 실패');
            cb(false);
        }
    });
}

//change ticket owner of bidding winner
function change_ticket_owner(bidding_index,bidder_id, ticket_owner_id, ticket_id, current_price, bidder_index, cb) {
    if (bidder_index != -1) {
        network.update_ticket_owner(bidder_id, ticket_id).then((response) => {
            if(response== true) {
                delete_reselling_ticket(bidding_index, function(result){
                if(result==true){
                    alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price, function(r){
                        if(r==true) {
                        console.log('alert ticket owner has changed');
                        cb(true);
                        }
                    })
                }
            });
        }
    });
    }
    //no bidder -> alert ticket_owner there wasn't any bidder
    else{
        delete_reselling_ticket(bidding_index, function(result){
            if(result==true){
                network.get_ticket_info_by_id(ticket_owner_id, ticket_id).then((response) => {          
                    var gig_venue = response.gig_venue;
                    var gig_name = response.gig_name;
                    var gig_time = response.gig_time;
                    var section_id = response.section_id;
                    var row_id = response.row_id;
                    var seat_id = response.seat_id;
                    var notice = 'Unfortunately there was no bidder for' + ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString() +
                        '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString();
                connection.query('INSERT INTO notification SET ?;', {
                    notification_buyer_index: ticket_owner_id,
                    notice_buyer_text: notice,
                });
                console.log('alert there wasn\'t any bidder');
                cb(true);
            });
        } else{
            cb(false);
        }
    });
    }
    cb(false);
};

//끝난 비딩 체크하기
function check_bidding_over(cb) {
    var current_date = new Date();
    var right_now_time = current_date.getFullYear() + ' / ' +
            (current_date.getMonth() + 1) + '/' +
            current_date.getDate() + ' ' +
            current_date.getHours() + ':' +
            current_date.getMinutes() + ':' +
            current_date.getSeconds();
    var sqlquery = 'SELECT * FROM biddings b';
    var bidding_list = new Array();
    connection.query(sqlquery, function (err, rows) {
        if (!err) {
            bidding_list=rows;
            for (var i = 0; i < bidding_list.length; i++) {
                if (right_now_time >= bidding_list[i].end_time || bidding_list[i].max_price === bidding_list[i].current_price) {
                    console.log('bidding over!');
                    change_ticket_owner(bidding_list[i].bidding_index, bidding_list[i].bidder_id, bidding_list[i].ticket_owner_id, bidding_list[i].ticket_id, bidding_list[i].current_price, function(result){
                       if(result==false){
                            cb(false);
                        }
                    });
                }
            }
        }
        else
        {
            console.log('getting bidding list failed');
            cb(false);
        }
    });
    cb(true);
}

//reselling 정보 return
router.get('/', function (req, res, next) {
        async.series(
            [
                function (callback) {
                    get_reselling_ticket_list_info(function (result, reselling_list) {
                        if(result==true){
                            callback(reselling_list);
                        }else{
                            console.log("reselling ticket info failed");
                            res.redirect('/');
                        }
                    });
                }
            ],
            function (results) {
                res.render('reselling', {
                    reselling_list: results[0],
                    user_id : req.session.user_id,
                });
            }
        ); 
});


module.exports = router;