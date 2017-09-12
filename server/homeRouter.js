const express = require('express');
const router = express.Router();
const addTask = require('../server/modules/addTask.js');
const todayTasks = require('../server/modules/todayTasks.js');
const changeStatus = require('../server/modules/changeStatus.js');
const deleteTask = require('../server/modules/deleteTask.js');
const editTask = require('../server/modules/editTask.js');

//render home page if user login
router.get('/', (req, res) => {
    if (!req.cookies.isLogIn) {
        res.redirect('/');
    } else {
        todayTasks.getTodayTasks(req, res ,function(todayTasks) {
            res.render('home.ejs', { username: req.cookies.username, tasks: todayTasks });
        });
    }
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