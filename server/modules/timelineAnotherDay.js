const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//summary of statuses for the next day
function getDaySummary (req, res) {
    let nextDayYear = parseInt(req.body.year);
    let nextDayMonth = parseInt(req.body.month);
    let nextDay = parseInt(req.body.day);
    let waitingNum = 0;
    let inProcessNum = 0;
    let doneNum = 0;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let cursor = db.collection('tasks').find({ username: req.cookies.username ,"date.year": nextDayYear, "date.month": nextDayMonth, "date.day": nextDay });
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
                res.send(
                    {
                        waiting: waitingNum,
                        inProcess: inProcessNum,
                        done: doneNum
                    }
                );
            }
        });
    });
}

module.exports = {
    getDaySummary
};