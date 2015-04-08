#!/usr/bin/env node

import {createServer} from 'http';
import {join} from 'path';
import {readFileSync as read} from 'fs';
import config from './config.js';
import {each} from 'magic-loops';

var port = process.argv[2] || config.port || 1337
  , pages = config.pages || {'/': {mime: 'text/html', name:'index.html'}}
  , files = {}
;

each(config.files, (file, key) => {
  files[key] = {
      mime: file.mime
    , data: read( join(__dirname, file.name) )
  };
});

var server = createServer( (req, res) => {
  var data = files[req.url];

  if ( req.url === '/killkillkill' ) {
    res.end('killed');
    return process.exit();
  }

  if ( pages.indexOf(req.url) > -1 && ! data ) {
    data = files['/'];
  }

  if ( data && data.data && data.mime ) {
    res.writeHead(200, {'Content-Type': data.mime});
    res.end(data.data);
  } else {
    res.writeHead(301, {
      Location: '/'
    });
    res.end(); 
  }
});

server.listen(port);

console.log(`Servomatic listening to port ${port}`);
