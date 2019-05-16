var express = require('express');
var router = express.Router();

function get_my_info(id,cb){
    //id 값을 가진 buyer 개인정보 가져오기
    //list of buyer(id)'s info
    var sqlquery = "SELECT  b.buyer_name, b.buyer_id, b.buyer_email, b.buyer_contact, b.buyer_account FROM buyer b WHERE b.buyer_index =?";
    var myinfo= new Array();
    connection.query(sqlquery,id,function(err,rows){
        if(!err){
            myinfo=rows;
            cb(myinfo);
            console.log(myinfo);
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}


//비딩 추가하기
function add_reselling_ticket(id,current_time, starting_time, max_price, current_price, starting_price,cb){
    connection.query("INSERT INTO bidding SET ?;",
        {current_time : current_time,
            starting_time : starting_time,
            ticket_owner_index: id,
            max_price: max_price,
            current_price: current_price,
            starting_price: starting_price,
            bidder_index: -1,},function (err) {
            if(err) {
                throw err;
                console.log("리셀링 추가중 에러!")
            } else{
                // alert("추가되었습니다.")
                cb();
            }
        });
}
/*
router.get('/', function(req, res, next) {
    get_my_info(id,function (myinfo) {
   // get_my_info(req.user.user_id,function (myinfo) {
        res.render('setting',{
            myinfo : myinfo
        });
    })
});
*/
module.exports = router;