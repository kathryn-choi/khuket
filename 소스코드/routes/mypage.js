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
                           /* console.log(123123+ ticketlist);
                            var t=JSON.stringify(ticketlist);
                            console.log(111+t);*/
                            cb(true, myinfo,ticketlist);
                        }else {
                            cb(false, myinfo, []);
                        }
                    });
                    console.log(myinfo);
                    console.log(mytickets.length);
                   
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
                var ticket={
                    gig_id: '',
                    gig_name: '',
                    gig_datetime: '',
                    gig_venue: '',
                    seat_id : '',
                    section_id: '',
                    row_id: '',
                    ticket_id: '',
                    ticket_price: 0,
                }
                my_tickets.push(ticket);
            }
            for(i=0; i<get_my_tickets.length; i++) {
                console.log(get_my_tickets[i])
                var stringfy_tickets=JSON.stringify(get_my_tickets[i]);
                var obj =  JSON.parse(stringfy_tickets);
               for( var key in obj ) {
                   console.log(i + " " + key + '=>' + obj[key] );
                   if(key == 'gig_id'){
                my_tickets[i].gig_id=obj[key].toString();
                   }
                   else if(key == 'gig_name'){
                    my_tickets[i].gig_name=obj[key].toString();
                       }
                   else if(key == 'gig_datetime'){
                my_tickets[i].gig_datetime=obj[key].toString();
                   }
                    else if(key == 'gig_venue'){
                my_tickets[i].gig_venue=obj[key].toString();
                   }
                 else if (key== 'seat_id'){
                    my_tickets[i].seat_id=obj[key].toString();
                }else if (key== 'section_id'){
                    my_tickets[i].section_id=obj[key].toString();
                }else if (key== 'ticket_price'){
                    my_tickets[i].ticket_price=obj[key].toString();
                }else if (key== 'row_id'){
                    my_tickets[i].row_id=obj[key].toString();
                }else if (key== 'ticket_id'){
                    my_tickets[i].ticket_id=obj[key].toString();
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
        console.log("HI")
        //return error if error in response
    if (response.error != null) {
        console.log("network get ticket info failed");
        cb(false, [""]);
    } else {
        var get_my_tickets = response;
            var my_tickets=new Array(); 
            for(i=0; i<get_my_tickets.length; i++) {
                var ticket={
                    gig_id: '',
                    gig_name: '',
                    gig_datetime: '',
                    gig_venue: '',
                    seat_id : '',
                    section_id: '',
                    row_id: '',
                    ticket_id: '',
                    ticket_price: 0,
                }
                my_tickets.push(ticket);
            }
            for(i=0; i<get_my_tickets.length; i++) {
                console.log(get_my_tickets[i])
                var stringfy_tickets=JSON.stringify(get_my_tickets[i]);
                var obj =  JSON.parse(stringfy_tickets);
               for( var key in obj ) {
                   console.log(i + " " + key + '=>' + obj[key] );
                   if(key == 'gig_id'){
                my_tickets[i].gig_id=obj[key].toString();
                   }
                   else if(key == 'gig_name'){
                    my_tickets[i].gig_name=obj[key].toString();
                       }
                   else if(key == 'gig_datetime'){
                my_tickets[i].gig_datetime=obj[key].toString();
                   }
                    else if(key == 'gig_venue'){
                my_tickets[i].gig_venue=obj[key].toString();
                   }
                 else if (key== 'seat_id'){
                    my_tickets[i].seat_id=obj[key].toString();
                }else if (key== 'section_id'){
                    my_tickets[i].section_id=obj[key].toString();
                }else if (key== 'ticket_price'){
                    my_tickets[i].ticket_price=obj[key].toString();
                }else if (key== 'row_id'){
                    my_tickets[i].row_id=obj[key].toString();
                }else if (key== 'ticket_id'){
                    my_tickets[i].ticket_id=obj[key].toString();
                }
              }
            }
            
        console.log(my_tickets);
        }
    })
}



//티켓 resell하기
function resell_ticket(id, starting_time,  current_price, starting_price, ticket_id, end_time, cb){
        var sql=`INSERT INTO biddings SET starting_time=?, ticket_owner_id=?, max_price=?, 
        current_price=?, ticket_id=?, starting_price=?, end_time=?`;
        var values=[starting_time.toString() ,id, current_price*1.25,starting_price, ticket_id,starting_price,end_time.toString()]

    connection.query(sql, values, function (err) {
        if(err) {
            cb(false);
        } else{
            // alert("추가되었습니다.")
            cb(true);
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
    let session = req.session;
        async.series(
            [
                function(callback){
                    get_my_info(req.session.buyer_id, function (result,myinfo_list, myticketlist) {
                        if(result==true){
                            var stringfy_tickets=JSON.stringify(myticketlist);
                            console.log("stringify" + stringfy_tickets);
                            callback(myinfo_list, stringfy_tickets);
                        }else{
                            callback(myinfo_list, []);
                        }
                    });
                }
            ],
            function(myinfo, myticket){
                if(myticket[0] != "" ){
                console.log("myticket "+ myticket);
                console.log("myticket typeof"+typeof(myticket));
                console.log ('-1'+ myticket[0] );
                var my_ticket = JSON.parse(myticket[0])
                var _myticket = []
                console.log(my_ticket)
                }else{
                    var my_ticket = [];
                }
                console.log("MyInfo1:",myinfo);
                res.render('mypage', {
                    myinfo: myinfo,
                    mytickets: my_ticket,
                    user_id:req.session.buyer_id,
                    session : session
                });
            }
        );
});

router.get('/:ticket_id', function(req, res, next) {
    console.log("I'm here")
    async.series(
        [
            function(callback){
            get_ticket_detail(req.session.buyer_id, req.params.ticket_id, function (result, ticket_info) {
                    if(result==true){
                        callback(ticket_info)   
                }else{
                        console.log(" no detail!!");
                        res.redirect('/');
                    }
                })}
        ],
        function(ticket_info){
            res.render('ticketdetail', {
                ticketinfo: ticket_info,
                user_id:req.session.buyer_id,
            });
        }
        
    );
});

router.post('/resell', function(req, res, next) {
    async.series(
        [
        function(callback){
        resell_ticket(req.session.buyer_id, req.body.starting_time, req.body.current_price, req.body.starting_price, req.body.ticket_id, req.body.end_time, function(result){
                if(result==true){
                    callback(true);
                }else{
                    res.redirect('back');
                }
            })
        }
        ],
        function(result){
            if(result==true){
                res.redirect('/reselling');
            }
        }
    );
});
module.exports = router;