var express = require('express');
var router = express.Router();

function get_my_info(id,cb){
    //id 값을 가진 buyer 개인정보 가져오기
    //list of buyer(id)'s info
    var sqlquery = "SELECT  b.buyer_name, b.buyer_id, b.buyer_email, b.buyer_contact, b.buyer_account FROM buyer b ";
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

router.get('/', function(req, res, next) {
    get_my_info(1,function (myinfo) {
   // get_my_info(req.user.user_id,function (myinfo) {
        res.render('setting',{
            myinfo : myinfo
        });
    })
});

module.exports = router;