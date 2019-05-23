var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");
var network = require('../ticketing-system/network/network.js');

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
    connection.query(sqlquery,gig_index,function(err,rows){
        if(!err){
            gig_ticket=rows;
            var sqlquery2 = "SELECT  * FROM sections  WHERE gig_index=?";
            var sections=new Array();
            connection.query(sqlquery2,gig_index,function(err,rows){
                if(!err) {
                    sections=rows;
                    for (var i=0; i<sections.length; i++)
                    {
                        section_id=sections[i].section_id;
                        var sqlquery3 = "SELECT * FROM seats  WHERE section_id=? and gig_index=?";
                        var seats=new Array();
                        connection.query(sqlquery3, section_id, gig_index, function(err,rows) {
                        if(!err){
                            seats=rows;
                            for (var j=0; j<seats.length; j++)
                            {
                                ticket_id = crypto.createHash("sha512").update(gig_index + sections[i].section_index + seats[j].seat_index).digest("hex");
                                network.create_ticket(req.session,ticket_id,section_id,seats[j].seat_row_index,seats[j].seat_index,section[i].seat_price,gig_ticket[0].gig_index,gig_ticket[0].gig_datetime);
                            }
                        }
                        else{
                            console.log("selecting seats error")
                            return false;
                        }
                        });
                    }
                    return true;
                } else{
                console.log("gig type list를 가져오는데 실패했습니다!");
                return false;
                }
            });
            //return reselling_list;
        }else{
            console.log("gig type list를 가져오는데 실패했습니다!");
            return true;
        }
    });
}

// pending = 2인 공연들 목록들 출력하고 승인 누르면 pending = 1로 변경되고 티켓 생성
router.post('/accept_gig', function(req, res, next) {
    let session = req.session;
       var gig_index=req.body.gig_index;
       var pending=req.body.pending;
       if(pending==='accept')
       {
           pending=1;
           if(create_ticket(gig_index) == true){
               console.log("creating ticket succeed!")
               var sql = "UPDATE gigs SET pending = ?  WHERE gig_index = ?";
               connection.query(sql, [pending, gig_index], function (err) {
                   if (err) {
                       console.log("updating failed");
                       throw err;
                   }
                   else {
                       console.log("gig pending update");
                      // res.redirect('/administrators/');
                        res.redirect('back');
                   }
               });
           }
           else {
               console.log("creating ticket failed")
               res.render("administrators/mainpage", {
                   session : session
               });
           }
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
                   res.redirect('/administrators/');
               }
           });
       }
});
module.exports = router;