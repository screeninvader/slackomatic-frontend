import {each} from 'magic-loops';
import {frameGet} from 'magic-client-http';
import is from 'is';

var rootUrl = '/slackomatic/';

//add eventlisteners to all inputs
export function initApi() {
  var clickInputs = document.body.querySelectorAll('input[data-command]');

  each(clickInputs, (input) => {
    if ( is.fn(input.addEventListener) ) {
      input.addEventListener( 'click', clickEventListener, false );
    }
  });
  //httpGet request /slackomatic/room/lounge/powersaving/killswitch/reset 
  frameGet(getUrl('room/lounge/', 'powersaving/killswitch/reset'));
}

function clickEventListener(evt) {
  if ( evt.target || is.fn(evt.target.getAttribute === 'function') ) {
    let command = evt.target.getAttribute('data-command')
      , path = evt.target.getAttribute('data-path')
      , url = getUrl(command, path)
    ;
    frameGet(url);
  }
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
