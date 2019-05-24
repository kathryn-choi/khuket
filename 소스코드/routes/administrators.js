var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");
var network = require('../ticketing-system/network.js');

router.get('/login', function(req, res, next) {
    let session = req.session;
  
      res.render("administrators/login", {
          session : session
      });
});
  
router.post("/login", function(req,res,next){
    let body = req.body;

    models.administrators.findOne({
        where: {admin_id : body.admin_id}
    })
    .then( function(result, err) {
        let dbPassword = result.dataValues.admin_pw;
        let inputPassword = body.admin_pw;
        let salt = result.dataValues.salt;
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        console.log(hashPassword);
        console.log(dbPassword);
        if(dbPassword === hashPassword){
            console.log("비밀번호 일치");
            // 세션 설정
            req.session.admin_id = body.admin_id;
                res.redirect("./");
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

router.get('/', function(req, res, next) {
    let session = req.session;
    
    models.gigs.findAll().then( result => {
        res.render("administrators/mainpage", {
            session: session,
            result: result
        });
    });
});

function create_ticket(gig_index, cb){
    var sqlquery = "SELECT  * FROM gigs  WHERE gig_index=?";
    var gig_ticket=new Array();

    var result=""

    connection.query(sqlquery,gig_index,function(err,rows){
        console.log("1")
        if(!err){
            gig_ticket=rows;
            var sqlquery2 = "SELECT  * FROM sections  WHERE gig_index=?";
            var sections=new Array();
            var _gig_index = gig_ticket[0].gig_index
            var gig_date_time = (gig_ticket[0].gig_date_time).toString()
            var gig_name = gig_ticket[0].gig_name
            var gig_venue = gig_ticket[0].gig_venue
            connection.query(sqlquery2,gig_index,function(err,rows){
                console.log("2")
                
                if(!err) {
                    console.log(1);
                    sections=rows;
                    console.log("sections:",sections)
                    for (var i=0; i<sections.length; i++)
                    {
                        console.log(2)
                        var section_id=sections[i].section_id;
                        var section_index=sections[i].section_index;
                        var sqlquery3 = "SELECT * FROM seats  WHERE section_id=? AND gig_index=?";
                        var seats=new Array();
                        var values=[section_id, gig_index];
                        connection.query(sqlquery3, values, function(err,rows) {
                        if(!err){
                            console.log(3);
                            seats=rows;
                            console.log(rows);
                            for (var j=0; j<seats.length; j++)
                            {
                                console.log(4);
                                var seat_index=seats[j].seat_index;
                                var ticket_id=(gig_index).toString() + "/" + (section_index).toString()+"/" +(seat_index).toString();
                                console.log(ticket_id);
                                network.create_ticket('ticketadmin',ticket_id,section_id,seats[j].seat_row_index,seats[j].seat_index,sections[i].seat_price,gig_ticket[0].gig_index,gig_ticket[0].gig_date_time);
                            }
                        }
                        else{
                            console.log("selecting seats error")
                            result= false;
                        }
                        });
                    }
                    result=true;
                } else{
                console.log("gig type list를 가져오는데 실패했습니다!");
                result=false;
                }
            });
            //return reselling_list;
        }else{
            console.log("gig type list를 가져오는데 실패했습니다!");
           result =false;
        }
        });
    cb(result);
}

// pending = 2인 공연들 목록들 출력하고 승인 누르면 pending = 1로 변경되고 티켓 생성
router.post('/accept_gig', function(req, res, next) {
    let session = req.session;
       var gig_index=req.body.gig_index;
       var pending=req.body.pending;
       if(pending==='accept')
       {
           pending=1;
           create_ticket(gig_index, function(result){
               if(result==true){
                   console.log("creating ticket succeed!")
                   var sql = "UPDATE gigs SET pending = ?  WHERE gig_index = ?";
                   connection.query(sql, [pending, gig_index], function (err) {
                       if (err) {
                           console.log("updating failed");
                           res.redirect('back');
                       } else {
                           console.log("gig pending update");
                           res.redirect('back');
                       }
                   });
               }else{
                       console.log("creating ticket failed")
                      res.redirect('back');
                    }
                });
       }
       else {
           pending=0;
           var sql = "UPDATE gigs SET pending = ?  WHERE gig_index = ?";
           connection.query(sql, [pending, gig_index], function (err) {
               if (err) {
                   console.log("updating failed");
                   throw err;
               }
               else {
                   console.log("gig pending update");
                   res.redirect('back');
               }
           });
       }
});
module.exports = router;