$(function () {

    //select a desired display time function
    $('#selectAnalyzeStartTime').datetimepicker({
        format: 'DD/MM/YYYY',
        minDate: '2017-01-01',
        maxDate: '2030-12-31'
    });
    $('#selectAnalyzeEndTime').datetimepicker({
        format: 'DD/MM/YYYY',
        minDate: '2017-01-01',
        maxDate: '2030-12-31'
    });

    //analyze button actions
    $('#analyze-btn').on('click', () => {
        let formDate = $('#analyzeStartTime').val();
        let untilDate = $('#analyzeEndTime').val();
        //time fields validation
        let setDateError = false;
        if (formDate == "" && untilDate == "") {
            setDateError = "please enter start and end time";
        } else if (formDate == "" && untilDate != "") {
            setDateError = "please enter start time";
        } else if (formDate != "" && untilDate == "") {
            setDateError = "please enter end time";
        }
        if (setDateError != false) {
            return $('.select-time .createError').text(setDateError);
        } else {
            $('.select-time .createError').text("");
        }
        //handele start date input
        let formSplitDate = formDate.split('/');
        let formDay = formSplitDate[0];
        formDay = deletefirstZero(formDay);
        let formMonth = formSplitDate[1];
        formMonth = deletefirstZero(formMonth);
        let formYear = formSplitDate[2];
        //handele end date input
        let untilSplitDate = untilDate.split('/');
        let untilDay = untilSplitDate[0];
        untilDay = deletefirstZero(untilDay);
        let untilMonth = untilSplitDate[1];
        untilMonth = deletefirstZero(untilMonth);
        let untilYear = untilSplitDate[2];
        //pass requested information to the server
        $.ajax({
            method: "POST",
            url: window.location + "/analyze-period",
            data: {
                startDay: formDay,
                startMonth: formMonth,
                startYear: formYear,
                endDay: untilDay,
                endMonth: untilMonth,
                endYear: untilYear
            }
        })
            .done(function (data) {
                if (data == "the final time must be greater than the selected start time") {
                    $('.select-time .createError').text(data);
                } else {
                    $('.instructions').hide();
                    //set new analysis in table
                    if (data.total == 0) {
                        $('td').text('/');
                        $('.total').text('0');
                    } else {
                        $('.total').text(data.total);
                        $('#waiting-num').text(data.waiting);
                        $('#in-process-num').text(data.inProcess);
                        $('#done-num').text(data.done);
                        $('#waiting-percent').text((data.waiting / data.total * 100).toFixed(0) + "%");
                        $('#in-process-percent').text((data.inProcess / data.total * 100).toFixed(0) + "%");
                        $('#done-percent').text((data.done / data.total * 100).toFixed(0) + "%");
                        $('#low-num').text(data.low);
                        $('#medium-num').text(data.medium);
                        $('#high-num').text(data.high);
                        $('#low-percent').text((data.low / data.total * 100).toFixed(0) + "%");
                        $('#medium-percent').text((data.medium / data.total * 100).toFixed(0) + "%");
                        $('#high-percent').text((data.high / data.total * 100).toFixed(0) + "%");
                    }
                }
            });

    });

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

});


