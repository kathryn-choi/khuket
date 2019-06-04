var express = require('express');
var async = require('async');
var network = require('../ticketing-system/network.js');
var router = express.Router();

/*예매 취소 안내
취소 마감 시간
관람일 전일 (평일/주말/공휴일 오후 5시)
※ 관람일 전일 오후 5시 이후 또는 관람일 당일 예매하신 건에 대해서는 예매후 취소/변경/환불 불가
취소 수수료 안내
구분	취소수수료	비고
예매 후 7일 이내	없음	* 예매당일에 취소하는 경우 이외에는
예매수수료가 환불되지 않음
* 예매 후 7일 이내라도 취소시점이 공연일로부터
10일 이내라면 그에 해당하는 취소수수료 부과
관람일 9일 전 ~ 7일 전	티켓금액의 10%
관람일 6일 전 ~ 3일 전	티켓금액의 20%
관람일 2일 전 ~ 1일 전	티켓금액의 30%
취소시 예매수수료는 예매 당일 밤 12시 이전까지 환불되며, 그 이후 기간에는 환불되지 않습니다.
웹취소가능시간 이후에는 취소가 불가합니다.
상품의 특성에 따라서, 취소수수료 정책이 달라질 수 있습니다.(각 상품 예매시 취소수수료 확인)*/
//시스템에서 지정한 규정에 맞게 환불해주기

function calc_refund_price( gig_datetime, ticket_price, cb){
  var refund_price;
  var current_date = new Date();
  var hour=current_date.getHours();
  console.log("curdate" ,current_date);
    var s= gig_datetime.split(' ');
    var month;
    if(s[1]=="January"){
        month="01";
    }else if(s[1]=="February"){
        month="02";
    }else if(s[1]=="March"){
        month="03";
    }else if(s[1]=="April"){
        month="04";
    }else if(s[1]=="May"){
        month="05";
    }else if(s[1]=="June"){
        month="06";
    }else if(s[1]=="July"){
        month="07";
    }else if(s[1]=="August"){
        month="08";
    }else if(s[1]=="September"){
        month="09";
    }else if(s[1]=="October"){
        month="10";
    }else if(s[1]=="November"){
        month="11";
    }else if(s[1]=="December"){
        month="12";
    }
    var str=s[3]+'-'+month+'-'+s[2];
    var datetime=new Date(str.toString());
    console.log("datetime",datetime);
    var dif=new Date(current_date.getTime()-datetime.getTime());
    var daydif=new Date(dif.getUTCDate()-1);
    console.log("daydif",daydif.getDate());
    console.log(ticket_price);
    ticket_price=parseInt(ticket_price);
    if(daydif<=1)
  {
      if(hour<=17 && daydif.getDate()==1)
      {
          refund_price=ticket_price*0.7;
      }
      else {
          console.log("Can't refund due to late time!");
          refund_price=-1;
      }
  }
    else if(daydif>=1 && daydif<=2)
    {
        refund_price=ticket_price*0.7;
    }
    else if(daydif>=3 && daydif<=6)
    {
        refund_price=ticket_price*0.8;
    }
    else if(daydif>=7 && daydif<=9)
    {
        refund_price=ticket_price*0.9;
    }
    else
    {
        refund_price=ticket_price;
    }
    console.log(ticket_price);
    
    console.log("refund_price : ", refund_price);
    cb(refund_price);
}

function refund_ticket(buyer_id, ticket_id, gig_index, gig_name, gig_datetime, gig_venue, section_id, row_id, seat_id, ticket_price, callback){
    calc_refund_price(gig_datetime, ticket_price, function(refund_price){
    if (refund_price!=-1)
    {
                network.update_ticket_owner("ticketadmin", ticket_id).then((response) => {
                    if (response.error == null){
                        var notice=ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString()
                                    + '\n Date Time : ' + gig_datetime.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString()+"has been refunded by "+ refund_price;
                    connection.query("INSERT INTO notifications SET ?;", {
                       notice_buyer_id: buyer_id,
                       notice_buyer_text: notice,
                    });
                    console.log("refund success!");
                    callback(true);
                    }else{
                        callback(false);
                    }
                }) 
    }
    else
    {
        console.log("refund -1");
        callback(false);
    }
    })
};

router.post('/', function(req, res) {
    async.series(
        [
            //ticket_id, gig_index, gig_name, gig_datetime, gig_venue, section_id, row_id, seat_id, ticket_price
            function (callback) {
                refund_ticket(req.session.buyer_id,req.body.ticket_id, req.body.gig_index,req.body.gig_name, req.body.gig_datetime, req.body.gig_venue,
                    req.body.section_id, req.body.row_id, req.body.seat_id, req.body.ticket_price, function (result) {
                        if(result==true){
                            callback(true);
                        }else{
                            callback(false);
                        }
                });
            }
        ],
        function (result) {
            if(result==true){
                console.log("refund succed");
                res.redirect('/mypage');
            }else{
                console.log("refund failed!");
                res.redirect('/');
            }
        }
    );
});

module.exports = router;