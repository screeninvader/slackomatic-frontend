import {get} from './utils/http';
import {each, isFunc} from './utils';

var rootUrl = '/slackomatic/';

//add eventlisteners to all inputs
export function initApi() {
  var clickInputs = document.body.querySelectorAll('input[data-command]');

  each(clickInputs, (input) => {
    if ( isFunc(input.addEventListener) ) {
      input.addEventListener( 'click', clickEventListener, false );
    }
  });
  //httpGet requests /slackomatic/room/lounge/powersaving/killswitch/reset 
  get(getUrl('room/lounge/', 'powersaving/killswitch/reset'));
}

function clickEventListener(evt) {
  if ( evt.target || isFunc(evt.target.getAttribute === 'function') ) {
    let command = evt.target.getAttribute('data-command')
      , path = evt.target.getAttribute('data-path')
      , url = getUrl(command, path)
    ;
    get(url);
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
