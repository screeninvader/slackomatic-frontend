import express from 'express';
import {get} from 'http';
import {join} from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import stylus from 'stylus';
import {createWriteStream as wStream} from 'fs';
import api from './lib/api';
import errorHandler from './lib/errorHandler';

var app = express()
  , env = app.get('env')
  , cwd = process.cwd()
  , staticDir = join(cwd, 'static')
  , publicDir = join(cwd, 'public')
  , logDir = join(cwd, 'log')
  , debug = ( app.get('env') === 'development' )
;

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

app.use(stylus.middleware(publicDir));
app.use(express.static(publicDir));

//load static html files for now
app.use(express.static(staticDir, {
  extensions:'html'
} ) );

//slackomatic api redirect
app.use('/slackomatic', api);

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if ( ! errorHandler.hasOwnProperty(env) ) {
  env = 'production';
}
app.use(errorHandler[env]);

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port : ${app.get('port')}`);
});

