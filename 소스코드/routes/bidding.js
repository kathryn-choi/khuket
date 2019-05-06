var express = require('express');
var router = express.Router();

//수정할 예정
router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }else{
        async.series(
            [
                function(callback){
                    get_bidding_list(id, function (myinfo_list) {
                        callback(null,myinfo_list);
                    });
                }
            ],
            function(err, results){
                res.render('bidding', {
                    bidding: results[0]
                });
            }
        );
    }
});

module.exports = router;