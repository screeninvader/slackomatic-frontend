import express from 'express';
import {get} from 'http';
import {join} from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import stylus from 'stylus';
import {createWriteStream as wStream} from 'fs';

var app = express()
  , cwd = process.cwd()
  , staticDir = join(cwd, 'static')
  , publicDir = join(cwd, 'public')
  , logDir = join(cwd, 'log')
  , debug = ( app.get('env') === 'development' )
;
console.log(`cwd: ${cwd}`);

app.set('port', process.env.PORT || 80);

// view engine setup
app.set('views', join(cwd, 'views'));
app.set('view engine', 'jade');

app.use(favicon(join(publicDir, 'favicon.ico')));


//log into one file for now
var logFile = join(logDir, 'access.log')
  , logStream = wStream(logFile, {flags: 'a'})
  , logOptions = {
    format: 'tiny'
  , stream: logStream
  }
;
app.use(logger(logOptions));

var logFile = join(logDir, 'access.log')
  , logStream = wStream(logFile, {flags: 'a'})
  , logOptions = {
    format: 'tiny'
  , stream: logStream
  }
;
app.use(logger(logOptions));

app.use(stylus.middleware(publicDir));
app.use(express.static(publicDir));

//load static html files for now
app.use(express.static(staticDir, {
  extensions:'html'
} ) );

app.use('/slackomatic/*', (req, res, next) => {
  var url = `http://${req.ip}:8080${req.originalUrl}`;
  if ( debug ) {
    console.log(`loading url: ${url}`);
  }
  get(url, (result) => {
    //do nothing on complete
    if ( debug ) {
      console.log(`result: ${result}`);
    }
  }).on('error', (e) => {
    //do nothing on error
    if ( debug ) {
      console.log("Got error: " + e.message);
    }
  });
  console.log(`hostname: ${req.hostname}`);
  res.status(200).send(`http://127.0.0.1:8080${req.originalUrl}`);
});

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port : ${app.get('port')}`);
});

export default app;
