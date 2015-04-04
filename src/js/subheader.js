import {isF} from 'magic-types';
import {each} from 'magic-loops';

var hack = document.documentElement.doScroll
  , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState)
  , animDuration = 5000
  , interval
  , containerDiv = document.querySelector('header.main div.sub')
  , visibleClassName = 'visible'
  , intervalRunning = false;
;

if ( window.innerWidth >= 320 ) {
  if ( ! loaded ) {
    document.addEventListener('DOMContentLoaded', addInterval);
  } else {
    addInterval();
  }
}

function addInterval() {
  if ( intervalRunning === false ) {
    console.log('addInterval');
    intervalRunning = true;
    interval = setInterval( showHide, animDuration );
  }
}

function removeInterval() {
   if ( intervalRunning ) {
    console.log('removeInterval');
    intervalRunning = false;
    clearInterval(interval);
  }
}

function setup() {
  var lis = containerDiv.querySelectorAll('li')
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
  if ( window.innerWidth >= 320 ) {
    var hidden = containerDiv.querySelectorAll('li:not(.visible)')
      , ran = Math.floor(Math.random() * ( hidden.length - 0.01 ) )
      , showNow = hidden[ran]
    ;

    hideAll();

    if ( showNow && showNow.classList && isF(showNow.classList.add) ) {
      showNow.classList.add(visibleClassName);
    }
  }
}

function hideAll() {
  var shown = containerDiv.querySelectorAll('li.visible'); 
  each(shown, (li) => {
    if ( li.classList && isF(li.classList.remove) ) {
      li.classList.remove(visibleClassName);
    }
  });
}

function showFirstChild() {
  var child = containerDiv.querySelector('li:first-child');
  hideAll();
  if ( child && child.classList && isF(child.classList.add) ) {
    child.classList.add(visibleClassName);
  }
}

window.addEventListener('resize', () => {
  if ( window.innerWidth < 320 ) {
    showFirstChild();
    removeInterval();
  } else {
    addInterval();
  }
});
