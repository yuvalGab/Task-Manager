$(function () {

    //scroll center today summary in the first load
    let timeline = $('.timeline');
    let dailyDetails = $('.daily-details');
    let timelineHeight = timeline.outerHeight();
    let todayDailyStatusHeight = dailyDetails.outerHeight();
    let scrollDownGap = (timelineHeight / 2) - (todayDailyStatusHeight / 2);
    $('.timeline').animate({
        scrollTop: scrollDownGap
    }, 700);

    let daysAhead = 0;
    let daysBefore = 0;
    let lastDay;
    //action when scrolling timeline
    timeline.scroll(function () {
        //when scrolling up
        if (timeline.scrollTop() == 0) {
            let currentYear = $('.daily-year').eq(0).text();
            let currentMonth = $('.daily-month').eq(0).text();
            let currentDay = $('.daily-day').eq(0).text();
            let maxDays = daysPerMonthCalc(currentMonth, currentYear);
            if (currentDay < maxDays) {
                currentDay++;
            } else {
                currentDay = 1;
                if (currentMonth == 12) {
                    currentMonth = 1;
                    if (currentYear < 2030) {
                        currentYear++;
                    } else {
                        if (!$('#max-timeline').length) {
                            timeline.prepend('<p id="max-timeline">max timeline</p>');
                        }
                        return;
                    }
                } else {
                    currentMonth++;
                }
            }
            $.ajax({
                method: "POST",
                url: "/user/timeline/next-day",
                data: {
                    year: currentYear,
                    month: currentMonth,
                    day: currentDay
                }
            })
                .done(function (data) {
                    daysAhead++;
                    let dayInTheWeek = returnDayName(currentYear, currentMonth, currentDay);
                    timeline.prepend(`
                        <div class="daily-details">
                            <h4><span class="daily-day">${currentDay}</span>/<span class="daily-month">${currentMonth}</span>/<span class="daily-year">${currentYear}</span></h4>
                            <h5>${dayInTheWeek}</h5>
                            <p class="days-gap">+ ${daysAhead}</p>
                            <div class="daily-status">
                                <div class="daily-waiting col-md-4">${data.waiting}</div>
                                <div class="daily-in-process col-md-4">${data.inProcess}</div>
                                <div class="daily-done col-md-4">${data.done}</div>
                            </div>
                        </div>
                    `);
                    let randomBackgroundOpacity = (Math.random() * 0.6) + 0.2;
                    let randomRotateDeg = (Math.random() * 4) - (Math.random() * 4);
                    $('.daily-details').eq(0).css({
                        backgroundColor: `rgba(53,235,54, ${randomBackgroundOpacity})`,
                        transform: `rotate(${randomRotateDeg}deg)`
                    });
                    timeline.css({ paddingTop: 0 });
                    $('.timeline').animate({
                        paddingTop: 300,
                        scrollTop: 200
                    }, 300);
                });
        }
        //when scrolling down
        if ($(this)[0].scrollHeight == Math.floor($(this).scrollTop() + 1) + $(this).innerHeight()) {
            let lastDailyDetails = $('.daily-details').length - 1;
            let currentYear = $('.daily-year').eq(lastDailyDetails).text();
            let currentMonth = $('.daily-month').eq(lastDailyDetails).text();
            let currentDay = $('.daily-day').eq(lastDailyDetails).text();
            if (currentDay == 1) {
                if (currentMonth == 1) {
                    if (currentYear == 2017) {
                        if (!$('#min-timeline').length) {
                            timeline.append('<p id="min-timeline">min timeline</p>');
                        }
                        return;
                    } else {
                        currentYear--;
                        currentMonth = 12;
                        currentDay = 31;
                    }
                } else {
                    currentMonth--;
                    currentDay = daysPerMonthCalc(`${currentMonth}`, currentYear);
                }
            } else {
                currentDay--;
            }
            //double print prevention
            if (lastDay == currentDay) {
                return;
            } 
            lastDay = currentDay;
            $.ajax({
                method: "POST",
                url: "/user/timeline/previous-day",
                data: {
                    year: currentYear,
                    month: currentMonth,
                    day: currentDay
                }
            })
                .done(function (data) {
                    daysBefore++;
                    let dayInTheWeek = returnDayName(currentYear, currentMonth, currentDay);
                    timeline.append(`
                        <div class="daily-details">
                            <h4><span class="daily-day">${currentDay}</span>/<span class="daily-month">${currentMonth}</span>/<span class="daily-year">${currentYear}</span></h4>
                            <h5>${dayInTheWeek}</h5>
                            <p class="days-gap">- ${daysBefore}</p>
                            <div class="daily-status">
                                <div class="daily-waiting col-md-4">${data.waiting}</div>
                                <div class="daily-in-process col-md-4">${data.inProcess}</div>
                                <div class="daily-done col-md-4">${data.done}</div>
                            </div>
                        </div>
                    `);
                    let randomBackgroundOpacity = (Math.random() * 0.6) + 0.2;
                    let randomRotateDeg = (Math.random() * 4) - (Math.random() * 4);
                    $('.daily-details').eq(lastDailyDetails).css({
                        backgroundColor: `rgba(53,235,54, ${randomBackgroundOpacity})`,
                        transform: `rotate(${randomRotateDeg}deg)`
                    });
                    timeline.css({ paddingBottom: 0 });
                    let scrollBottom = timeline.scrollTop() + 200;
                    $('.timeline').animate({
                        paddingBottom: 300,
                        scrollTop: scrollBottom
                    }, 300);
                });
        }
    });

    //max day per month calculation
    function daysPerMonthCalc(currentMonth, currentYear) {
        let days;
        switch (currentMonth) {
            case '1':
                days = 31;
                break;
            case '2':
                if ((((currentYear % 4) == 0) && ((currentYear % 100) != 0)) || (((currentYear % 100) == 0) && ((currentYear % 400) == 0))) {
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

    //return day of the week name
    function returnDayName(year, month, day) {
        let date = new Date(`${year}, ${month}, ${day}`);
        let dayNum = date.getDay();
        return choseDayName(dayNum);
    }

    //set day num per day number
    function choseDayName(dayNum) {
        let dateName;
        switch (dayNum) {
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

    //set day name in today card
    let date = new Date();
    let dayNum = date.getDay();
    let todayName = choseDayName(dayNum);
    $('.daily-details h5').text(todayName);

});