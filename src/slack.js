import express from 'express';
import {get} from 'http';
import {join} from 'path';
import favicon from 'serve-favicon';
import api from './lib/api';
import errorHandler from './lib/errorHandler';
import {view} from './lib/view';
import logger from './lib/logger';

var slack = express()
  , env = slack.get('env')
  , cwd = process.cwd()
  , staticDir = join(cwd, 'static')
  , publicDir = join(cwd, 'public')
;

slack.set('port', process.env.PORT || 80);

// view engine setup
slack.set('views', join(cwd, 'views'));
slack.set('view engine', 'jade');

slack.use(favicon(join(publicDir, 'favicon.ico')));

//if requested path exists in /public it gets served from there
slack.use(express.static(publicDir));

logger(slack);

//slackomatic api redirect
slack.use('/slackomatic', api);

//renders :page from views/pages
slack.use('/:page', view);

//renders views/pages/index
slack.use('/', (req, res, next) => {
  req.params.page = 'index';
  view(req, res, next);
});

/// catch 404 and forwarding to error handler
slack.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler prints stacktrace
if ( ! errorHandler.hasOwnProperty(env) ) {
  env = 'production';
}
slack.use(errorHandler[env]);

slack.listen(slack.get('port'), () => {
  console.log(`Express server listening on port : ${slack.get('port')}`);
});
