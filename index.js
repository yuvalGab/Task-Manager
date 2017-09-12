//require main modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//use node modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//use static folders
app.use("/server", express.static(__dirname + "/server"));
app.use("/client", express.static(__dirname + "/client"));
app.use("/lib", express.static(__dirname + "/lib"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.set('view engine', 'ejs');

//import routering fiels
const loginRouter = require('./server/loginRouter');
const userRouter = require('./server/userRouter');

//check if user is connecting 
app.get('/', (req, res) => {
    if (req.cookies.isLogIn) {
        res.redirect('/user');
    } else {
        res.redirect('/login');
    }
});

//routering management
app.use('/login', loginRouter);
app.use('/user', userRouter);

//run server on port 8085
app.listen(8085, function () {
    console.log('task manager app listening in porn 8085');
});