const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/task_manager';
const passwordHash = require('password-hash');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

//render the login page
router.get('/', (req, res) => {
    res.render('login.ejs');
});

//create new user in database
router.post('/create-user', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = passwordHash.generate(req.body.password);
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        findCreatedUser(db, username, email, function (usernameExist, emailExist) {
            let error = 'user created successfully';
            if (usernameExist && emailExist) {
                error = 'username and email already exist';
            } else if (usernameExist && !emailExist) {
                error = 'username already exist';
            } else if (!usernameExist && emailExist) {
                error = 'email already exist';
            } else {
                db.collection('users').insertOne({
                    username: username,
                    email: email,
                    password: password
                });
            }
            db.close();
            res.send(error);
        });
    });
});

//try connection to the user account
router.post('/connection', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let rememberMe = req.body.rememberMe;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        findLoginUser(db, username, password, function (error) {
            if (error == 'login successfully') {
                if (rememberMe == 'true') {
                    res.cookie('isLogIn', true, { maxAge: 60 * 60 * 60 * 24 * 30}); 
                    res.cookie('username', username, { maxAge: 60 * 60 * 60 * 24 * 30}); // 30 days  
                } else {
                    res.cookie('isLogIn', true, { expires: false });
                    res.cookie('username', username, { expires: false }); // kill cookie when browser close
                }
            }
            db.close();
            res.send(error);
        });
    });
});

//forgot password handle
router.post('/forgot-password', (req, res) => {
    let userEmail = req.body.email;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        findUserPassword(db, userEmail, function (error, username) {
            if (error == "email found") {
                let generatedPassword = generator.generate({
                    length: 6,
                    numbers: true,
                    uppercase: false
                });
                db.collection('users').updateOne(
                    {
                        "email": userEmail
                    },
                    {
                        $set: { 
                            "password": passwordHash.generate(generatedPassword)
                        }
                    }
                );
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'yuvalgab2007@gmail.com',
                        pass: 'yuval762'
                    }
                });
                let mailOptions = {
                    from: '"task manager" <foo@blurdybloop.com>',
                    to: userEmail,
                    subject: 'temp password',
                    html: `<p>Hi, ${username}, your temporary password is: <b>${generatedPassword}</b>. <br />You can change to a different password in the app properties.</p>`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        error = "email not sent due to sending failure";
                    } else {
                        error = "email sent successfully";
                    }
                    db.close();
                    res.send(error);
                });
            } else {
                db.close();
                res.send(error);
            }
        });
    });
});

//search for exist user in created stage
let findCreatedUser = function (db, username, email, callback) {
    let cursor = db.collection('users').find(
        { $or: [{ "username": username }, { "email": email }] }
    );
    let usernameExist = false;
    let emailExist = false;
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            if (doc['username'] == username) {
                usernameExist = true;
            }
            if (doc['email'] == email) {
                emailExist = true;
            }
        } else {
            callback(usernameExist, emailExist);
        }
    });
};

//search for exist user in login stage
let findLoginUser = function (db, username, password, callback) {
    let cursor = db.collection('users').find( { "username": username } );
    let error = 'username not found';
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            let checkPassword = passwordHash.verify(password, doc['password']);
            if (doc['username'] == username && checkPassword) {
                error = 'login successfully';
            } else if (doc['username'] == username && !checkPassword) {
                error = 'incorrect password';
            }
        } else {
            callback(error);
        }
    });
};

//search password that match to user email
let findUserPassword = function (db, userEmail, callback) {
    let cursor = db.collection('users').find( { "email": userEmail } );
    let error = 'email not found';
    let username;
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            if (doc['email'] == userEmail) {
                error = "email found";
                username = doc['username']
            }
        } else {
            callback(error, username);
        }
    });
};

module.exports = router;