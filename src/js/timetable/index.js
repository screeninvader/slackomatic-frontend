import {each, count} from 'magic-loops';
import {isF, isA, isD} from 'magic-types';
import Store, {forage} from 'magic-client-store';
import Socket from './socket';
import config from '../../../config.js';

class Timetable {
  constructor() {
    this.supportedLines = config.supportedLines || {
      'U2': 'sub'
    , 'U3': 'sub'
    , '2': 'tram'
    };
    this.shownLines = [];

    this.init();

    this.departures = [];
    this.socket = new Socket(this);

  }

  init() {
    var selectorEle = document.querySelector('ul#selectors')
      , lis = []
    ;
    this.addAllAndNoneBtns();

    if ( selectorEle ) {
      each(this.supportedLines, (linie, name) => {
        var li = document.createElement('li')
          , a  = document.createElement('a')
        ;
        li.className = `linie-${name} ${linie.type} i-${linie.type}`;
        li.style['background-color'] = linie.color;
        li.addEventListener('click', this.toggleSelectedLine.bind(this));
        a.innerText = name;
        a.className = 'i i-cancel';
        li.setAttribute('data-line', name);
        li.appendChild(a);

        selectorEle.appendChild(li);
      });
    }
    
    this.setButtonClasses();
  }

  addAllAndNoneBtns() {
    var targetDiv = document.querySelector('ul#selectors')
      , allBtn  = document.createElement('li')
      , noneBtn = document.createElement('li')
      , allA   = document.createElement('a')
      , noneA   = document.createElement('a')
    ;
    allA.innerHTML = 'ALL';
    noneA.innerHTML = 'NONE';
    allA.className = 'i-cancel';
    noneA.className = 'i-cancel';
    allBtn.appendChild(allA);
    noneBtn.appendChild(noneA);

    allBtn.addEventListener( 'click', this.showAllLines.bind(this), true );
    noneBtn.addEventListener( 'click', this.showNoLines.bind(this), true );

    targetDiv.appendChild(allBtn);
    targetDiv.appendChild(noneBtn);
  }

  showAllLines(evt) {
    var targetUl = document.querySelector('ul#selectors')
      , btns     = targetUl.querySelectorAll('li a')
      , newLines = []
    ;

    each(this.supportedLines, (line, name) => {
      newLines.push(name);
    });
    this.shownLines = newLines;
    this.render();
  }

  showNoLines(evt) {
    var targetUl = document.querySelector('ul#selectors')
      , btns     = targetUl.querySelectorAll('li a')
    ;
    this.shownLines = [];
    this.render();
  }

  setButtonClasses() {
    var ul   = document.querySelector('ul#selectors')
      , btns = ul.querySelectorAll('li')
      , as   = ul.querySelectorAll('li a')
      , shownLines = this.shownLines
      , all  = false
      , none  = false
    ;
    console.log('shownLines', shownLines);
    each(as, (a) => {
      if ( count(shownLines) >= count(this.supportedLines) ) {
        if ( a.innerText !== 'NONE' ) {
          this.btnOn(a);
        } else {
          this.btnOff(a);
        }
      } else if ( count(shownLines) === 0) {
        if ( a.innerText === 'NONE' ) {
          this.btnOn(a);
        } else {
          this.btnOff(a);
        }
      } else if ( a.innerText ) {
        if ( a.innerText === 'NONE' || a.innerText === 'ALL' ) {
          this.btnOff(a);
        } else if ( shownLines.indexOf(a.innerText) > -1 ) {
          this.btnOn(a);
        } else {
          this.btnOff(a);
        }
      }
    });
    
  }
  btnOn(a) {
    if ( a && a.classList && isF(a.classList.remove) ) {
      a.classList.add('i-ok');
      a.classList.remove('i-cancel');
    }
  }

  btnOff(a) {
    if ( a && a.classList && isF(a.classList.remove) ) {
      a.classList.remove('i-ok');
      a.classList.add('i-cancel');
    }
  }
  btnToggle(a) {
    if ( a && a.classList && isF(a.classList.toggle) ) {
      a.classList.toggle('i-ok');
      a.classList.toggle('i-cancel');
    }
  }
  sortByDepartTime(lines) {
    var times = [];

    each(lines, (line, key) => {
      if ( line && line.countdown ) {
        times[line.countdown] = [];
        times[line.countdown].push(line);
      }
    });

    return times;
  }

  update(departures) {
    this.departures = departures;
    this.render();
  }

  getLines(cb) {
    cb = cb || () => {};

    forage.getItem('shownLines', (err, data) => {
      if ( err ) { throw Error(err); }
      cb(err, data);
    });
  }
  
  setLines(data, cb) {
    cb = cb || () => {};

    this.shownLines = data;

    forage.setItem('shownLines', data, (err) => {
      if ( err ) { throw Error(err); }

      cb(err, data);
    });
  }

  render() {
    var targetUl = document.querySelector('#departures')
      , departures = this.sortByDepartTime(this.departures)
      , shownLineNum = 0
    ;
    targetUl.innerHTML = '';
    each(departures, (depByMinute, minute) => {
      each(depByMinute, (dep, depKey) => {
        var linie = this.showDeparture(dep)
          , isShown = this.shownLines.indexOf(linie) > -1
        ;
        if ( isShown ) {
          shownLineNum += 1;
        }
      });
    });
    if ( shownLineNum === 0 ) {
      this.betriebsschluss(targetUl);
    }
    this.departures = departures;

    this.setButtonClasses();
  }

  betriebsschluss(target) {
    if ( target && isF(target.appendChild) ) {
      let li = document.createElement('li');
      li.innerHTML = 'Kein Fahrbetrieb oder keine Linie ausgewählt';
      li.className = 'betriebsschluss centered';
      //return to break execution
      target.appendChild(li);
      return true;
    }
    return false;
  }

  showDeparture(dep) {
    dep.type = this.supportedLines[dep.linie].type;
    dep.color = this.supportedLines[dep.linie].color;
    if ( dep.towards || dep.countdown || dep.linie ) {
      if ( this.shownLines.indexOf(dep.linie) === -1 ) {
        return false;
      }

      var targetDiv = document.querySelector('#departures')
        , li = document.createElement('li')
        , nameSpan = document.createElement('span')
        , timeSpan = document.createElement('span')
        , countDown = dep.countdown.match(/\d+$/) || '?'
        , nameText = dep.towards
      ;

      nameText = `${dep.linie} -> ${nameText}`;
      nameSpan.innerHTML = nameText;
      li.appendChild(nameSpan);
      li.className = `linie-${dep.linie} i-${dep.type} i`;
      li.style['background-color'] = dep.color;

      timeSpan.innerHTML = countDown;
      li.appendChild(timeSpan);

      targetDiv.appendChild(li);
      return dep.linie;
    }
    return false;
  }

  toggleSelectedLine(evt) {
    var target = evt.target.parentNode.tagName === 'LI'
                  ? evt.target.parentNode
                  : evt.target
      , shownLines = this.shownLines
      , toggledLine = target.getAttribute('data-line')
      , childA     = target.querySelector('a')
      , newLines = []
      , found = false
    ;
    each(shownLines, (line, key) => {
      if ( line && line !== toggledLine ) {
        newLines.push(line);
      } else if ( line === toggledLine ) {
        found = true;
      }
    });
    if ( ! found ) {
      newLines.push(toggledLine);
    }
    this.setLines(newLines, this.render.bind(this));
  }
}

export default new Timetable();
