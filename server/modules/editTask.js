const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//create new task in database
function changeExistTask(req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('tasks').updateOne(
            {
                "username": req.cookies.username,
                "_id": ObjectId(req.body.taskID)
            }, 
            { $set: {
                username: req.cookies.username,
                label: req.body.label,
                desc: req.body.desc,
                date: JSON.parse(req.body.date),
                status: req.body.status,
                priority: req.body.priority,
                note: req.body.note
            }               
        }, function (err, result) {
            assert.equal(err, null);
            db.close();
            res.send('successfully');
        });
    });
}

module.exports = {
    changeExistTask
};