const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//get today tasks from database
function getTodayTasks(req, res, callback) {
    //today date
    let todayDate = new Date();
    let todayDay = todayDate.getDate();
    let todayMonth = todayDate.getMonth() + 1;
    let todayYear = todayDate.getFullYear();
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let todayTasks = [];
        let cursor = db.collection('tasks').find(
           { $or: [
                { username: req.cookies.username ,"date.year": todayYear, "date.month": todayMonth, "date.day": todayDay }, 
                { username: req.cookies.username ,"date.year": { $lt: todayYear + 1 }, "date.month": { $lt: todayMonth + 1 }, "date.day": { $lt: todayDay }, "status": "in process" }
           ]}
        ).sort({"date.year": 1, "date.month": 1, "date.day": 1, "date.hour": 1, "date.minute": 1});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                todayTasks.push(doc);
            } else {
                db.close();
                callback(todayTasks);
            }
        });
    });
}

module.exports = {
    getTodayTasks
};