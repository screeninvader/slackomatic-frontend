import {each} from 'magic-loops';

class Button {
  constructor(menu, li, a) {
    this.menu = menu;
    this.li = document.createElement('li');
    this.a = document.createElement('a');

    if ( li.className ) {
      this.li.className = li.className;
    }
    each(li.attributes, (val, key) => {
      this.li.setAttribute(key, val);
    });
    each(li.style, (val, key) => {
      this.li.style[key] = val;
    });
    each(li.events, (listener, event) => {
      this.li.addEventListener(event, listener);
    });

    if ( a.className ) {
      this.a.className = a.className;
    }
    if ( a.text ) {
      this.a.innerText = a.text;
    }

    this.li.appendChild(this.a);
    this.menu.parentEle.appendChild(this.li);
  }
  on() {
    this.a.classList.add('i-ok');
    this.a.classList.remove('i-cancel');
  }
  off() {
    this.a.classList.remove('i-ok');
    this.a.classList.add('i-cancel');
  }
  toggle() {
    this.a.classList.toggle('i-ok');
    this.a.classList.toggle('i-cancel');
  }
}
export default Button;
