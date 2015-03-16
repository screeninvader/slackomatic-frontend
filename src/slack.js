import express from 'express';
import {get} from 'http';
import {join} from 'path';
import favicon from 'serve-favicon';
import api from './lib/api';
import errorHandler from './lib/errorHandler';
import logger from './lib/logger';
import killer from './lib/killer';

var slack = express()
  , env       = slack.get('env')
  , cwd       = __dirname
  , viewDir   = join(cwd, 'views')
  , publicDir = join(cwd, 'public')
;

slack.set('port', process.env.PORT || 80);

slack.use(favicon(join(publicDir, 'favicon.ico')));

//if requested path exists in /public it gets served from there
slack.use(express.static(publicDir));

logger(slack);

//slackomatic api redirect
slack.use('/slackomatic', api);

slack.use(killer);

slack.use(express.static(viewDir));

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
  console.log(`slacking on port : ${slack.get('port')}`);
});
