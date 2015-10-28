#!/usr/bin/env node

import {createServer} from 'http';
import {join} from 'path';
import {readFileSync as read} from 'fs';
import config from './config.js';

const port = process.argv[2] || config.port || 1337
const pages = config.pages || {'/': {mime: 'text/html', name:'index.html'}};
const files = {};

Object.keys(config.files).forEach(key => {
  const file = config.files[key];
  files[key] = {
    mime: file.mime,
    data: read(join(__dirname, file.name)),
  };
});

const server = createServer((req, res) => {
  let file = files[req.url];

  if (req.url === '/killkillkill') {
    res.end('killed');
    return process.exit();
  }

  if (pages.indexOf(req.url) > -1 && ! file) {
    file = files['/'];
  }

  if (file && file.data && file.mime) {
    res.writeHead(200, {'Content-Type': file.mime});
    res.end(file.data);
  } else {
    res.writeHead(301, {
      Location: '/'
    });
    res.end(); 
  }
});

server.listen(port);

console.log(`Servomatic listening to port ${port}`);
