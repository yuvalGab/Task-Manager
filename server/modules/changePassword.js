const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';
const passwordHash = require('password-hash');

//change user password in database
function changeUserPassword(req, res) {
    let username = req.cookies.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        findPassword(db, username, oldPassword, function (error) {
            if (error == "password exists") {
                db.collection('users').updateOne(
                    {
                        "username": username,
                    },
                    {
                        $set: {
                            "password": passwordHash.generate(newPassword)
                        }

                    }, function (err, result) {
                        assert.equal(err, null);
                        error = "password changed successfully";
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
                error = 'incorrect old password';
            }
        } else {
            callback(error);
        }
    });
};

module.exports = {
    changeUserPassword
};