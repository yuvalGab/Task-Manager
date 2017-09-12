const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//get this month tasks from database
function getTasks(req, res, callback) {
    //current month date
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let monthTasks = [];
        let cursor = db.collection('tasks').find({ username: req.cookies.username ,"date.year": currentYear, "date.month": currentMonth}).sort({"date.day": 1, "date.hour": 1, "date.minute": 1});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                monthTasks.push(doc);
            } else {
                db.close();
                callback(monthTasks, currentMonth, currentYear);
            }
        });
    });
}

module.exports = {
    getTasks
};