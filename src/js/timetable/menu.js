import {each, count} from 'magic-loops';
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

    each(this.timetable.supportedLines, (linie, name) => {
      var li = {
            className:`linie-${name} ${linie.type} i-${linie.type}`
          , style: { 'background-color': linie.color }
          , events: { 'click': this.toggleSelectedLine.bind(this) }
          , attributes: { 'data-line': name }
        }
        , a = { text: name, className: 'i i-cancel' }
      ;
      this.btns.push( new Button(this, li, a) );
    });
  }

  render() {
    each(this.btns, this.btnOnOrOff.bind(this));
  }

  btnOnOrOff(btn) {
    var shownLines = this.timetable.shownLines
      , supportedLines = this.timetable.supportedLines
    ;
    if ( count(shownLines) >= count(supportedLines) ) {
      if ( btn.a.innerText !== 'NONE' ) {
        btn.on();
      } else {
        btn.off();
      }
    } else if ( count(shownLines) === 0) {
      if ( btn.a.innerText === 'NONE' ) {
        btn.on();
      } else {
        btn.off();
      }
    } else if ( btn.a.innerText ) {
      if ( btn.a.innerText === 'NONE' || btn.a.innerText === 'ALL' ) {
        btn.off();
      } else if ( shownLines.indexOf(btn.a.innerText) > -1 ) {
        btn.on();
      } else {
        btn.off();
      }
    }
  }

  showAllLines(evt) {
    var newLines = [];
    each(this.timetable.supportedLines, (line, name) => {
      newLines.push(name);
    });
    this.timetable.setLines(newLines, this.render.bind(this.timetable));
  }

  showNoLines(evt) {
    this.timetable.setLines([], this.render.bind(this.timetable));
  }

  toggleSelectedLine(evt) {
    //if we click the a in the li then we need to target the parentNode
    var target = evt.target.parentNode.tagName === 'LI'
                  ? evt.target.parentNode
                  : evt.target
      , toggledLine = target.getAttribute('data-line')
      , childA     = target.querySelector('a')
      , newLines = []
      , found = false
    ;
    each(this.timetable.shownLines, (line, key) => {
      if ( line && line !== toggledLine ) {
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
