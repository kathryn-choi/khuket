var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require("crypto");
const util = require('util');
var async = require('async');
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

async function create_ticket(gig_index, cb){
    var sqlquery = "SELECT  * FROM gigs  WHERE gig_index=?";
    var gig_ticket=new Array();

    var result=""
    const query = util.promisify(connection.query).bind(connection);
    var rows = await query(sqlquery,gig_index)
    await console.log("1")
    await console.log(rows)
    if(rows.length != 0){
        gig_ticket=rows;
        var sqlquery2 = "SELECT  * FROM sections  WHERE gig_index=?";
        var sections=new Array();
        var _gig_index = gig_ticket[0].gig_index;
        var gig_date_time = (gig_ticket[0].gig_date_time).toString();
        var gig_name = gig_ticket[0].gig_name;
        var gig_venue = gig_ticket[0].gig_venue;
        var total_seat_num = gig_ticket[0].gig_total_seatnum;;
        var row2 = await query(sqlquery2,gig_index)
        await console.log("2");
            if(row2.length != 0) {
                await console.log(1);
                await console.log(row2)
                sections=row2;
                await console.log("sections:",sections)
                var count = 0
                
                for (var i=0; i<sections.length; i++)
                {
                    await console.log(2);
                    var section_id=sections[i].section_id;
                    var section_index=sections[i].section_index;
                    var seat_price = sections[i].seat_price
                    var sqlquery3 = "SELECT * FROM seats  WHERE section_id=? AND gig_index=?";
                    var seats=new Array();
                    var values=[section_id, _gig_index];
                    var row3 = await query(sqlquery3, values)
                    if(row3.length !=0){
                        await console.log(3);
                        seats=row3;
                        await console.log(row3);
                        for (var j=0; j<seats.length; j++)
                        {
                            await console.log(4);

                            var section_id = seats[j].section_id;
                            var seat_index=seats[j].seat_row_index;
                            var ticket_id=(_gig_index).toString() + "." +section_id +"." +(seat_index).toString();
                            var seat_row_index=seats[j].seat_row_index;
                            await console.log("ticket_id" ,ticket_id);
                            await network.create_ticket('ticketadmin',ticket_id,section_id,seat_row_index,seat_index,seat_price,_gig_index,gig_date_time, gig_name, gig_venue)  
                            .then((response) => {
                                //return error if error in response
                                if (response.error != null) {
                                    console.log("network create_ticket failed");
                                    throw err;
                                } else {
                                    //else return success
                                    console.log("return true complete")
                                    count++
                                    result = true
                                    //cb(result);
                                }
                                })
                            .then((response) =>{
                                if (count == total_seat_num){cb(result);};
                            })
                        }
                    }
                    else{
                        await console.log("selecting seats error")
                        result= false;
                    }
                   
                }
                await console.log(5)
                result=true;
            } else{
                await console.log("gig type list를 가져오는데 실패했습니다!");
            result=false;
            }
            await console.log(6)

        
    }else{
        await console.log("gig type list를 가져오는데 실패했습니다!");
        result =false;
    }
    await  console.log("create ticket result:",result)
    cb(result);
}

// pending = 2인 공연들 목록들 출력하고 승인 누르면 pending = 1로 변경되고 티켓 생성
router.post('/accept_gig', async (req, res, next) => {
    let session = req.session;
       var gig_index=req.body.gig_index;
       var pending=req.body.pending;
       var temp = true;
       await console.log("pending : "+pending);
       if(pending == 'accept')
        {
            pending=1;
            
            await console.log("I'm here")
            await create_ticket(gig_index, function(result){
                if(result==true){
                    console.log("creating ticket succeed!")
                    var sql = "UPDATE gigs SET pending = ?  WHERE gig_index = ?";
                    connection.query(sql, [pending, gig_index], function (err) {
                        if(!err) {
                            console.log("gig pending update");
                                temp = true
                        } else {
                            console.log("updating failed");
                                temp = false
                        }
                    });
                }else{
                    console.log("creating ticket failed")
                        temp = false
                    
                    return
                }
            });

            if(temp == true){
                await res.jsonp({success : true})
            }
            else{
                await res.jsonp({success : false})
            }
            
        }          
        else {
            pending=0;
            var sql = "UPDATE gigs SET pending = ?  WHERE gig_index = ?";
            connection.query(sql, [pending, gig_index], function (err) {
                if (err) {
                    console.log("updating failed");
                    temp = false
                }
                else {
                    console.log("gig pending update");
                    temp = true
                }
            });
            if(temp == true){
                await res.jsonp({success : true})
            }
            else{
                await res.jsonp({success : false})
            }
        }     
});
module.exports = router;