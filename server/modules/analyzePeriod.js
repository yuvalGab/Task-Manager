const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//get this month tasks from database
function getData(req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let startDay = parseInt(req.body.startDay);
        let startMonth = parseInt(req.body.startMonth);
        let startYear = parseInt(req.body.startYear);
        let endDay = parseInt(req.body.endDay);
        let endMonth = parseInt(req.body.endMonth);
        let endYear = parseInt(req.body.endYear);
        let allTaskNum = 0;
        let statusWaitingNum = 0;
        let statusInProcessNum = 0;
        let statusDoneNum = 0;
        let priorityLowNum = 0;
        let priorityMediumNum = 0;
        let priorityHighNum = 0;
        let cursor;
        if ((startDay <= endDay && startMonth == endMonth) || (startMonth < endMonth && startYear == endYear) || (startYear < endYear)) {
            if (startDay == endDay && startMonth == endMonth && startYear == endYear) {
                cursor = db.collection('tasks').find(
                    {
                        username: req.cookies.username,
                        "date.day": startDay,
                        "date.month": startMonth,
                        "date.year": startYear
                    }
                );
            } else if (startDay < endDay && startMonth == endMonth && startYear == endYear) {
                cursor = db.collection('tasks').find(
                    {
                        username: req.cookies.username,
                        "date.day": { $gte: startDay, $lte: endDay },
                        "date.month": startMonth,
                        "date.year": startYear
                    }
                );
            } else if (startMonth < endMonth && startYear == endYear) {
                cursor = db.collection('tasks').find({
                    $and:
                    [
                        {
                            username: req.cookies.username
                        },
                        {
                            $or:
                            [
                                {
                                    "date.day": { $gte: startDay },
                                    "date.month": startMonth,
                                    "date.year": startYear
                                },
                                {
                                    "date.day": { $lte: endDay },
                                    "date.month": endMonth,
                                    "date.year": startYear
                                },
                                {
                                    "date.month": { $gt: startMonth, $lt: endMonth },
                                    "date.year": startYear
                                }
                            ]
                        }
                    ]
                }
                );
            } else {
                cursor = db.collection('tasks').find({
                    $and:
                    [
                        {
                            username: req.cookies.username
                        },
                        {
                            $or:
                            [
                                {
                                    "date.day": { $gte: startDay },
                                    "date.month": startMonth,
                                    "date.year": startYear
                                },
                                {
                                    "date.day": { $lte: endDay },
                                    "date.month": endMonth,
                                    "date.year": endYear
                                },
                                {
                                    "date.month": { $gt: startMonth },
                                    "date.year": startYear
                                },
                                {
                                    "date.month": { $lt: endMonth },
                                    "date.year": endYear
                                },
                                {
                                    "date.year": { $gt: startYear, $lt: endYear }
                                }
                            ]
                        }
                    ]
                }
                );
            }
        } else {
            return res.send('the final time must be greater than the selected start time');
        }
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                allTaskNum++;
                switch (doc['status']) {
                    case 'waiting':
                        statusWaitingNum++;
                        break;
                    case 'in process':
                        statusInProcessNum++;
                        break;
                    case 'done':
                        statusDoneNum++;
                        break;
                }
                switch (doc['priority']) {
                    case 'low':
                        priorityLowNum++;
                        break;
                    case 'medium':
                        priorityMediumNum++;
                        break;
                    case 'high':
                        priorityHighNum++;
                        break;
                }
            } else {
                db.close();
                res.send(
                    {
                        total: allTaskNum,
                        waiting: statusWaitingNum,
                        inProcess: statusInProcessNum,
                        done: statusDoneNum,
                        low: priorityLowNum,
                        medium: priorityMediumNum,
                        high: priorityHighNum
                    });
            }
        });
    });
}

module.exports = {
    getData
};