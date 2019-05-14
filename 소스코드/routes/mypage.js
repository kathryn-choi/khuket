import * as connection from "express";
var express = require('express');
var async = require('async');
var router = express.Router();
var network = require('./network/network.js');

//id 값을 가진 buyer 개인정보 가져오기
//list of buyer(id)'s info
console.log("mypage!");
function get_my_info(id,cb){
    var sqlquery = "SELECT  b.buyer_name, b.buyer_id, b.buyer_email, b.buyer_contact, b.buyer_account FROM buyer b WHERE b.buyer_index = ?";
    var myinfo;
    connection.query(sqlquery,id,function(err,res){
        if(!err){
            myinfo={
                buyer_name: res.buyer_name,
                buyer_id: res.buyer_id,
                buyer_email: res.buyer_email,
                buyer_contact: res.buyer_contact,
                buyer_account: res.buyer_account,
                notification: res.notification

            }
            cb(myinfo);
            console.log(myinfo);
            return myinfo;
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}

//id 값을 가진 buyer가 구매한 티켓들 가져오기
//list of buyer(id)'s tickets
function get_my_tickets(buyer_index,cb){
    var get_my_tickets = network.get_ticket_info_by_user(buyer_index); //allTickets return 됨
    var my_tickets=new Array();
    for(i=0; i<get_my_tickets.size(); i++) {
        my_tickets[i].row_id = get_my_tickets[i].gig_id;
        my_tickets[i].seat_id = get_my_tickets[i].seat_id;
        my_tickets[i].section_id = get_my_tickets[i].section_id;
        my_tickets[i].ticket_price = get_my_tickets[i].ticket_price;
        my_tickets[i].row_id = get_my_tickets[i].row_id;
        my_tickets[i].gig_id = get_my_tickets[i].gig_id;
        var sqlquery = "SELECT  * FROM gig  WHERE gig_index= ?";
        connection.query(sqlquery, my_tickets[i].gig_id, function (err, res) {
            if (!err) {
                my_tickets[i].gig_name = res.gig_name;
                my_tickets[i].gig_venue = res.gig_venue;
                my_tickets[i].gig_time = res.gig_time;
                my_tickets[i].gig_date = res.gig_date;
            } else {
                console.log("내 정보를 가져오는데 실패했습니다!");
                //throw err;
            }
        });
    }
        cb(my_tickets);
        console.log(my_tickets);
        return my_tickets;
}

function get_my_notifications(buyer_index,cb){
    var my_notices=new Array();
    var sqlquery = "SELECT  * FROM notification  WHERE notice_buyer_index= ?";
    connection.query(sqlquery, buyer_index, function (err, rows) {
        if (!err) {
           my_notices=rows;
        } else {
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
    cb(my_notices);
    console.log(my_notices);
    return my_notices;
}

//티켓 resell하기
function resell_ticket(id, starting_time, max_price, current_price, starting_price, ticket_id, end_time, cb){
    var current_date = new Date();
    var current_time = "Last Sync: " + current_date.getDate() + "/"
        + (current_date.getMonth()+1)  + "/"
        + current_date.getFullYear() + " @ "
        + current_date.getHours() + ":"
        + current_date.getMinutes() + ":"
        + current_date.getSeconds();
    connection.query("INSERT INTO bidding SET ?;", {
        current_time : current_time,
        starting_time : starting_time,
        ticket_owner_index: id,
        max_price: max_price,
        current_price: current_price,
        bidder_index: -1,
        ticket_id: ticket_id,
        starting_price: starting_price,
        end_time: end_time
    },function (err) {
        if(err) {
            throw err;
            console.log("비딩 추가중 에러!")
        } else{
            // alert("추가되었습니다.")
            cb();
        }
    });
}

router.get('/mypage', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                    //get_my_info(req.user.user_id, function (myinfo_list) {
                    get_my_info(id, function (myinfo) {
                        callback(null,myinfo);
                    });
                }
            ],
            function(err, results){
                res.render('mypage', {
                    myinfo: results[0]
                });
            }
        );
    }
});

router.get('/mypage', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                    get_my_notifications(id, function (my_notices) {
                        callback(null,my_notices);
                    });
                }
            ],
            function(err, results){
                res.render('mypage', {
                    my_notices: results[0]
                });
            }
        );
    }
});

router.get('/mypage', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                    //get_my_info(req.user.user_id, function (myinfo_list) {
                    get_my_tickets(id, function (my_tickets) {
                        callback(null,my_tickets);
                    });
                }
            ],
            function(err, results){
                res.render('mypage', {
                    my_tickets: results[0]
                });
            }
        );
    }
});



module.exports = router;