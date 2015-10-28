import {isF, isO} from 'magic-types';

class UI {
  constructor() {
    const sections = document.querySelectorAll('.content > section');
    Object.keys(sections).forEach(key => {
      const section = sections[key];
      if (isF(section.querySelector)) {
        const header    = section.querySelector('header');
        const sectionId = section.getAttribute('id');

        if (section && section.classList && isF(section.classList.add)) {
          section.classList.add('hidden');
        }

        if (isF(header.addEventListener)) {
          header.addEventListener('click', this.clickEventListener, false);
        }
      }
    });
  }

  clickEventListener(evt) {
    if (window.innerWidth < 600) {
      const par = findParent(evt.target, 'section');
      par.classList.toggle('hidden');
    }
  }
}

function findParent(ele, tagName=false) {
  const par = ele.parentNode;
  if (!par || !tagName) {
    return false;
  }
  if (par.tagName.toLowerCase() === tagName.toLowerCase()) {
    return par;
  }
  return findParent(par, tagName);
}

export default new UI();
