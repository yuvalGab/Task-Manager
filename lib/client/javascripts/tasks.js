//'use strict';

$(function () {

    //set max day per month for query options
    function setDaysPerMonth() {
        var queryMonth = $('#monthQuery').val();
        var queryYear = $('#yearQuery').val();
        $('#dayQuery option').remove();
        $('#dayQuery').append('<option>all</option>');
        var monthDays = daysPerMonthCalc(queryMonth, queryYear);
        for (var day = 1; day <= monthDays; day++) {
            $('#dayQuery').append('<option>' + day + '</option>');
        }
    }
    //execute in the first load
    setDaysPerMonth();
    //execute if query month changed
    $('#monthQuery').on('change', function () {
        setDaysPerMonth();
    });
    //set cuurent day number after query
    var returnDay = $('#returnDay').text();
    if (returnDay != "all") {
        $('#dayQuery').val(returnDay);
    }

    //max day per month calculation
    function daysPerMonthCalc(currentMounth, currentYear) {
        var days = void 0;
        switch (currentMounth) {
            case '1':
                days = 31;
                break;
            case '2':
                if (currentYear % 4 == 0 && currentYear % 100 != 0 || currentYear % 100 == 0 && currentYear % 400 == 0) {
                    days = 29;
                } else {
                    days = 28;
                }
                break;
            case '3':
                days = 31;
                break;
            case '4':
                days = 30;
                break;
            case '5':
                days = 31;
                break;
            case '6':
                days = 30;
                break;
            case '7':
                days = 31;
                break;
            case '8':
                days = 31;
                break;
            case '9':
                days = 30;
                break;
            case '10':
                days = 31;
                break;
            case '11':
                days = 30;
                break;
            case '12':
                days = 31;
                break;
        }
        return days;
    }

    //update status and priority function
    setInterval(function updateStatus() {
        var waitingNum = 0;
        var inProcessNum = 0;
        var doneNum = 0;
        var lowNum = 0;
        var mediumNum = 0;
        var highNum = 0;
        var task = $('.task');
        //count the numbers of each status tasks
        for (var i = 0; i < task.length; i++) {
            if (task.eq(i).is(':visible')) {
                var status = task.eq(i).find(':selected').text();
                switch (status) {
                    case 'waiting':
                        waitingNum++;
                        break;
                    case 'in process':
                        inProcessNum++;
                        break;
                    case 'done':
                        doneNum++;
                        break;
                }
            }
        }
        //count the numbers of each priority tasks
        for (var _i = 0; _i < task.length; _i++) {
            if (task.eq(_i).is(':visible')) {
                var priority = task.eq(_i).find('.task-priority').text().split(':')[1].trim();
                switch (priority) {
                    case 'low':
                        lowNum++;
                        break;
                    case 'medium':
                        mediumNum++;
                        break;
                    case 'high':
                        highNum++;
                        break;
                }
            }
        }
        //write the status numbers in task page
        $('#status-waiting span').text(waitingNum);
        $('#status-in-process span').text(inProcessNum);
        $('#status-done span').text(doneNum);
        $('#priority-low span').text(lowNum);
        $('#priority-medium span').text(mediumNum);
        $('#priority-high span').text(highNum);
    }, 100);
});