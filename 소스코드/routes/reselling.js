var express = require('express');
var router = express.Router();
var async = require('async');
const util = require('util');
var network = require('../ticketing-system/network.js');
//import Promise from 'thenfail';

//비딩 테이블에 저장된 리스트 가져오기
function get_reselling_list(callback) {
    console.log("get_reselling_list");
    check_bidding_over(function(result) { 
        if(result==true){
            console.log("check bidding over true");
            var sqlquery = 'SELECT * FROM biddings';
    connection.query(sqlquery, function (err, rows) {
        if (!err) {
            if(rows.length != 0){
                reselling_list = rows;
                callback(true, reselling_list);
            }else{
                callback(false, null);
            }
        }else{
            callback(false, null);
        }
        });
    }else{
            callback(false, null);
        }
    })
};

//bidding winner가 생겼다고 기존 ticket owner에게 알리기
async function alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price,cb) {
    network.get_ticket_info_by_id(ticket_owner_id, ticket_id).then((response) => {
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
    cb (false);
}

//reselling_ticket 지우기 (시간 관계 or max price 등등)
async function delete_reselling_ticket(bidding_index, callback) {
    var sqlquery = 'DELETE FROM biddings WHERE bidding_index= ?';
    connection.query(sqlquery, bidding_index, function (err) {
        if (!err) {
            console.log('비딩 삭제 성공');
            callback(true);
        } else {
            console.log('비딩 삭제 실패');
            callback(false);
        }
    });
}

//change ticket owner of bidding winner
async function change_ticket_owner(bidding_index,bidder_id, ticket_owner_id, ticket_id, current_price, bidder_index, cb) {
    if (bidder_index != '-1') {
        network.update_ticket_owner(bidder_id, ticket_id).then((response) => {
            if (response.error != null) {
                console.log("network update ticket owner failed");
                cb(false);
            } else {
                //else return success
                console.log("return true complete")
                    delete_reselling_ticket(bidding_index). then((result) => {
                    if(result==true){
                        alert_original_ticket_owner(ticket_owner_id, ticket_id, current_price, function(r){
                            if(r==true) {
                            console.log('alert ticket owner has changed');
                                cb (true);
                            }else{
                                cb (false);
                            }
                        })
                    }else{
                        cb(false);bidding_index
                    }
                });
            }
            });
    }
    //no bidder -> alert ticket_owner there wasn't any bidder
    else{
        delete_reselling_ticket(bidding_index).then((result) => {
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
                cb (true);
            });
        } else{
            cb (false);
        }
    });
    }
};

//끝난 비딩 체크하기
async function check_bidding_over(cb) {
    await console.log("checkbiddingover!!");
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
    var sqlquery = `SELECT * FROM biddings WHERE (end_time < STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')) OR (max_price = current_price)`;
    var bidding_list = new Array();
    connection.query(sqlquery, right_now_time, function (err, rows) {
        if (!err) {
            var num=0;
            console.log(19);
            bidding_list=rows;
            console.log(rows.length);
            for (var i = 0; i < bidding_list.length; i++) {
                console.log("checkbiddingover : "+bidding_list[i]);
                    change_ticket_owner(bidding_list[i].bidding_index, bidding_list[i].bidder_id, bidding_list[i].ticket_owner_id, bidding_list[i].ticket_id, bidding_list[i].current_price, function(result){
                       if(result==false){
                            num=-1;
                        }
                    });
                    if(num==-1){
                        break;
                    }
                }
                if(num==-1){
                    cb(false);
                }else{
                    cb(true);
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

//db query reselling info
function biddingsdb(cb){
    get_reselling_list(function (result, reselling_list) {
        console.log("get reselling list result: "+ result);
        if(result==true){
            var reselling_ticket_list = new Array();
            var length=reselling_list.length;
            console.log("length", length);
            if(length == 0){
                    cb(-1, 1);
            }else{
                var num=0;
               for(var i=0; i<length; i++){
                const resell_ticket = {
                    ticket_id: "",
                    section_id: "",
                    seat_id: "",
                    ticket_price: 0,
                    gig_index: "",
                    gig_venue: "",
                    gig_name: "",
                    gig_datetime: "",
                    starting_time:"",
                    end_time: "",
                    max_price: "",
                    current_price: 0,
                    };
                reselling_ticket_list.push(resell_ticket);
                }
                for (var i=0 ;i<reselling_list.length; i++){
                    reselling_ticket_list[i].ticket_id=reselling_list[i].ticket_id;
                    reselling_ticket_list[i].starting_time=reselling_list[i].starting_time;
                    reselling_ticket_list[i].end_time=reselling_list[i].end_time;
                    reselling_ticket_list[i].max_price=reselling_list[i].max_price;
                    reselling_ticket_list[i].current_price=reselling_list[i].current_price;
                }
                for (var i=0 ;i<reselling_list.length; i++){
                    reselling_ticket_list[i].ticket_price=reselling_list[i].max_price/(1.25);
                }
                for (var i=0 ;i<reselling_list.length; i++){
                    var ticket_id=reselling_ticket_list[i].ticket_id;
                    var tid=ticket_id.split('.');
                    reselling_ticket_list[i].section_id=tid[1];
                    reselling_ticket_list[i].seat_id=tid[2];
                    reselling_ticket_list[i].gig_index=tid[0];
                }
                var giginfo= new Array();
                var sqlquery = `SELECT * FROM gigs`;
                connection.query(sqlquery, function (err, rows) {
                        if (!err) {
                             giginfo=rows
                             cb(1, giginfo, reselling_ticket_list)
                        }else{
                            throw err;
                        }
                })
            }
        }else{
            cb(-1, 1);
        }
    });
};

function getlist(callback) {
    biddingsdb(function(result, giginfo, reselling_ticket_list) {
        if(result!=-1){
            var num=0;
            for (var i=0 ;i<reselling_list.length; i++){
                for (var j=0 ;j < giginfo.length; j++){
                        if(reselling_ticket_list[i].gig_index==giginfo[j].gig_index){
                            reselling_ticket_list[i].gig_name=giginfo[j].gig_name;
                            reselling_ticket_list[i].gig_venue=giginfo[j].gig_venue;
                            reselling_ticket_list[i].gig_datetime=giginfo[j].gig_date_time;
                            num=num+1;
                        }
                }
            }
                if(num==reselling_list.length){
                    callback(-1, reselling_ticket_list);
                }
        }else{
            callback(1, null);
        }
    })
}


router.get('/'  ,function(req, res, next) {
    getlist(function(r, rlist){
        if(r!=1){
            var promise1 = new Promise(function(resolve, reject) {
                resolve(rlist);
              });
              
              promise1.then(function(value) {
                console.log(value);
                console.log("rlist" ,value);
                res.render('reselling', {
                    reselling_list: value,
                    user_id : req.session.user_id,
                    });
                res.end();
              });
        }else{
                res.render('reselling', {
                    reselling_list: [],
                    user_id : req.session.user_id,
                });
                res.end();
            }
    })
});

module.exports = router;