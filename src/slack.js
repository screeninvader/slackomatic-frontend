import express from 'express';
import {get} from 'http';
import {join} from 'path';
import favicon from 'serve-favicon';
import api from './lib/api';
import errorHandler from './lib/errorHandler';
import logger from './lib/logger';
import killer from './lib/killer';
import {view} from './lib/view';
import info from './public/versions.json';

var slack = express()
  , env       = slack.get('env')
  , cwd       = __dirname
  , staticDir = join(cwd, 'static')
  , publicDir = join(cwd, 'public')
  , viewDir   = join(cwd, 'views')
;

slack.set('port', process.env.PORT || 80);

// view engine setup for the rare cases where no html file exists
slack.set('views', viewDir);
slack.set('view engine', 'jade');

slack.use(favicon(join(publicDir, 'favicon.ico')));

//if requested path exists in /public it gets served from there
slack.use(express.static(publicDir));

logger(slack);

//slackomatic api redirect
slack.use('/slackomatic/*', api);

slack.use(killer);

slack.use(express.static(staticDir, {
  extensions: ["html"], //add html extension
  index: true //always load index.html files on /
}));

slack.use('/slackomatic', (req, res, next) => {
  res.locals.info = info;
});

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
  console.log(`slacking on port : ${slack.get('port')}`);
});
