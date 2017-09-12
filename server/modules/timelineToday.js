const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//summary of statuses for the day
function getDaySummary (req, res, callback) {
    //current day date
    let currentDate = new Date();
    let todayYear = currentDate.getFullYear();
    let todayMonth = currentDate.getMonth() + 1;
    let todayDay = currentDate.getDate();
    let waitingNum = 0;
    let inProcessNum = 0;
    let doneNum = 0;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let cursor = db.collection('tasks').find({ username: req.cookies.username ,"date.year": todayYear, "date.month": todayMonth, "date.day": todayDay });
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                let taskStatus = doc['status'];
                switch (taskStatus) {
                    case 'waiting':
                        waitingNum++;
                        break;
                    case 'in process':
                        inProcessNum++;
                        break;
                    case 'done':
                        doneNum++;
                        break;
                }
            } else {
                db.close();
                callback(todayYear, todayMonth, todayDay, waitingNum, inProcessNum, doneNum);
            }
        });
    });
}

module.exports = {
    getDaySummary
};