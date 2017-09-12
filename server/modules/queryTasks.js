const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//get tasks from database by query
function getTasks(req, res, callback) {
    //get query data
    let yearQuery = parseInt(req.body.year_query);
    let monthQuery = parseInt(req.body.month_query);
    let dayQuery = req.body.day_query;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        let queryTasks = [];
        let cursor;
        if (dayQuery == "all") {
            cursor = db.collection('tasks').find({ username: req.cookies.username ,"date.year": yearQuery, "date.month": monthQuery}).sort({"date.day": 1, "date.hour": 1, "date.minute": 1});
        } else {
            dayQuery = parseInt(dayQuery);
            cursor = db.collection('tasks').find({ username: req.cookies.username ,"date.year": yearQuery, "date.month": monthQuery, "date.day": dayQuery}).sort({"date.day": 1, "date.hour": 1, "date.minute": 1});
        }
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                queryTasks.push(doc);
            } else {
                db.close();
                callback(queryTasks, yearQuery, monthQuery, dayQuery);
            }
        });
    });
}

module.exports = {
    getTasks
};