var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");
var async = require('async');
var network = require('../ticketing-system/network.js');

function get_my_tickets(admin_id, gig_id, cb){
    console.log("getmytickets!");
    console.log("admin ", admin_id);
    console.log("gigid",gig_id);
    network.get_ticket_info_by_gig_id(gig_id).then((response) => { 
            //return error if error in response
        if (response.error != null) {
            console.log("network get ticket info failed");
            cb(false, []);
        } else {
            var get_my_tickets = response;
            console.log("response length ; ", get_my_tickets.length);
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
                    ticket_owner_id: '',
                }
                my_tickets.push(ticket);
            }
            var num=0;
            for(i=0; i<get_my_tickets.length; i++) {
                console.log(get_my_tickets[i]);
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
                    }else if (key== 'owner'){ //check!
                    my_tickets[i].ticket_owner_id=obj[key].toString();
                    }
              }
              num=num+1;
              if(num == get_my_tickets.length){
                cb(true,my_tickets);
                console.log(my_tickets);
              }
            }
        }
    })
}


router.get('/signup', function(req, res, next) {
    res.render("organizers/signup");
  });


router.get('/ticketlist/:gig_index', function(req, res, next) {
    let session = req.session;
    console.log("get ticketlist!");
    console.log("gigindex" ,req.params.gig_index);
    async.series(
        [
            function(callback){
                get_my_tickets("ticketadmin", req.params.gig_index, function (result, myticketlist) {
                    if(result==true){
                        var stringfy_tickets=JSON.stringify(myticketlist);
                        console.log("stringify" + stringfy_tickets);
                        callback(1, stringfy_tickets);
                    }else{
                        console.log("get gig_index tickets failed")
                        res.redirect('back');
                    }
                });
            }
        ],
        function(result, myticket){
            if(myticket[0] != "" ){
            console.log("myticket "+ myticket);
            console.log("myticket typeof"+typeof(myticket));
            console.log ('-1'+ myticket[0] );
            var my_ticket = JSON.parse(myticket[0])
            console.log(my_ticket)
            }else{
                var my_ticket = [];
            }
            res.render('organizers/ticketlist', {
                mytickets: my_ticket,
                user_id:req.session.organizer_id,
                session : session
            });
        }
    );
  });

router.post("/cancel", function(req, res,next){
    network.update_ticket_owner("ticketadmin", req.body.ticket_id).then((response) => {
        if (response.error == null){
            console.log("update success!");
            res.redirect('/organizers');
        }else{
            res.redirect('/');
        }
    }) 
})
  
router.post("/signup", function(req,res,next){
    let body = req.body;
    let inputPassword = body.organizer_pw;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    models.organizers.create({
        organizer_id: body.organizer_id,
        organizer_pw: hashPassword,
        organizer_email: body.organizer_email,
        organizer_contact: body.organizer_contact,
        organizer_account: body.organizer_account,
        organizer_name: body.organizer_name,
        salt: salt
    })
    .then( 
        network.register_organizer(body.organizer_id,body.organizer_name)
            .then((response) => {
            //return error if error in response
            if (response.error != null) {
               console.log("org register error")
            } else {
                //else return success
                console.log("org register success")
                res.redirect("./login");
            }
        })
    )  
    .catch( err => {
        console.log(err)})
})

router.get('/login', function(req, res, next) {
   let session = req.session;
      res.render("organizers/login", {
          session : session
      });
  });
  
router.post("/login", function(req,res,next){
    let body = req.body;

    models.organizers.findOne({
    where: {organizer_id : body.organizer_id}
    })
    .then( function(result, err) {
        let dbPassword = result.dataValues.organizer_pw;
        let inputPassword = body.organizer_pw;
        let salt = result.dataValues.salt;
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        console.log(hashPassword);
        console.log(dbPassword);
    if(dbPassword === hashPassword){
        console.log("비밀번호 일치");
        // 세션 설정
        req.session.organizer_id = body.organizer_id;
        req.session.organizer_index = result.dataValues.organizer_index;
        res.redirect("/organizers");
    }
    else{
        console.log("비밀번호 불일치");
        res.redirect("./login");
    }
    })
    .catch( err => {
        console.log(err);
    });
});

// 메인페이지에 공연 목록들 출력
// 공연 상세정보 뒤에 결과(승인 요청중, 등록 완료, 등록 거절)도 같이 출력
router.get('/', function(req, res, next) {
    let session = req.session;

    models.gigs.findAll().then( result => {
        res.render("organizers/mainpage", {
            session: session,
            result: result
        });
    });
    
});

router.get('/add_gig', function(req, res, next) {
    let session = req.session;
    
    res.render("organizers/add_gig", {
        session : session
    });
});
  
router.post("/add_gig", function(req,res,next){
    let body = req.body;

    console.log(req.session);
    models.gigs.create({
        gig_organizer_index : req.session.organizer_index,
        gig_venue: body.gig_venue,
        gig_name: body.gig_name,
        gig_date_time: body.gig_date_time,
        gig_total_seatnum: body.gig_total_seatnum,
        pending: 2, // 1이면 승인, 0이면 거절, 2면 승인 요청 기다림
        gig_image: body.gig_image,
        gig_description: body.gig_description,
        gig_type : body.gig_type
    })
    .then( result => {
        res.redirect("./");
    })
    .catch( err => {
        console.log(err)
    })
});

module.exports = router;