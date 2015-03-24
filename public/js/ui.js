import {each, isFunc, hasStore, hasLocalStorage} from './utils';
import dom from './utils/dom';

export function initUi() {
  var sections = document.querySelectorAll('.wrapper > section')
    , hasStore = hasLocalStorage()
  ;
  
  each(sections, (section) => {
    if ( isFunc(section.querySelector) ) {
      var header = section.querySelector('header')
        , sectionId = section.getAttribute('id')
      ;

      if ( hasStore && ! localStorage.getItem(sectionId) ) {
        section.classList.add('hidden');
      }

      if ( isFunc(header.addEventListener) ) {
        header.addEventListener('click', clickEventListener, false);
      }
    }
  });
}

function clickEventListener(evt) {
  var section = dom.parent(evt.target, 'section');
  
  ;
  if ( hasStore && isObj(section.onclick) ) {
    let settingName = section.getAttribute('id')
      , isToggled = dom.class.toggle(section, 'hidden')
    ;
    if ( settingName ) {
      localStorage.set('ui-settings-' + settingName, isToggled);
    }
  }
}
