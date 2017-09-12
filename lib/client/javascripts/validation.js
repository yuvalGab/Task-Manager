//'use strict';

/* --- login validation --- */

//username validation
function userValidation(username) {
    var error = false;
    var englishAndNumbers = /^[a-zA-Z0-9\.]*$/;
    if (username.length == 0) {
        error = "please insert username";
    } else if (username.length < 5) {
        error = 'username must contain more than 5 characters';
    } else if (username.length > 15) {
        error = 'username must contain up to 15 characters';
    } else if (!username.match(englishAndNumbers)) {
        error = 'only english letters and numbers is allow';
    }
    return error;
}

//email validation
function emailValidation(email) {
    var error = false;
    var onlyEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
    if (email.length == 0) {
        error = 'please insert email';
    } else if (!onlyEmail.test(email)) {
        error = 'insert only valid email';
    }
    return error;
}

//password validation
function passwordValidation(password) {
    var error = false;
    var englishAndNumbers = /^[a-zA-Z0-9\.]*$/;
    if (password.length == 0) {
        error = 'please insert password';
    } else if (password.length < 6) {
        error = 'passsword must contain more than 6 characters';
    } else if (password.length > 15) {
        error = 'password must contain up to 15 characters';
    } else if (!password.match(englishAndNumbers)) {
        error = 'only english letters and numbers is allow';
    }
    return error;
}

//retype password validation
function retypePasswordValidation(password, passwordError, retypePassword) {
    var error = false;
    if (passwordError != false) {
        error = 'please insert valid passsword above';
    } else if (retypePassword.length == 0) {
        error = 'please retype selected passsword';
    } else if (password != retypePassword) {
        error = 'the two passsword must be equal';
    }
    return error;
}

/* --- add task validation --- */

//label validation
function labelValidation(label) {
    var error = false;
    if (label.length == 0) {
        error = "please insert label";
    } else if (label.length > 50) {
        error = 'label must contain up to 50 characters';
    }
    return error;
}

//description validation
function descValidation(desc) {
    var error = false;
    if (desc.length > 100) {
        error = 'description must contain up to 100 characters';
    }
    return error;
}

//time and date validation
function timeValidation(time) {
    var error = false;
    if (time == "") {
        error = 'time must to be chosen';
    }
    return error;
}

//note validation
function noteValidation(note) {
    var error = false;
    if (note.length > 300) {
        error = 'description must contain up to 300 characters';
    }
    return error;
}

/* --- handle error --- */

//show error in the page
function handleError(error, inputElement, textElement, inputPosition) {
    if (error != false) {
        $(inputElement).eq(inputPosition).addClass('has-error');
        $(textElement).text(error);
    } else {
        $(inputElement).eq(inputPosition).removeClass('has-error');
        $(textElement).text('');
    }
};