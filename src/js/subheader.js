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

function setup() {
  var lis = document.querySelectorAll('header.main div.sub li')
    , replacers = [ 
        { val: 'o', regex: /o/g } 
      , { val: 'O', regex: /O/g }
      , { val: '!', regex: /\!/g }
      , { val: '?', regex: /\?/g }
    ]
  ;

  each(lis, (li) => {
    if ( li.innerHTML ) {
      var html = li.innerHTML;
      if ( html ) {
        each(replacers, (char) => {
          html = html.replace(
            char.regex, `<span class="pinkie">${char.val}</span>`
          );
        });
      }
      li.innerHTML = html;
    }
  });
}
setup();

function showHide() {
  var shown = document.querySelectorAll('header.main div.sub li.visible')
    , hidden = document.querySelectorAll('header.main div.sub li:not(.visible)')
    , ran = Math.floor(Math.random() * ( hidden.length - 0.01 ) )
    , showNow = hidden[ran]
  ;

  each(shown, (li) => {
    if ( li.classList && isF(li.classList.remove) ) {
      li.classList.remove('visible');
    }
  });

  if ( showNow && showNow.classList && isF(showNow.classList.add) ) {
    showNow.classList.add('visible');
  }
}


