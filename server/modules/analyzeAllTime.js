const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//get this month tasks from database
function getData(req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let allTaskNum = 0;
        let statusWaitingNum = 0;
        let statusInProcessNum = 0;
        let statusDoneNum = 0;
        let priorityLowNum = 0;
        let priorityMediumNum = 0;
        let priorityHighNum = 0;
        let cursor = db.collection('tasks').find( { username: req.cookies.username } );
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
                res.render('statistics.ejs', 
                {
                     username: req.cookies.username,
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