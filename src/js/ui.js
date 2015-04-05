import {each} from 'magic-loops';
import {isF, isO} from 'magic-types';

class UI {
  constructor() {
    var sections = document.querySelectorAll('.content > section');
    each(sections, (section) => {
      if ( isF(section.querySelector) ) {
        var header    = section.querySelector('header')
          , sectionId = section.getAttribute('id')
        ;

        if ( section && section.classList && isF(section.classList.add) ) {
          section.classList.add('hidden');
        }

        if ( isF(header.addEventListener) ) {
          header.addEventListener('click', this.clickEventListener, false);
        }
      }
    });
  }

  clickEventListener(evt) {
    if ( window.innerWidth < 600 ) {
      let par = findParent(evt.target, 'section');
      par.classList.toggle('hidden');
    }
  }
}

function findParent(ele, tagName=false) {
  var par = ele.parentNode;
  if ( ! par || ! tagName  ) {
    return false;
  }
  if ( par.tagName.toLowerCase() === tagName.toLowerCase() ) {
    return par;
  }
  return findParent(par, tagName);
}

export default new UI();
