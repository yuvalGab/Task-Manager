const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';
const passwordHash = require('password-hash');

//change user password in database
function clearAll(req, res) {
    let username = req.cookies.username;
    let password = req.body.password;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        findPassword(db, username, password, function (error) {
            if (error == "password exists") {
                db.collection('tasks').deleteMany(
                    {
                        "username": username
                    },
                    function (err, result) {
                        assert.equal(err, null);
                        error = "all tasks clear successfully";
                        db.close();
                        res.send(error);
                    });
            } else {
                db.close();
                res.send(error);
            }
        });
    });
}

//check if password exists
let findPassword = function (db, username, password, callback) {
    let cursor = db.collection('users').find({ "username": username });
    let error;
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            let checkPassword = passwordHash.verify(password, doc['password']);
            if (doc['username'] == username && checkPassword) {
                error = 'password exists';
            } else if (doc['username'] == username && !checkPassword) {
                error = 'incorrect password';
            }
        } else {
            callback(error);
        }
    });
};

module.exports = {
    clearAll
};