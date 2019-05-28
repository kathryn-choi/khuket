var express = require('express');
var router = express.Router();
var async = require('async');
//var request = require('request');

//gig 전체 리스트 가져오기
function get_gigs_list(cb) {
    console.log("get_gigs_list");
    var sqlquery = "SELECT  * FROM gigs  WHERE pending=?";
    var gigs_list=new Array();
    connection.query(sqlquery,1,function(err,rows){
        if(!err){
            gigs_list=rows;
            cb(gigs_list);
            console.log(gigs_list);
            //return reselling_list;
        }else{
            console.log("내 정보를 가져오는데 실패했습니다!");
            throw err;
        }
    });
}
// gig_index값의 세부 정보 찾기
function get_gig_detail(gig_index, cb){
    console.log("get_gig_detail");
    var gig_detail=new Array();
    var sqlquery = "SELECT  * FROM gigs  WHERE gig_index=?";
    connection.query(sqlquery, gig_index, function (err, rows) {
        if (!err) {
            gig_detail=rows;
            cb(gig_detail);
            console.log(gig_detail);
            // res.redirect('/gig_details');
        } else {
            console.log("Gig  detail failed");
            throw err;
        }
    });
}

function get_gigsection_info(gig_index, callback) {
    console.log("get_gigsale_info");
    var sqlquery = "SELECT  * FROM gigs  WHERE gig_index=?";
    var gigsale_info=new Array();
    connection.query(sqlquery,gig_index,function(err,rows){
        if(!err){
                console.log("1");
                var total_seat_num=rows[0].gig_total_seatnum;
                    var sqlquery2 = "SELECT  * FROM sections  WHERE gig_index=?";
                    var sections=new Array();
                    connection.query(sqlquery2,gig_index,function(err,rows){
                        if(!err) {
                            sections=rows;
                            console.log("sections:",sections);
                            callback(true, sections, total_seat_num);
                        } else{
                            console.log("gig type list를 가져오는데 실패했습니다!");
                            callback(false, null, total_seat_num);
                        }
                    });
            //console.log(gigsale_info);
            //cb(gigsale_info);
        }else{
            console.log("gig type list를 가져오는데 실패했습니다!");
            throw err;
        }
    });
}

//gig seats
function get_gigseat_info(gig_index, section_id, cb) {
    console.log("get_gigseat_info");
    var sqlquery = "SELECT  * FROM seats  WHERE gig_index=? AND section_id=?";
    var values=[gig_index, section_id];
    connection.query(sqlquery,values,function(err,rows){
        if(!err) {
            seats= rows;
            console.log("seats:", seats);
            cb(true, seats);
        } else {
            console.log("gig type list를 가져오는데 실패했습니다!");
            cb(false, null);
        }
    });
}
//get purchase list
function get_purchaselist(gig_index, section_id, seats_index, cb) {
    console.log("get purchaselist");
    console.log(seats_index.length);
    for (var i=0; i<seats_index.length; i++) {
        var sqlquery = "SELECT  * FROM seats  WHERE gig_index=? AND seat_index=?";
        var values = [gig_index, seats_index[i].seat_index];
        connection.query(sqlquery, values, function (err, rows) {
            if (!err) {
                seats = rows;
                console.log("seats:", seats);
                cb(true, seats);
            } else {
                console.log("gig type list를 가져오는데 실패했습니다!");
                cb(false, null);
            }
        });
    }
}
//purchase tickets
function purchase_tickets(gig_index, seats, cb) {
    for (var i=0; i<seats.length; i++) {
        var sqlquery = "SELECT  * FROM seats  WHERE gig_index=? AND seat_index=?";
        var values = [gig_index, seats[i].seat_index];
        connection.query(sqlquery, values, function (err, rows) {
            if (!err) {
                //change ticket owner to userid
                seats = rows;
                console.log("seats:", seats);
                cb(true, seats);
            } else {
                console.log("purchase tickets failed!");
                cb(false, null);
            }
        });
    }
}
//get gigs
router.get('/', function(req, res, next) {
    if (!req.isAuthenticated()) {
        async.series(
            [
                function (callback) {
                    get_gigs_list(function (gigs_list) {
                        callback(null, gigs_list);
                    });
                }
            ],
            function (err, results) {
                res.render('gigs', {
                    gigs_list: results[0],
                    //  user_id: req.user.user_id,
                    //  reselling_ticket_list: results[0],
                });
            }
        );
    } else {
        async.series(
            [
                function (callback) {
                    get_gigs_list(function (gigs_list) {
                        callback(null, gigs_list);
                    });
                }
            ],
            function (err, results) {
                res.render('gigs', {
                    gigs_list: results[0],
                    //  user_id: req.user.user_id,
                    //  reselling_ticket_list: results[0],
                });
            }
        );
    }
});

router.get('/:index', function(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log(req.params.index);
        async.series(
            [
                function (callback) {
                    get_gig_detail(req.params.index,function (gigdetails) {
                        callback(null, gigdetails);
                    });
                }
            ],
            function (err, results) {
                res.render('gigs/gigdetails', {
                    gigdetails: results[0], gig_index: req.params.index,
                });
            }
        );
    } else {
        console.log(req.params.index);
        async.series(
            [
                function (callback) {
                    get_gig_detail(req.params.index,function (gigdetails) {
                        callback(null, gigdetails);
                    });
                }
            ],
            function (err, results) {
                res.render('gigs/gigdetails', {
                    gigdetails: results[0],
                });
            }
        );
    }
});

router.get('/buy/:gig_index', function(req, res, next) {
    console.log("buy!");
    console.log(req.params.gig_index);
    if (!req.isAuthenticated()) {
        async.series(
            [
                function (callback) {
                console.log(2)
                    get_gigsection_info(req.params.gig_index,function (result, sectionlist, totalseatnum) {
                        if (result==1){
                            console.log(3)
                            callback(sectionlist, totalseatnum);
                        }else{
                            console.log('getting gigsale info failed');
                            res.redirect('back');
                        }
                    });
                }
            ],
            function (sectionlist, totalseatnum) {
                console.log(4)
                res.render('gigs/gigsection', {
                    gigsale: sectionlist, totalseatnum: totalseatnum, gig_index:req.params.gig_index
                });
            }
        );

    } else {
        get_gigsection_info(req.params.gig_index,function (result, sectionlist, totalseatnum) {
                if (result == true) {
                    res.render('gigs/gigsection', {
                        gigsale: sectionlist, totalseatnum: totalseatnum, gig_index:req.params.gig_index
                    });
                } else {
                    console.log('getting gigsale info failed');
                    res.redirect('back');
                }
            });
    }
});

router.get('/buy/:gig_index/:section_id', function(req, res, next) {
    console.log("");
    console.log(req.params.gig_index);
    if (!req.isAuthenticated()) {
        get_gigseat_info(req.params.gig_index, req.params.section_id, function (result, seatlist) {
            if (result == true) {
                res.render('gigs/gigseat', {
                    gigsale: seatlist, totalseatnum: req.body.totalseatnum, gig_index:req.params.gig_index
                });
            } else {
                console.log('getting gigsale info failed');
                res.redirect('back');
            }
        });
    } else {
        get_gigseat_info(req.params.gig_index, req.params.section_id, function (result, seatlist) {
            if (result == true) {
                res.render('gigs/gigseat', {
                    gigsale: seatlist, totalseatnum: req.body.totalseatnum,gig_index:req.params.gig_index
                });
            } else {
                console.log('getting gigsale info failed');
                res.redirect('back');
            }
        });
    }
});

//get purchaselist
router.post('/purchase/:gig_index', function(req, res, next) {
    console.log(req.body.seat_index);
    console.log(req.body.seat_index.length);// array?
    if (!req.isAuthenticated()) {
        get_purchaselist(req.params.gig_index, req.params.section_id, req.body.seat_index, function (result, seatlist) {
            if (result == true) {
                res.render('gigs/gigpurchaselist', {
                    gigsale: seatlist, totalseatnum: req.body.totalseatnum, gig_index: req.params.gig_index,
                });
            } else {
                console.log('getting gigsale info failed');
                res.redirect('back');
            }
        });
    } else {
        get_purchaselist(req.params.gig_index, req.params.section_id, function (result, seatlist) {
            if (result == true) {
                res.render('gigs/gigpurchaselist', {
                    gigsale: seatlist, totalseatnum: req.body.totalseatnum, gig_index: req.params.gig_index,
                });
            } else {
                console.log('getting gigsale info failed');
                res.redirect('back');
            }
        });
    }
});
//purchase tickets
router.post('/purchase', function(req, res, next) {
    console.log(req.body.purchaseseats);
    console.log(req.body.purchaseseats.length);// array?
    if (!req.isAuthenticated()) {
        purchase_tickets(req.params.gig_index, req.body.purchaseseats, function (result, seatlist) {
            if (result == true) {
                res.render('mypage', {
                    gigsale: seatlist, totalseatnum: req.body.totalseatnum, gig_index: req.params.gig_index,
                });
            } else {
                console.log('getting gigsale info failed');
                res.redirect('back');
            }
        });
    } else {
        purchase_tickets(req.params.gig_index, req.params.section_id, function (result, seatlist) {
            if (result == true) {
                res.render('gigs/gigpurchaselist', {
                    gigsale: seatlist, totalseatnum: req.body.totalseatnum, gig_index: req.params.gig_index,
                });
            } else {
                console.log('getting gigsale info failed');
                res.redirect('back');
            }
        });
    }
});

module.exports = router;