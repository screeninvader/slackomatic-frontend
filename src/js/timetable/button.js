class Button {
  constructor(menu, li, a) {
    this.menu = menu;
    this.li = document.createElement('li');
    this.a = document.createElement('a');
    if (li.className) {
      this.li.className = li.className;
    }
    Object.keys(li.attributes).forEach(key => {
      const val = li.attributes[key];
      this.li.setAttribute(key, val);
    });
    Object.keys(li.style).forEach(key => {
      const val = li.style[key];
      this.li.style[key] = val;
    });
    Object.keys(li.events).forEach(event => {
      const listener = li.events[event];
      this.li.addEventListener(event, listener);
    });

    if (a.className) {
      this.a.className = a.className;
    }
    if (a.text) {
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
