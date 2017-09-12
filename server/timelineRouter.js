const express = require('express');
const router = express.Router();
const timelineToday = require('../server/modules/timelineToday.js');
const timelineAnotherDay = require('../server/modules/timelineAnotherDay.js');

//render timeline page if user login
router.get('/', (req, res) => {
    if (!req.cookies.isLogIn) {
        res.redirect('/');
    } else {
        timelineToday.getDaySummary(req, res, function (todayYear, todayMonth, todayDay, waitingNum, inProcessNum, doneNum, dayInTheWeek) {
            res.render('timeline.ejs', { username: req.cookies.username, year: todayYear, month: todayMonth, day: todayDay, waiting: waitingNum, inProcess: inProcessNum, done: doneNum });
        });
    }
});

//get next day summary
router.post('/next-day', (req, res) => {
    timelineAnotherDay.getDaySummary(req, res);
});

//get previous day summary
router.post('/previous-day', (req, res) => {
    timelineAnotherDay.getDaySummary(req, res);
});

module.exports = router;