//'use strict';

$(function () {

    //create new user
    $('#createUser').on('click', function () {
        var createUsername = $('#createUsername').val();
        var createEmail = $('#createEmail').val();
        var createPassword = $('#createPassword').val();
        var createRetypePassword = $('#createRetypePassword').val();
        //new user validation
        var usernmaeError = userValidation(createUsername);
        handleError(usernmaeError, '#createNewUser .form-group', '#createUsernameError', 0);
        var emailError = emailValidation(createEmail);
        handleError(emailError, '#createNewUser .form-group', '#createEmailError', 1);
        var passwordError = passwordValidation(createPassword);
        handleError(passwordError, '#createNewUser .form-group', '#createPasswordError', 2);
        var retypePasswordError = retypePasswordValidation(createPassword, passwordError, createRetypePassword);
        handleError(retypePasswordError, '#createNewUser .form-group', '#createRetypePasswordError', 3);
        //send new user to the server
        if (!usernmaeError && !emailError && !passwordError && !retypePasswordError) {
            $.ajax({
                method: "POST",
                url: "/login/create-user",
                data: {
                    username: createUsername,
                    email: createEmail,
                    password: createPassword
                }
            }).done(function (error) {
                if (error == 'user created successfully') {
                    $('#createNewUser .createSuccess').text(error);
                    $('#createNewUser .createError').text('');
                    setTimeout(function () {
                        $("#createNewUser").trigger("click");
                    }, 1000);
                } else {
                    $('#createNewUser .createError').text(error);
                    $('#createNewUser .createSuccess').text('');
                }
            });
        }
    });

    //login 
    $('#login').on('click', function (e) {
        e.preventDefault();
        var loginUsername = $('#loginUsername').val();
        var loginPassword = $('#loginPassword').val();
        var loginRememberMe = $('#rememberMe').prop('checked');
        //login validation
        var usernmaeError = userValidation(loginUsername);
        handleError(usernmaeError, '.form-group', '#loginUsernameError', 0);
        var passwordError = passwordValidation(loginPassword);
        handleError(passwordError, '.form-group', '#loginPasswordError', 1);
        if (!usernmaeError && !passwordError) {
            $.ajax({
                method: "POST",
                url: "/login/connection",
                data: {
                    username: loginUsername,
                    password: loginPassword,
                    rememberMe: loginRememberMe
                }
            }).done(function (error) {
                if (error == 'login successfully') {
                    $('.container .createSuccess').text(error);
                    $('.container .createError').text('');
                    setTimeout(function () {
                        //go to user area
                        window.location.href = '/';
                    }, 1000);
                } else {
                    $('.container .createError').text(error);
                    $('.container .createSuccess').text('');
                }
            });
        }
    });

    //forgot password
    $('#sendPassword').on('click', function (e) {
        e.preventDefault();
        var userEmail = $('#emailForSending').val();
        var emailError = emailValidation(userEmail);
        handleError(emailError, '#forgotPassword .form-group', '#emailForSendingError', 0);
        if (!emailError) {
            $.ajax({
                method: "POST",
                url: "/login/forgot-password",
                data: {
                    email: userEmail
                }
            }).done(function (error) {
                if (error == 'email sent successfully') {
                    $('#forgotPassword .createSuccess').text(error);
                    $('#forgotPassword .createError').text('');
                    setTimeout(function () {
                        $("#forgotPassword").trigger("click");
                    }, 1000);
                } else {
                    $('#forgotPassword .createError').text(error);
                    $('#forgotPassword .createSuccess').text('');
                }
            });
        }
    });
});