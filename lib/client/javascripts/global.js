//'use strict';

$(function () {

    //toggle sidebar
    $('#porfile-btn').on('click', function () {
        $('#wrapper').toggleClass('menuDisplayed');
    });

    //change password code
    $('#changePassword').on('click', function (e) {
        e.preventDefault();
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var retypeNewPassword = $('#retypeNewPassword').val();
        var oldPasswordError = passwordValidation(oldPassword);
        handleError(oldPasswordError, '#changePasswordModal .form-group', '#oldPasswordError', 0);
        var newPasswordError = passwordValidation(newPassword);
        handleError(newPasswordError, '#changePasswordModal .form-group', '#newPasswordError', 1);
        var retypeNewPasswordError = retypePasswordValidation(newPassword, newPasswordError, retypeNewPassword);
        handleError(retypeNewPasswordError, '#changePasswordModal .form-group', '#retypeNewPasswordError', 2);
        if (!oldPasswordError && !newPasswordError && !retypeNewPasswordError) {
            $.ajax({
                method: "POST",
                url: "/user/change-password",
                data: {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }
            }).done(function (msg) {
                if (msg == "password changed successfully") {
                    $('#changePasswordModal .createError').text('');
                    $('#changePasswordModal .createSuccess').text(msg);
                    setTimeout(function () {
                        $("#changePasswordClose").trigger("click");
                    }, 1000);
                } else {
                    $('#changePasswordModal .createSuccess').text('');
                    $('#changePasswordModal .createError').text(msg);
                }
            });
        }
    });

    //clear all tasks code
    $('#clearAllTasks').on('click', function (e) {
        e.preventDefault();
        var password = $('#clearPassword').val();
        var passwordError = passwordValidation(password);
        handleError(passwordError, '#clearAllTasksModal .form-group', '#clearPasswordError', 0);
        if (!passwordError) {
            $.ajax({
                method: "POST",
                url: "/user/clear-all-tasks",
                data: {
                    password: password
                }
            }).done(function (msg) {
                if (msg == "all tasks clear successfully") {
                    $('#clearAllTasksModal .createError').text('');
                    $('#clearAllTasksModal .createSuccess').text(msg);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    $('#clearAllTasksModal .createSuccess').text('');
                    $('#clearAllTasksModal .createError').text(msg);
                }
            });
        }
    });
});