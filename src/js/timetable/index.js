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
    
    this.addAllAndNoneBtns();
    this.initShowLines();

    this.departures = [];
    this.socket = new Socket(this);

  }

  initShowLines() {
    var selectorEle = document.querySelector('ul#selectors')
      , lis = []
    ;
    if ( selectorEle ) {
      each(this.supportedLines, (linie, name) => {
        var li = document.createElement('li');
        li.className = `linie-${name} ${linie.type} i-${linie.type}`;
        li.style['background-color'] = linie.color;
        li.addEventListener('click', this.toggleSelectedLine.bind(this));
        li.innerText = name;
        li.setAttribute('data-line', name);

        selectorEle.appendChild(li);
      });
    }
  }
  
  addAllAndNoneBtns() {
    var targetDiv = document.querySelector('ul#selectors')
      , allBtn  = document.createElement('li')
      , noneBtn = document.createElement('li')
    ;
    allBtn.innerHTML = 'ALL';
    noneBtn.innerHTML = 'NONE';
    allBtn.addEventListener( 'click', this.showAllLines.bind(this) );
    noneBtn.addEventListener( 'click', this.showNoLines.bind(this) );
    
    targetDiv.appendChild(allBtn);
    targetDiv.appendChild(noneBtn);
  }
  showAllLines() {
    var newLines = [];
    each(this.supportedLines, (line, name) => {
      newLines.push(name);
    });
    this.shownLines = newLines;
    this.rerender();
  }

  showNoLines() {
    this.shownLines = [];
    this.rerender();
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
    this.rerender();
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

  rerender() {
    var targetUl = document.querySelector('#departures')
      , departures = this.sortByDepartTime(this.departures)
      , shownLineNum = 0
    ;
    targetUl.innerHTML = '';
    each(departures, (depByMinute, minute) => {
      console.log('minute', minute);
      each(depByMinute, (dep, depKey) => {
        var linie = this.showDeparture(dep)
          , isShown = this.shownLines.indexOf(linie) > -1
        ;
        if ( isShown ) {
          console.log(isShown, dep);
          shownLineNum += 1;
        }
      });
    });
    if ( shownLineNum === 0 ) {
      this.betriebsschluss(targetUl);
    }
    this.departures = departures;
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
    var shownLines = this.shownLines
      , toggledLine = evt.target.getAttribute('data-line')
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
    this.setLines(newLines, this.rerender.bind(this));
  }
}

export default new Timetable();
