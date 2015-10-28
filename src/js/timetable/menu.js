import {isF} from 'magic-types';
import Button from './button';

class Menu {
  constructor(timetable) {
    this.timetable = timetable;
    this.parentEle = document.querySelector('ul#selectors');
    this.btns = [];

    this.addDom();
    this.render();
  }

  addDom() {
    var allLi = {
      events: { 'click': this.showAllLines.bind(this) }
    }
    , allA = { text: 'ALL', className: 'i i-cancel' }
    ;

    this.btns.push( new Button(this, allLi, allA) );

    var noneLi = {
      events: { 'click': this.showNoLines.bind(this) }
    }
    , noneA = { text: 'NONE', className: 'i i-cancel' }
    ;

    this.btns.push( new Button(this, noneLi, noneA) );

    Object.keys(this.timetable.supportedLines).forEach(name => {
      const linie = this.timetable.supportedLines[name];
      const li = {
            className:`linie-${name} ${linie.type} i-${linie.type}`
          , style: { 'background-color': linie.color }
          , events: { 'click': this.toggleSelectedLine.bind(this) }
          , attributes: { 'data-line': name }
        };
      const a = { text: name, className: 'i i-cancel' };
      this.btns.push(new Button(this, li, a));
    });
  }

  render() {
    Object.keys(this.btns).forEach(key => {
      this.btnOnOrOff.bind(this);
    });
  }

  btnOnOrOff(btn) {
    const shownLines = this.timetable.shownLines;
    const supportedLines = this.timetable.supportedLines;
    if (count(shownLines) >= count(supportedLines)) {
      if (btn.a.innerText !== 'NONE') {
        btn.on();
      } else {
        btn.off();
      }
    } else if (count(shownLines) === 0) {
      if (btn.a.innerText === 'NONE') {
        btn.on();
      } else {
        btn.off();
      }
    } else if (btn.a.innerText) {
      if (btn.a.innerText === 'NONE' || btn.a.innerText === 'ALL') {
        btn.off();
      } else if (shownLines.indexOf(btn.a.innerText) > -1) {
        btn.on();
      } else {
        btn.off();
      }
    }
  }

  showAllLines(evt) {
    const newLines = [];
    Object.keys(this.timetable.supportedLines).forEach(name => {
      newLines.push(name);
    });
    this.timetable.setLines(newLines, this.render.bind(this));
  }

  showNoLines(evt) {
    this.timetable.setLines([], this.render.bind(this));
  }

  toggleSelectedLine(evt) {
    //if we click the a in the li then we need to target the parentNode,
    const target = evt.target.parentNode.tagName === 'LI'
                  ? evt.target.parentNode
                  : evt.target;
    const toggledLine = target.getAttribute('data-line');
    const childA = target.querySelector('a')
    let newLines = [];
    let found = false;
    each(this.timetable.shownLines, (line, key) => {
      if (line && line !== toggledLine) {
        newLines.push(line);
      } else if ( line === toggledLine ) {
        found = true;
      }
    });
    if ( ! found ) {
      newLines.push(toggledLine);
    }
    this.timetable.setLines(newLines, this.render.bind(this.timetable));
  }
}

export default Menu;
