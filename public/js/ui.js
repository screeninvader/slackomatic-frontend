import {each, isFunc, css, hasStore, hasLocalStorage} from './utils';

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
  var section = evt.target.parentNode.parentNode.parentNode
    , isToggled = css.toggleClass(section, 'hidden')
  ;
  if ( hasStore ) {
    var settingName = section.getAttribute('id');
    if ( settingName ) {
      localStorage.set('ui-settings-' + settingName, isToggled);
    }
  }
}
