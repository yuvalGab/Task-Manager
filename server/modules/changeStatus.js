const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';

//cahnge task status in database
function changeTaskStatus(req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('tasks').updateOne(
            {
                "username": req.cookies.username,
                "_id": ObjectId(req.body.taskID)
            },
            {
                $set: {
                    "status": req.body.status
                }

            }, function (err, result) {
                assert.equal(err, null);
                db.close();
                res.send('successfully');
            });
    });
}

module.exports = {
    changeTaskStatus
};