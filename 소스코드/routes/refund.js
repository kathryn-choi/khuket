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
function calc_refund_price( gig_time, ticket_price, right_now_time){
  var refund_price;
    if(right_now_time.getDate()-gig_time.getDate()<=1)
  {
      if(right_now_time.getHours()<=17 && right_now_time.getDate()-gig_time.getDate()==1)
      {
          refund_price=ticket_price*0.7;
      }
      else {
          console.log("Can't refund due to late time!");
          refund_price=-1;
      }
  }
    else if(right_now_time.getDate()-gig_time.getDate()>=1 && right_now_time.getDate()-gig_time.getDate()<=2)
    {
        refund_price=ticket_price*0.7;
    }
    else if(right_now_time.getDate()-gig_time.getDate()>=3 && right_now_time.getDate()-gig_time.getDate()<=6)
    {
        refund_price=ticket_price*0.8;
    }
    else if(right_now_time.getDate()-gig_time.getDate()>=7 && right_now_time.getDate()-gig_time.getDate()<=9)
    {
        refund_price=ticket_price*0.9;
    }
    else
    {
        refund_price=ticket_price;
    }

    return refund_price;
}

function refund_ticket(ticket_id, gig_index, gig_name, gig_date, gig_venue, gig_time, section_id, row_id, seat_id, ticket_price, right_now_time){

    if(calc_refund_price(gig_time, ticket_price, right_now_time)!=-1)
    {
        var sql = "SELECT gig_organizer_index FROM gig WHERE gig_index=?";
        connection.query(sql, gig_index, function (err, res){
            if (!err) {
                var organizer_index=res;
                network.update_ticket_owner(organizer_index, ticket_id).then((response) => {
                    if (response.error == null){
                        var notice="At time" + right_now_time.toString() + 'has successfully refunded \n'
                                    + ticket_id.toString() + '. Gig name: ' + gig_name.toString() + '\n at ' + 'Venue : ' + gig_venue.toString()
                                    + '\n Time : ' + gig_time.toString() + '\n Section/Row/Seat' + section_id.toString() + row_id.toString() + seat_id.toString();
                    connection.query("INSERT INTO notification SET ?;", {
                       notification_buyer_index: id,
                       notice_buyer_text: notice,
                    });
                    console.log("refund success!");
                    }
                }) 
            }
            else {
                console.log("failed refund");
                throw err;
            }
        });
    }
    else
    {
        console.log("failed refund");
        throw err;
    }
}

router.post('/refund', function(req, res, next) {
    async.series(
        [
            function (callback) {
                refund_ticket(req.body.ticket_id, req.body.gig_name, req.body.gig_date, req.body.gig_venue, req.body.gig_time,
                    req.body.section_id, req.body.row_id, req.body.seat_id, req.body.ticket_price, req.body.right_now_time, function (my_tickets) {
                        callback(null, my_tickets);
                    });
            }
        ],
        function (err, results) {
            res.render('mypage', {
                myinfo: results[0]
            });
        }
    );
});

module.exports = router;