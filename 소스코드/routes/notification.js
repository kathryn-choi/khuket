var express = require('express');
var router = express.Router();
var async = require('async');

//deleting notification
function delete_notification(notification_index, cb) {
    var sqlquery = "DELETE FROM notification WHERE notification_index= ?";
    connection.query(sqlquery, notification_index, function (err) {
        if (!err) {
            console.log("Notification deleted successfully");
        } else {
            console.log("Notification deleted failed");
            throw err;
        }
    });
}


router.post('/notification', function(req, res, next) {
    async.series(
        [
            function (callback) {
                delete_notification(req.notification_index, function (my_tickets) {
                        callback(null, my_tickets);
                    });
            }
        ],
        function (err, results) {
            res.render('mypage');
        }
    );
});