var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');

var oracledb = require('oracledb');

var app = express();
var port = process.env.PORT || 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
 secret: 'rmformfo',
 resave: false,
 saveUninitialized: true
}));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.html');
});

process.on('uncaughtException', function(err) {
    console.log( " UNCAUGHT EXCEPTION " );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
});

// var db_config = {
// 	user: 'jangwon',
// 	password: 'kh5329kh',
// 	connectString: 'dbdinstance.cn885wgifd0n.ap-northeast-2.rds.amazonaws.com:1521/UOS25'
// };
//
// oracledb.getConnection(db_config, function(err, connection) {
// 	if (err) {
// 		console.log('DB connection error:', err.message);
// 		return;
// 	}
//
// 	console.log('DB connection success!');
// });


var server = app.listen(port, function(){
 console.log("Express server has started on port", port);
});

module.exports = app;
