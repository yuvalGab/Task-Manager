const express = require('express');
const router = express.Router();
const addTask = require('../server/modules/addTask.js');
const monthTasks = require('../server/modules/monthTasks.js');
const queryTasks = require('../server/modules/queryTasks.js');
const changeStatus = require('../server/modules/changeStatus.js');
const deleteTask = require('../server/modules/deleteTask.js');
const editTask = require('../server/modules/editTask.js');

//render tasks page if user login
router.get('/', (req, res) => {
    if (!req.cookies.isLogIn) {
        res.redirect('/');
    } else {
        monthTasks.getTasks(req, res ,function(monthTasks, currentMonth, currentYear) {
            res.render('tasks.ejs', { username: req.cookies.username, tasks: monthTasks, month: currentMonth, year: currentYear, day: "all" });
        });
    }
});

//get tasks from database by query
router.post('/', (req, res) => {
    queryTasks.getTasks(req, res ,function(queryTasks, yearQuery, monthQuery, dayQuery) {
        res.render('tasks.ejs', { username: req.cookies.username, tasks: queryTasks, year: yearQuery, month: monthQuery, day: dayQuery });
    });
});

//handle new task action
router.post('/add-task', (req, res) => {
    addTask.crateNewTask(req, res);
});

//handle edit task action
router.post('/edit-task', (req, res) => {
    editTask.changeExistTask(req, res);
});

//handle change status action
router.post('/change-status', (req, res) => {
    changeStatus.changeTaskStatus(req, res);
});

//handle delete selected task
router.post('/delete-task', (req, res) => {
    deleteTask.deleteSelectedTask(req, res);
});

module.exports = router;