var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');


var app = express();

app.io = require('socket.io')(); // initialize io, attach server in www
// use socket events here

var multer = require('multer');
var upload = multer({dest:'./uploads'});
 
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');

var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://root:Adrianecelmaiboss@cluster0-6ijeg.mongodb.net/ascent?retryWrites=true&w=majority");
var db = mongoose.connection;

mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var scentsRouter = require('./routes/scents')(app.io);

//var chatsRouter = require('./routes/chat')(app.io);


const PORT = 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const mongoc = require('mongodb').MongoClient;

app.use('/uploads', express.static(path.join(__dirname, './uploads')))





//Handle Sessions

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));





// Passport

app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root  = namespace.shift()
    , formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() +']';
    }
    return{
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}))

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req,res,next){
  res.locals.user = req.user || null;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/scents', scentsRouter);

//app.use('/chat', chatsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
