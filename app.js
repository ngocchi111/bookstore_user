require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const { MongoClient } = require("mongodb");
const session= require("express-session");

//const contact = require('./routes/contact'); // định nghĩa biến contact

const passport = require('./passport')
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const cartsRouter = require('./routes/carts');
const indexRouter = require('./routes/index');

require('./dal/db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use('/contact', contact);//

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:  process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next){
  res.locals.user=req.user;
  next();
});

app.use('/', indexRouter)
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/carts', cartsRouter);

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

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

module.exports = app;
