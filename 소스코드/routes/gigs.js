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
//gig type에 따라 보여주기
function get_gig_list_by_type(gig_type, cb) {
    console.log("get_gigs_list");
    var sqlquery = "SELECT  * FROM gigs  WHERE gig_type=?";
    var gig_type_list=new Array();
    connection.query(sqlquery,gig_type,function(err,rows){
        if(!err){
            gig_type_list=rows;
            cb(gig_type_list);
            console.log(gig_type_list);
            //return reselling_list;
        }else{
            console.log("gig type list를 가져오는데 실패했습니다!");
            throw err;
        }
    });
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
                res.render('gigdetails', {
                    gigdetails: results[0],
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
                res.render('gigdetails', {
                    gigdetails: results[0],
                });
            }
        );
    }
});

router.get('/:type', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        console.log(req.params.index);
        async.series(
            [
                function (callback) {
                    get_gig_list_by_type(req.params.type,function (gig_type_list) {
                        callback(null, gig_type_list);
                    });
                }
            ],
            function (err, results) {
                res.render('gig_type', {
                    gig_type_list: results[0],
                });
            }
        );
    }
});

module.exports = router;