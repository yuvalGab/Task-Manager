const express = require('express');
const router = express.Router();
const changePassword = require('../server/modules/changePassword.js');
const clearAllTasks = require('../server/modules/clearAllTasks.js');

const homeRouter = require('../server/homeRouter');
const tasksRouter = require('../server/tasksRouter');
const timelineRouter = require('../server/timelineRouter');
const statisticsRouter = require('../server/statisticsRouter');

//redirct to home page if user is login
router.get('/', (req, res) => {
    if (!req.cookies.isLogIn) {
        res.redirect('/');
    } else {
        res.redirect(req.baseUrl + '/home');
    }
});

//directing to home routing
router.use('/home', homeRouter);
//directing to tasks routing
router.use('/tasks', tasksRouter);
//directing to timeline routing
router.use('/timeline', timelineRouter);
//directing to statistics routing
router.use('/statistics', statisticsRouter);

//render about page
router.get('/about', (req, res) => {
    res.render('about.ejs', { username: req.cookies.username });
});

//log out user
router.get('/logout', (req, res) => {
    res.clearCookie("isLogIn");
    res.clearCookie("username");
    res.redirect('/');
});

//change password handle
router.post('/change-password', (req, res) => {
    changePassword.changeUserPassword(req, res);
});

//clear all tasks handle
router.post('/clear-all-tasks', (req, res) => {
    clearAllTasks.clearAll(req, res);
});

module.exports = router;