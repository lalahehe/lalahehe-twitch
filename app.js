var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var indexRouter = require('./routes/index');
var streamersRouter = require('./routes/streamers');
var authRouter = require('./routes/auth');
var webhooksRouter = require('./routes/webhooks');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE_URL, { useMongoClient: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public/images', express.static(path.join(__dirname, 'public/images')));
app.use('/public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));

app.use(session({
  secret: 'MZkKw8Me5CkyF3wH',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/streamers', streamersRouter);
app.use('/auth', authRouter);
app.use('/webhooks', webhooksRouter.router);


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

module.exports = {
  app: app,
  socketIO: webhooksRouter.socketIO
};
