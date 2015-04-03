import {isF} from 'magic-types';
import {each} from 'magic-loops';


var hack = document.documentElement.doScroll
  , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState)
;

if ( ! loaded ) {
  document.addEventListener('DOMContentLoaded', addInterval);
} else {
  addInterval();
}

function addInterval() {
  showHide();
  setInterval( showHide, 5000 );
}

function showHide() {
  var shown = document.querySelectorAll('header.main div.sub li.visible')
    , hidden = document.querySelectorAll('header.main div.sub li:not(.visible)')
    , ran = Math.floor(Math.random() * hidden.length - 0.1)
  ;

  each(shown, (li) => {
    if ( li.classList && isF(li.classList.remove) ) {
      li.classList.remove('visible');
    }
  });

  if ( hidden[ran] && isF(hidden[ran].getAttribute) ) {
    hidden[ran].classList.add('visible');
  }
}

