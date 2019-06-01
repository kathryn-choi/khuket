var express = require('express');
var async = require('async');
var router = express.Router();
var network = require('../ticketing-system/network.js');

//id 값을 가진 buyer's info 및 notifications
console.log("mypage!");
function get_my_info(id,cb){
    console.log(id);
    var sqlquery = "SELECT  * FROM buyers WHERE buyer_id = ?";
    var my_registration_info=new Array();
    var my_notifications=new Array();
    var myinfo= new Array();
    var mytickets=new Array();
    connection.query(sqlquery,id,function(err,rows){
        if(!err){
            my_registration_info=rows;
            var sqlquery = "SELECT  * FROM notifications  WHERE notice_buyer_id= ?";
            connection.query(sqlquery, id, function (err, rows) {
                if (!err) {
                    my_notifications=rows;
                    myinfo=my_registration_info.concat(my_notifications);
                    get_my_tickets(id, function(result, ticketlist){
                        if(result==true){
                            mytickets=ticketlist;
                        }else {
                            mytickets=[];
                        }
                    });
                    console.log(myinfo);
                    console.log(mytickets.length);
                    cb(true, myinfo, mytickets);
                } else {
                    console.log("내 정보를 가져오는데 실패했습니다!");
                    cb(false, [], []);
                }
            });
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            cb(false, [], []);
        }
    });
}

//id 값을 가진 buyer가 구매한 티켓들 가져오기
//list of buyer(id)'s tickets
function get_my_tickets(buyer_index,cb){
    console.log("buyer_id:",buyer_index)
    network.get_ticket_info_by_user(buyer_index).then((response) => { 
            //return error if error in response
        if (response.error != null) {
            console.log("network get ticket info failed");
            cb(false, []);
        } else {
            var get_my_tickets = response;
            var my_tickets=new Array(); 
            for(i=0; i<get_my_tickets.length; i++) {
                console.log(get_my_tickets[i])
                var stringfy_tickets=JSON.stringify(get_my_tickets[i]);
                var obj =  JSON.parse(stringfy_tickets);
               for( var key in obj ) {
                   console.log(key + '=>' + obj[key] );
                   if(key == 'gig_id'){
                my_tickets[i].gig_id=obj[key];
                   }
                   else if(key == 'gig_name'){
                    my_tickets[i].gig_name=obj[key];
                       }
                   else if(key == 'gig_datetime'){
                my_tickets[i].gig_datetime=obj[key];
                   }
                    else if(key == 'gig_venue'){
                my_tickets[i].gig_venue=obj[key];
                   }
                 else if (key== 'seat_id'){
                    my_tickets[i].seat_id=obj[key];
                }else if (key== 'section_id'){
                    my_tickets[i].section_id=obj[key];
                }else if (key== 'ticket_price'){
                    my_tickets[i].row_id=obj[key];
                }else if (key== 'row_id'){
                    my_tickets[i].seat_id=obj[key];
                }else if (key== 'ticket_id'){
                    my_tickets[i].ticket_id=obj[key];
                }
              }
            }
            cb(true,my_tickets);
            console.log(my_tickets);
        }
    })
}

function get_ticket_detail(user_id, ticket_id, cb){
    network.get_ticket_info_by_id(user_id, ticket_id).then((response) => { 
        //return error if error in response
    if (response.error != null) {
        console.log("network get ticket info failed");
        cb(false, []);
    } else {
        var get_my_ticket = response;
        var ticketinfo=new Array(); 
            console.log(get_my_ticket)
            var stringfy_tickets=JSON.stringify(get_my_tickets[i]);
            var obj =  JSON.parse(stringfy_tickets);
           for( var key in obj ) {
               console.log(key + '=>' + obj[key] );
               if(key == 'gig_id'){
                ticketinfo[i].gig_id=obj[key];
               }else if(key == 'gig_name'){
                ticketinfo[i].gig_name=obj[key];
                   }
               else if(key == 'gig_datetime'){
                ticketinfo[i].gig_datetime=obj[key];
               }
                else if(key == 'gig_venue'){
                ticketinfo[i].gig_venue=obj[key];
               }
             else if (key== 'seat_id'){
                ticketinfo[i].seat_id=obj[key];
            }else if (key== 'section_id'){
                ticketinfo[i].section_id=obj[key];
            }else if (key== 'ticket_price'){
                ticketinfo[i].row_id=obj[key];
            }else if (key== 'row_id'){
                ticketinfo[i].seat_id=obj[key];
            }
          }
          console.log(ticketinfo);
          getqrcode(ticket_id, gig_datetime, function(result,qrcode){
              if(result==true){
                cb(true,ticketinfo,qrcode);
              }else{
                cb(true,ticketinfo,"not time yet!");
              }          
            });
        }
    })
}

function getqrcode(ticket_id, gig_datetime, cb){
    var current_date = new Date();
    var current_time = current_date.getDate() + "/"
        + (current_date.getMonth()+1)  + "/"
        + current_date.getFullYear() + "/"
        + current_date.getHours() + ":"
        + current_date.getMinutes() + ":"
        + current_date.getSeconds();
    
    var datetime=gig_datetime.split(" ");
    var gig_date=datetime[0];
    var gig_time=datetime[1];
    if(gig_date==current_date && gig_time-current_time<=3){
        cb(true, "qrcode"); //qrcode
    }else{
        cb(false);
    }
}

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
        max_price: current_price*1.25,
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


router.post('/delete_notification', function(req, res, next) {
    var notification_index=req.body.notification_index;
    var sqlquery = "DELETE FROM notifications WHERE notification_index= ?";
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
    var sql='UPDATE buyers SET buyer_email=?, buyer_contact=?, buyer_account=?  WHERE buyer_id = ?';
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
        async.series(
            [
                function(callback){
                    get_my_info(req.session.buyer_id, function (result,myinfo_list, myticketlist) {
                        if(result==true){
                        callback(myinfo_list, myticketlist);}else{
                            throw err;
                        }
                    });
                }
            ],
            function(myinfo, myticket){
                console.log(myticket);
                console.log("MyInfo1:",myinfo)
                res.render('mypage', {
                    myinfo: myinfo,
                    mytickets: myticket,
                    user_id:req.session.buyer_id,
                });
            }
        );
});

router.get('/:ticket_id', function(req, res, next) {
    async.series(
        [
            get_ticket_detail(req.session.buyer_id, req.params.ticket_id, function (result, ticket_info) {
                    if(result==true){
                        res.render('ticketdetail', {
                            ticket_info: ticket_info,
                            user_id:req.session.buyer_id,
                        });
                }else{
                        console.log(" no detail!!");
                        res.redirect('/');
                    }
                })
        ]
    );
});

router.post('/resell', function(req, res, next) {
    async.series(
        [
            resell_ticket(req.session.buyer_id, req.body.starting_time, req.body.current_price, req.body.starting_price, req.body.ticket_id, req.body.end_time, function(result){
                if(result==true){
                    res.redirect('/reselling');
                }else{
                    res.redirect('/back');
                }
            })
        ]
    );
});
module.exports = router;