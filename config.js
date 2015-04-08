'use strict';
module.exports = {
  port: 1337
, socket: {
    host: '10.20.30.90'
  , port: 8082
  }
, pages: [
    '/', 
    '/index.html', 
    '/advanced', 
    '/troubleshooting', 
    '/timetable'
  ]
, files:{
      '/': {
        mime: 'text/html'
      , name: 'index.html'
    }
    , '/slackomatic.appcache': {
        mime: 'text/plain'
      , name: 'slackomatic.appcache'
    }
    , '/favicon.ico': {
        mime: 'image/x-icon'
      , name: 'favicon.ico'
    }
    , '/img/cleanup_reminder.jpg': {
        mime: 'image/jpg'
      , name: 'img/cleanup_reminder.jpg'
    }
    , '/img/power_down_warning.png': {
        mime: 'image/png'
      , name: 'img/power_down_warning.png'
    }
  }
  , supportedLines: {
      '13A': {type: 'bus',  color: '#5caed7'}
    , '2':   {type: 'tram', color: '#e35885'}
    , 'U2':  {type: 'sub',  color: '#8a5a83'}
    , 'U3':  {type: 'sub',  color: '#f76205'}
  }
};
