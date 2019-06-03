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
                    //console.log(reselling_list);
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
    var count=0;
   get_reselling_list(function (result, reselling_list) {
        if(result==true){
            console.log(9 + reselling_list);
           var length=reselling_list.length;
           for(var i=0; i<reselling_list.length; i++){
            const resell_ticket = {
                ticket_id: "",
                section_id: "",
                row_id: "",
                seat_id: "",
                ticket_price: "",
                gig_index: "",
                gig_venue: "",
                gig_name: "",
                gig_datetime: "",
                starting_time:"",
                end_time: "",
                max_price: "",
                current_price: "",
            };
            reselling_ticket_list.push(resell_ticket);
        }
           for(var i=0; i<reselling_list.length; i++){
               var ticket_owner_id=reselling_list[i].ticket_owner_id;
               var ticket_id=reselling_list[i].ticket_id;
               var maxprice=reselling_list[i].max_price;
               var endtime=reselling_list[i].end_time;
               var starttime=reselling_list[i].starting_time;
               var curprice=reselling_list[i].current_price;
                network.get_ticket_info_by_id(ticket_owner_id, ticket_id).then((response) => {
                    if (response.error != null) {
                        console.log("network get ticket info failed");
                        cb(false, [""]);
                    } else {
                    var resellticket=response;
                    var stringfy_tickets=JSON.stringify(resellticket);
                    var obj =  JSON.parse(stringfy_tickets);
                    for( var key in obj ) {
                        console.log(key + '=>' + obj[key] );
                        if(key == 'gig_id'){
                            reselling_ticket_list[i].gig_id=obj[key].toString();
                        }else if(key == 'gig_name'){
                            reselling_ticket_list[i].gig_name=obj[key].toString();
                        }else if(key == 'gig_datetime'){
                            reselling_ticket_list[i].gig_datetime=obj[key].toString();
                        }else if(key == 'gig_venue'){
                            reselling_ticket_list[i].gig_venue=obj[key].toString();
                        }else if (key== 'seat_id'){
                            reselling_ticket_list[i].seat_id=obj[key].toString();
                        }else if (key== 'section_id'){
                            reselling_ticket_list[i].section_id=obj[key].toString();
                        }else if (key== 'ticket_price'){
                            reselling_ticket_list[i].ticket_price=obj[key].toString();
                        }else if (key== 'row_id'){
                        reselling_ticket_list[i].row_id=obj[key].toString();
                        }
                    }
                    reselling_ticket_list[i].max_price=maxprice;
                    reselling_ticket_list[i].end_time=endtime;
                    reselling_ticket_list[i].starting_time=starttime;
                    reselling_ticket_list[i].current_price=curprice;
                    count=count+1;
                    if(count==length){
                        console.log("tlist" + reselling_ticket_list);
                        cb(true, reselling_ticket_list);
                    }
                }
                });
            }         
        } else {
            console.log('query biddings table failed!');
        }
    });
    console.log(10);
    var emptyarray=[];
    return emptyarray;
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
    var month=current_date.getMonth()+1; + "-";
    var year = current_date.getFullYear() + "-";
    var date=current_date.getDate() + " ";
    var hour=current_date.getHours();
    var min=current_date.getMinutes();
    var sec=current_date.getSeconds();
        if(month.toString().length!=3){ //month.length ??
         month=current_date.getMonth() +1;
            month="0" +month + "-"
        }
        if(date.toString().length!=3){
            date="0" +current_date.getDate() +" "
        }
        if(hour.toString().length!=2){
            hour="0"+hour;
        }
        if(min.toString().length!=2){
            min="0"+min;
        }
        if(sec.toString().length!=2){
            sec="0"+sec;
        }
    var right_now_time=year+month+date+ hour +":" + min + ":"+ sec;
    var sqlquery = 'SELECT * FROM biddings b';
    var bidding_list = new Array();
    connection.query(sqlquery, function (err, rows) {
        if (!err) {
            bidding_list=rows;
            for (var i = 0; i < bidding_list.length; i++) {
                if (right_now_time >= bidding_list[i].end_time || bidding_list[i].max_price == bidding_list[i].current_price) {
                    console.log('bidding over!');
                    change_ticket_owner(bidding_list[i].bidding_index, bidding_list[i].bidder_id, bidding_list[i].ticket_owner_id, bidding_list[i].ticket_id, bidding_list[i].current_price, function(result){
                       if(result==false){
                            cb(false);
                        }
                    });
                }
            }
            cb(true);
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
                            var stringfy_tickets=JSON.stringify(reselling_list);
                            console.log("stringify" + stringfy_tickets);
                        callback(result, stringfy_tickets);
                        }else{
                            console.log("reselling ticket info failed");
                            res.redirect('/');
                        }
                    });
                }
            ],
            function (result,reselling_list) {
                if(result==true){
                    console.log("-1" + reselling_list[0]);
                    var resell_tickets = JSON.parse(reselling_list[0])
                res.render('reselling', {
                    reselling_list: resell_tickets,
                    user_id : req.session.user_id,
                });
            }
            }
        ); 
});


module.exports = router;