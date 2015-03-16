//logging middleware
import express from 'express';
import morgan from 'morgan';
import {join} from 'path';
import {createWriteStream as wStream} from 'fs';

//log into one file for now
var logDir = join(process.cwd(), 'log')
  , logFile = join(logDir, 'access.log')
  , errorLogFile = join(logDir, 'error.log')
  , logStream = wStream(logFile, {flags: 'a'})
  , errorLogStream = wStream(errorLogFile, {flags: 'a'})
  , logOptions = {
      stream: logStream
    , skip: function (req, res) { return res.statusCode >= 400 }
  }
  , errorLogOptions = {
      stream: errorLogStream
    , skip: function (req, res) { return res.statusCode < 400 }
  }
;


export function logger(app) {
  app.use(morgan(logOptions));
  app.use(morgan(errorLogOptions));
}

export default logger;
