var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
var multer = require('multer');


var routes = require('./routes/index');
var users = require('./routes/users');
var owners = require('./routes/owners');
var restaurants = require('./routes/restaurants');
var dishes = require('./routes/dishes');
var orders = require('./routes/orders');

var app = express();
var apiRoutes = express.Router(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('superSecret', 'restaurentcrudapp');
var db  = mongoose.connect('mongodb://localhost:27017/restaurentcrudapp');
app.use(function(req,res,next){
    req.db = db;
    next();
});
// app.use(function(req,res,next){
//     req.secret = app.get('superSecret');
//     next();
// });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});

var upload = multer({ //multer settings
                  storage: storage
              }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
  upload(req,res,function(err){
    //console.log(req.file.filename);
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
      var dtas = req.file.filename;
      //console.log( dtas);
       res.json({error_code:0,err_desc:dtas});
  });
});

//app.use('/owners', owners);
app.use('/', routes);
app.use('/', apiRoutes);
app.use('/users', users);
app.use('/dishes', dishes);
app.use('/restaurants', restaurants);
app.use('/orders', orders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





module.exports = app;
