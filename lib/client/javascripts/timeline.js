//'use strict';

$(function () {

    //scroll center today summary in the first load
    var timeline = $('.timeline');
    var dailyDetails = $('.daily-details');
    var timelineHeight = timeline.outerHeight();
    var todayDailyStatusHeight = dailyDetails.outerHeight();
    var scrollDownGap = timelineHeight / 2 - todayDailyStatusHeight / 2;
    $('.timeline').animate({
        scrollTop: scrollDownGap
    }, 700);

    var daysAhead = 0;
    var daysBefore = 0;
    var lastDay = void 0;
    //action when scrolling timeline
    timeline.scroll(function () {
        //when scrolling up
        if (timeline.scrollTop() == 0) {
            var currentYear = $('.daily-year').eq(0).text();
            var currentMonth = $('.daily-month').eq(0).text();
            var currentDay = $('.daily-day').eq(0).text();
            var maxDays = daysPerMonthCalc(currentMonth, currentYear);
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
            }).done(function (data) {
                daysAhead++;
                var dayInTheWeek = returnDayName(currentYear, currentMonth, currentDay);
                timeline.prepend('\n                        <div class="daily-details">\n                            <h4><span class="daily-day">' + currentDay + '</span>/<span class="daily-month">' + currentMonth + '</span>/<span class="daily-year">' + currentYear + '</span></h4>\n                            <h5>' + dayInTheWeek + '</h5>\n                            <p class="days-gap">+ ' + daysAhead + '</p>\n                            <div class="daily-status">\n                                <div class="daily-waiting col-md-4">' + data.waiting + '</div>\n                                <div class="daily-in-process col-md-4">' + data.inProcess + '</div>\n                                <div class="daily-done col-md-4">' + data.done + '</div>\n                            </div>\n                        </div>\n                    ');
                var randomBackgroundOpacity = Math.random() * 0.6 + 0.2;
                var randomRotateDeg = Math.random() * 4 - Math.random() * 4;
                $('.daily-details').eq(0).css({
                    backgroundColor: 'rgba(53,235,54, ' + randomBackgroundOpacity + ')',
                    transform: 'rotate(' + randomRotateDeg + 'deg)'
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
            var lastDailyDetails = $('.daily-details').length - 1;
            var _currentYear = $('.daily-year').eq(lastDailyDetails).text();
            var _currentMonth = $('.daily-month').eq(lastDailyDetails).text();
            var _currentDay = $('.daily-day').eq(lastDailyDetails).text();
            if (_currentDay == 1) {
                if (_currentMonth == 1) {
                    if (_currentYear == 2017) {
                        if (!$('#min-timeline').length) {
                            timeline.append('<p id="min-timeline">min timeline</p>');
                        }
                        return;
                    } else {
                        _currentYear--;
                        _currentMonth = 12;
                        _currentDay = 31;
                    }
                } else {
                    _currentMonth--;
                    _currentDay = daysPerMonthCalc('' + _currentMonth, _currentYear);
                }
            } else {
                _currentDay--;
            }
            //double print prevention
            if (lastDay == _currentDay) {
                return;
            }
            lastDay = _currentDay;
            $.ajax({
                method: "POST",
                url: "/user/timeline/previous-day",
                data: {
                    year: _currentYear,
                    month: _currentMonth,
                    day: _currentDay
                }
            }).done(function (data) {
                daysBefore++;
                var dayInTheWeek = returnDayName(_currentYear, _currentMonth, _currentDay);
                timeline.append('\n                        <div class="daily-details">\n                            <h4><span class="daily-day">' + _currentDay + '</span>/<span class="daily-month">' + _currentMonth + '</span>/<span class="daily-year">' + _currentYear + '</span></h4>\n                            <h5>' + dayInTheWeek + '</h5>\n                            <p class="days-gap">- ' + daysBefore + '</p>\n                            <div class="daily-status">\n                                <div class="daily-waiting col-md-4">' + data.waiting + '</div>\n                                <div class="daily-in-process col-md-4">' + data.inProcess + '</div>\n                                <div class="daily-done col-md-4">' + data.done + '</div>\n                            </div>\n                        </div>\n                    ');
                var randomBackgroundOpacity = Math.random() * 0.6 + 0.2;
                var randomRotateDeg = Math.random() * 4 - Math.random() * 4;
                $('.daily-details').eq(lastDailyDetails).css({
                    backgroundColor: 'rgba(53,235,54, ' + randomBackgroundOpacity + ')',
                    transform: 'rotate(' + randomRotateDeg + 'deg)'
                });
                timeline.css({ paddingBottom: 0 });
                var scrollBottom = timeline.scrollTop() + 200;
                $('.timeline').animate({
                    paddingBottom: 300,
                    scrollTop: scrollBottom
                }, 300);
            });
        }
    });

    //max day per month calculation
    function daysPerMonthCalc(currentMonth, currentYear) {
        var days = void 0;
        switch (currentMonth) {
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

    //return day of the week name
    function returnDayName(year, month, day) {
        var date = new Date(year + ', ' + month + ', ' + day);
        var dayNum = date.getDay();
        return choseDayName(dayNum);
    }

    //set day num per day number
    function choseDayName(dayNum) {
        var dateName = void 0;
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
    var date = new Date();
    var dayNum = date.getDay();
    var todayName = choseDayName(dayNum);
    $('.daily-details h5').text(todayName);
});