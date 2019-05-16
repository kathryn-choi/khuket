var express = require('express');
var async = require('async');
var router = express.Router();
//var network = require('./network/network.js');

//id 값을 가진 buyer's info 및 notifications
console.log("mypage!");
function get_my_info(id,cb){
    console.log(id);
    var sqlquery = "SELECT  * FROM buyers WHERE buyer_id = ?";
    var my_registration_info=new Array();
    var my_notifications=new Array();
    var myinfo= new Array();
    connection.query(sqlquery,id,function(err,rows){
        if(!err){
            my_registration_info=rows;
          //  console.log(myinfo);
            var sqlquery = "SELECT  * FROM notification  WHERE notice_buyer_id= ?";
            connection.query(sqlquery, id, function (err, rows) {
                if (!err) {
                    my_notifications=rows;
                    myinfo=my_registration_info.concat(my_notifications);
                    console.log(myinfo);
                    cb(myinfo);
                } else {
                    console.log("내 정보를 가져오는데 실패했습니다!");
                    //throw err;
                }
            });
          //  return myinfo;
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}
/*
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
*/

/*
//티켓 resell하기
function resell_ticket(id, starting_time,  current_price, starting_price, ticket_id, end_time, cb){
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
        max_price: current_price*1.25;
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
*/

router.post('/delete_notification', function(req, res, next) {
    var notification_index=req.body.notification_index;
    var sqlquery = "DELETE FROM notification WHERE notification_index= ?";
    connection.query(sqlquery, notification_index, function (err) {
        if (!err) {
            console.log("Notification deleted successfully");
            res.redirect('/mypage');
        } else {
            console.log("Notification deleted failed");
            throw err;
        }
    });
});

router.post('/update', function(req, res, next) {
    var buyer_email=req.body.buyer_email;
    var buyer_contact=req.body.buyer_contact;
    var buyer_account=req.body.buyer_account;
    var buyer_id=req.user.user_id;
    var sql='UPDATE buyer SET buyer_email=?, buyer_contact=?, buyer_account=?  WHERE buyer_id = ?';
    var values=[buyer_email, buyer_contact, buyer_account, buyer_id];
    connection.query(sql,values , function (err) {
        if (err) {
            console.log("updating user failed");
            throw err;
        } else {
            console.log("user updated successfully");
            res.redirect('back');
        }
    });
});

router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        async.series(
            [
                function(callback){
                    get_my_info(req.session.buyer_id, function (myinfo_list) {
                        callback(null,myinfo_list);
                    });
                }
            ],
            function(err, results){
                res.render('mypage', {
                    myinfo: results[0]
                });
            }
        );
    }else{
        async.series(
            [
                function(callback){
                    get_my_info(req.user.user_id, function (myinfo_list) {
                        callback(null,myinfo_list);
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


module.exports = router;