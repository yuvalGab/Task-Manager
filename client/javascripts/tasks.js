$(function () {

    //set max day per month for query options
    function setDaysPerMonth() {
        let queryMonth = $('#monthQuery').val();
        let queryYear = $('#yearQuery').val();
        $('#dayQuery option').remove();
        $('#dayQuery').append(`<option>all</option>`);
        let monthDays = daysPerMonthCalc(queryMonth, queryYear);
        for (let day = 1; day <= monthDays; day++) {
            $('#dayQuery').append(`<option>${day}</option>`);
        }
    }
    //execute in the first load
    setDaysPerMonth();
    //execute if query month changed
    $('#monthQuery').on('change', () => {
        setDaysPerMonth();
    });
    //set cuurent day number after query
    let returnDay = $('#returnDay').text();
    if (returnDay != "all") {
        $('#dayQuery').val(returnDay);
    }

    //max day per month calculation
    function daysPerMonthCalc (currentMounth, currentYear) {
        let days;
        switch(currentMounth) {
            case '1':
                days = 31;
                break;
            case '2':
                if ((((currentYear % 4) == 0) && ((currentYear % 100) != 0 )) || (((currentYear % 100) == 0) && ((currentYear % 400) == 0 ))) {
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
    setInterval(function updateStatus () {
        let waitingNum = 0;
        let inProcessNum = 0;
        let doneNum = 0;
        let lowNum = 0;
        let mediumNum = 0;
        let highNum = 0;
        let task = $('.task');
        //count the numbers of each status tasks
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
        //count the numbers of each priority tasks
        for (let i = 0; i < task.length; i++) {
            if (task.eq(i).is(':visible')) {
                let priority = task.eq(i).find('.task-priority').text().split(':')[1].trim();
                switch (priority) {
                    case 'low':
                        lowNum++;
                        break;
                    case 'medium':
                        mediumNum++;
                        break;
                    case 'high':
                        highNum++
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