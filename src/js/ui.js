import {each} from 'magic-loops';
import {hasStore} from 'magic-client-store';
import dom from 'magic-client-dom';
import is from 'is';

export function initUi() {
  var sections = document.querySelectorAll('.wrapper > section')
    , hasStore = hasLocalStorage()
  ;

  each(sections, (section) => {
    if ( is.fn(section.querySelector) ) {
      var header    = section.querySelector('header')
        , sectionId = section.getAttribute('id')
      ;

      if ( hasStore && ! localStorage.getItem(sectionId) ) {
        dom.class.add(section, 'hidden');
      }

      if ( is.fn(header.addEventListener) ) {
        header.addEventListener('click', clickEventListener, false);
      }
    }
  });
}

function clickEventListener(evt) {
  var section = dom.parentNode(evt.target, 'section');

  if ( hasLocalStorage && isObj(section.onclick) ) {
    let settingName = section.getAttribute('id')
      , isToggled = dom.class.toggle(section, 'hidden')
    ;
    if ( settingName ) {
      localStorage.set('ui-settings-' + settingName, isToggled);
    }
  }
}
