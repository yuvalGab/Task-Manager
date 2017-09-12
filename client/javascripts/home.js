$(function () {

    //time and date picker function
    $('#selectNewTaskTime').datetimepicker({
        format: 'DD/MM/YYYY HH:mm',
        minDate: '2017-01-01',
        maxDate: '2030-12-31'
    });
    $('#editSelectNewTaskTime').datetimepicker({
        format: 'DD/MM/YYYY HH:mm',
        minDate: '2017-01-01',
        maxDate: '2030-12-31'
    });

    //add task function
    $('#addTask').on('click', (e) => {
        e.preventDefault();
        //get task labels
        const taskLabel = $('#taskLabel').val();
        const taskDesc = $('#taskDesc').val();
        //get time and date
        let taskFullTime = $('#taskTime').val();
        //get task status and priority
        let taskStatus;
        let taskPriority;
        for (let i = 0; i < 3; i++) {
            let statusInput = $('#addNewTaskModal .chose-status input').eq(i);
            if (statusInput.prop('checked')) {
                taskStatus = statusInput.val();
            }
            let priorityInput = $('#addNewTaskModal .chose-priority input').eq(i);
            if (priorityInput.prop('checked')) {
                taskPriority = priorityInput.val();
            }
        }
        //get task note
        const taskNote = $('#taskNote').val();
        //inputs validation
        let labelError = labelValidation(taskLabel);
        handleError(labelError, '#addNewTaskModal .form-group', '#taskLabelError', 0);
        let descError = descValidation(taskDesc);
        handleError(descError, '#addNewTaskModal .form-group', '#taskDescError', 1);
        let timeError = timeValidation(taskFullTime);
        handleError(timeError, '#addNewTaskModal .form-group', '#taskTimeError', 2);
        let noteError = noteValidation(taskNote);
        handleError(noteError, '#addNewTaskModal .form-group', '#taskNoteError', 3);
        //handle date and time if not have time error
        let taskDate, taskTime, taskSplitTime, taskHour, taskMinute, taskSplitDate, taskDay, taskMonth, taskYear, dayInTheWeek;
        if (!timeError) {
            taskFullTime = taskFullTime.split(' ');
            taskDate = taskFullTime[0];
            taskTime = taskFullTime[1];
            taskSplitTime = taskTime.split(':');
            taskHour = taskSplitTime[0];
            taskMinute = taskSplitTime[1];
            taskSplitDate = taskDate.split('/');
            taskDay = taskSplitDate[0];
            taskDay = deletefirstZero(taskDay);
            taskMonth = taskSplitDate[1];
            taskMonth = deletefirstZero(taskMonth);
            taskYear = taskSplitDate[2];
            let date = new Date(`${taskYear}, ${taskMonth}, ${taskDay}, ${taskHour}:${taskMinute}`);
            dayInTheWeek = date.getDay();
            dayInTheWeek = setDayInTheWeekName(dayInTheWeek);
        }
        //send task to the database if no validation error
        if (!labelError && !descError && !timeError && !noteError) {
            $.ajax({
                method: "POST",
                url: window.location + "/add-task",
                data: {
                    label: taskLabel,
                    desc: taskDesc,
                    date: JSON.stringify({
                        fullDate: taskDate,
                        fullTime: taskTime,
                        dayInTheWeek: dayInTheWeek,
                        year: parseInt(taskYear),
                        month: parseInt(taskMonth),
                        day: parseInt(taskDay),
                        hour: parseInt(taskHour),
                        minute: parseInt(taskMinute)
                    }),
                    status: taskStatus,
                    priority: taskPriority,
                    note: taskNote
                }
            })
                .done(function (msg) {
                    //if task create successfully show the new task
                    if (msg == "successfully") {
                        $('.createError').text('');
                        $('.createSuccess').text('task created successfully');
                        //refreash page
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    } else {
                        $('createSuccess').text('');
                        $('.createError').text('there is a problem, task not added');
                    }
                });
        }
    });

    //set task background color
    function setTaskColor() {
        let task = $('.task');
        for (let i = 0; i < task.length; i++) {
            let priority = task.eq(i).find('.task-priority').text().split(':')[1].trim();
            let color;
            switch (priority) {
                case 'low':
                    color = '#5d97f4';
                    break;
                case 'medium':
                    color = '#a5ed95';
                    break;
                case 'high':
                    color = '#fc8091';
                    break;
            }
            task.eq(i).css({ backgroundColor: color });
        }
    }
    //call the function in the first load
    setTaskColor();

    //count the numbers of each status tasks
    function countStatusTask() {
        let waitingNum = 0;
        let inProcessNum = 0;
        let doneNum = 0;
        let task = $('.task');
        for (let i = 0; i < task.length; i++) {
            if (task.eq(i).is(':visible')) {
                let status = task.eq(i).find(':selected').text();
                switch (status) {
                    case 'waiting':
                        waitingNum++;
                        break;
                    case 'in process':
                        inProcessNum++;
                        break;
                    case 'done':
                        doneNum++
                        break;
                }
            }
        }
        let statusNumber = $('.status-number');
        statusNumber.eq(0).text(waitingNum);
        statusNumber.eq(1).text(inProcessNum);
        statusNumber.eq(2).text(doneNum);
    }
    //call the function in the first load
    countStatusTask();

    //delete the first "0" number in a string if needed 
    function deletefirstZero(stringValue) {
        if (stringValue != undefined) {
            if (stringValue.toString()[0] == '0') {
                return stringValue[1];
            } else {
                return stringValue;
            }
        }
    }

    //set color of select status input in a task
    function setStatusColor() {
        $('.task').each(function () {
            let taskStatus = $(this).find(':selected').text();
            let statusColor
            switch (taskStatus) {
                case 'waiting':
                    statusColor = '#e0a1a1';
                    break;
                case 'in process':
                    statusColor = '#c2f9bb';
                    break;
                case 'done':
                    statusColor = '#d0d0f2';
                    break;
            }
            $(this).find('select').css({ backgroundColor: statusColor });
        });
    };
    //call the function in the first load
    setStatusColor();

    //change task status actions
    $('.select-status').on('change', function () {
        const currentTaskID = $(this).closest('.task').find('.task-id').text();
        const newStatus = $(this).find(':selected').text();
        $.ajax({
            method: "POST",
            url: window.location + "/change-status",
            data: {
                taskID: currentTaskID,
                status: newStatus
            }
        })
            .done(function (msg) {
                if (msg == "successfully") {
                    countStatusTask();
                    setStatusColor();
                } else {
                    alert('An error has been occurred, status can not be changed.');
                }
            });
    });

    //delete task actions
    $('.deleteTask').on('click', function () {
        const deleteConfrim = confirm('Are you sure you want to delete this task?');
        const taskView = $(this).closest('.task-wrapper');
        if (deleteConfrim) {
            const currentTaskID = $(this).closest('.task').find('.task-id').text();
            $.ajax({
                method: "POST",
                url: window.location + "/delete-task",
                data: {
                    taskID: currentTaskID
                }
            })
                .done(function (msg) {
                    if (msg == "successfully") {
                        taskView.fadeOut(700, () => {
                            countStatusTask();
                            if (!$('.task-wrapper').is(':visible')) {
                                $('.tasks').append(`<h4 class="no-tasks">no tasks for today</h4>`);
                            }
                        });
                    } else {
                        alert('An error has been occurred, task can not be deleted.');
                    }
                });
        }

    });

    //show task note function
    $('.showNote').on('click', function () {
        $(this).closest('.task').find('.task-note').fadeIn(500);
    });
    //hide note
    $('.close-note').on('click', function () {
        $(this).closest('.task-note').fadeOut(400);
    });

    //prepare edit modal when edit button clicked
    $('.editTask').on('click', function () {
        //get all current task data
        const task = $(this).closest('.task');
        const taskID = task.find('.task-id').text();
        const taskDate = `${task.find('.task-day').text()}/${task.find('.task-month').text()}/${task.find('.task-year').text()} ${task.find('.task-hour').text()}:${task.find('.task-minute').text()}`;
        const taskLabel = task.find('h4').text();
        const taskDesc = task.find('.task-desc').text();
        const taskStatus = task.find('.task-status').find(':selected').text();
        const taskPriority = task.find('.task-priority').text().split(':')[1].trim();
        const taskNote = task.find('.task-note p').text();
        //set the data in the edit window
        $('#editTaskID').val(taskID);
        $('#editTaskLabel').val(taskLabel);
        $('#editTaskDesc').val(taskDesc);
        $('#editTaskTime').val(taskDate);
        //set status
        if (taskStatus == 'waiting') {
            $('#editStatusWaiting').prop('checked', true);
        } else if (taskStatus == 'in process') {
            $('#editStatusInProcess').prop('checked', true);
        } else if (taskStatus == 'done') {
            $('#editStatusDone').prop('checked', true);
        }
        //set priority
        if (taskPriority == 'low') {
            $('#editPriorityLow').prop('checked', true);
        } else if (taskPriority == 'medium') {
            $('#editPriorityMedium').prop('checked', true);
        } else if (taskPriority == 'high') {
            $('#editPriorityHigh').prop('checked', true);
        }
        $('#editTaskNote').val(taskNote);
    });

    //edit task function
    $('#editTask').on('click', function (e) {
        e.preventDefault();
        //get task id
        const taskID = $('#editTaskID').val();
        //get task labels
        const taskLabel = $('#editTaskLabel').val();
        const taskDesc = $('#editTaskDesc').val();
        //get time and date
        let taskFullTime = $('#editTaskTime').val();
        //get task status and priority
        let taskStatus;
        let taskPriority;
        for (let i = 0; i < 3; i++) {
            let statusInput = $('#editTaskModal .chose-status input').eq(i);
            if (statusInput.prop('checked')) {
                taskStatus = statusInput.val();
            }
            let priorityInput = $('#editTaskModal .chose-priority input').eq(i);
            if (priorityInput.prop('checked')) {
                taskPriority = priorityInput.val();
            }
        }
        //get task note
        const taskNote = $('#editTaskNote').val();
        //inputs validation
        let labelError = labelValidation(taskLabel);
        handleError(labelError, '#editTaskModal .form-group', '#editTaskLabelError', 0);
        let descError = descValidation(taskDesc);
        handleError(descError, '#editTaskModal .form-group', '#editTaskDescError', 1);
        let timeError = timeValidation(taskFullTime);
        handleError(timeError, '#editTaskModal .form-group', 'editTaskTimeError', 2);
        let noteError = noteValidation(taskNote);
        handleError(noteError, '#editTaskModal .form-group', 'editTaskNoteError');
        //handle date and time if not have time error
        let taskDate, taskTime, taskSplitTime, taskHour, taskMinute, taskSplitDate, taskDay, taskMonth, taskYear, dayInTheWeek;
        if (!timeError) {
            taskFullTime = taskFullTime.split(' ');
            taskDate = taskFullTime[0];
            taskTime = taskFullTime[1];
            taskSplitTime = taskTime.split(':');
            taskHour = taskSplitTime[0];
            taskMinute = taskSplitTime[1];
            taskSplitDate = taskDate.split('/');
            taskDay = taskSplitDate[0];
            taskDay = deletefirstZero(taskDay);
            taskMonth = taskSplitDate[1];
            taskMonth = deletefirstZero(taskMonth);
            taskYear = taskSplitDate[2];
            let date = new Date(`${taskYear}, ${taskMonth}, ${taskDay}, ${taskHour}:${taskMinute}`);
            dayInTheWeek = date.getDay();
            dayInTheWeek = setDayInTheWeekName(dayInTheWeek);
        }
        //send task to the database if no validation error
        if (!labelError && !descError && !timeError && !noteError) {
            $.ajax({
                method: "POST",
                url: window.location + "/edit-task",
                data: {
                    taskID: taskID,
                    label: taskLabel,
                    desc: taskDesc,
                    date: JSON.stringify({
                        fullDate: taskDate,
                        fullTime: taskTime,
                        dayInTheWeek: dayInTheWeek,
                        year: parseInt(taskYear),
                        month: parseInt(taskMonth),
                        day: parseInt(taskDay),
                        hour: parseInt(taskHour),
                        minute: parseInt(taskMinute)
                    }),
                    status: taskStatus,
                    priority: taskPriority,
                    note: taskNote
                }
            })
                .done(function (msg) {
                    //if task create successfully show the new task
                    if (msg == "successfully") {
                        $('.editError').text('');
                        $('.editSuccess').text('task edited successfully');
                        //refreash page
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    } else {
                        $('createSuccess').text('');
                        $('.createError').text('there is a problem, task not edited');
                    }
                });
        }
    });

    //filtering tasks operation
    $('#filter-btn').on('click', function (e) {
        e.preventDefault();
        const statusFilterValue = $('#statusFilter').val();
        const priorityFilterValue = $('#priorityFilter').val();
        $('.task-wrapper').show();
        for (let i = 0; i < $('.task-wrapper').length; i++) {
            let currentTask = $('.task-wrapper').eq(i);
            let currentTaskStatus = currentTask.find('.select-status').val();
            let currentTaskPriority = currentTask.find('.task-priority').text().split(':')[1].trim();
            if (statusFilterValue != 'all') {
                if (statusFilterValue != currentTaskStatus) {
                    currentTask.hide();
                }
            }
            if (priorityFilterValue != 'all') {
                if (priorityFilterValue != currentTaskPriority) {
                    currentTask.hide();
                }
            }
        }
        if (!$('.task-wrapper').is(':visible') && !$('.tasks .no-tasks').length) {
            $('.tasks').append(`<h4 class="no-tasks">no filter tasks found</h4>`);
        } else if ($('.task-wrapper').is(':visible')) {
            $('.tasks .no-tasks').remove();
        }
    });

    //set day in the week name
    function setDayInTheWeekName(dayNumber) {
        let dayName; 
        switch (dayNumber) {
            case 0:
                dayName = "Sunday";
                break;
            case 1:
                dayName = "Monday";
                break;
            case 2:
                dayName = "Tuesday";
                break;
            case 3:
                dayName = "Wednesday";
                break;
            case 4:
                dayName = "Thursday";
            break;
            case 5:
                dayName = "Friday";
                break;
            case 6:
                dayName = "Saturday";
                break;
        }
        return dayName;
    }

    //set day of the week in home page label
    let date = new Date();
    let dayNum = date.getDay();
    let dayInTheWeek = setDayInTheWeekName(dayNum);   
    $('#day-of-week').text(` (${dayInTheWeek})`);

});
