import {get} from 'http';

var rootUrl = '/slackomatic/';

//add eventlisteners to all inputs
export function initSlack() {
  var clickInputs = document.body.querySelectorAll('input[data-command]');
  console.log('clickInputs.length', clickInputs.length);

  for( let i = 0; i < clickInputs.length; i++ ) {
    clickInputs[ i ].addEventListener( 'click', clickEventListener, false );
  }
}

function clickEventListener(evt) {
  var target = evt.target
    , dataCommand = target.getAttribute('data-command')
    , dataPath = target.getAttribute('data-path')
    , url = getUrl(dataCommand, dataPath);
  ;
  console.log('url', url);
  request(url);
}

function getCallback(res) {
  console.log(`get request callback, status: ${res.statusCode}`);
}

function getErrorCallback(err) {
  console.log(`get request error cb, error: ${err}`);
}

function request(url, cb = getCallback, errorCb = getErrorCallback) {
  console.log('getting url ' + url);
  var getter = get(url, cb)
    .on('error', errorCb);
}

function getUrl(command = false, path = false) {
  var url = rootUrl;
  if ( path ) {
    url += path;
  }
  if ( command ) {
    url += command;
  }
  return url;
}
