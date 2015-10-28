import {isF, isA, isD} from 'magic-types';
import Store, {forage} from 'magic-client-store';
import Socket from './socket';
import config from '../../../config.js';
import Menu from './menu';
//~ import Departures from './departures';

class Timetable {
  constructor() {
    this.supportedLines = config.supportedLines || {
      'U2': 'sub'
    , 'U3': 'sub'
    , '2': 'tram'
    };

    this.departures = [];

    this.getLines( (err, lines) => {
      if ( err ) { throw new Error(err); }

      this.shownLines = lines || [];

      this.menu = new Menu(this);
      this.socket = new Socket(this);
      this.render();
    });
  }

  sortByDepartTime() {
    var times = [];

    Object.keys(this.departures).forEach(key => {
      if (line && line.countdown) {
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

  getLines(cb = () => {}) {
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

      this.render();
    });
  }

  render() {
    var targetUl = document.querySelector('#departures')
      , departures = this.sortByDepartTime()
      , shownLineNum = 0
    ;
    targetUl.innerHTML = '';
    Object.keys(departures).forEach(minute => {
      const depByMinute = departures[minute];
      Object.keys(depByMinute).forEach(depKey => {
        const dep = depByMinute[depKey];
        const linie = this.showDeparture(dep);
        const isShown = this.shownLines.indexOf(linie) > -1;
        if (isShown) {
          shownLineNum += 1;
        }
      });
    });
    if (shownLineNum === 0) {
      this.betriebsschluss(targetUl);
    }

    this.menu.render();
  }

  betriebsschluss(target) {
    if (target && isF(target.appendChild)) {
      const li = document.createElement('li');
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
      if ( this.shownLines && this.shownLines.indexOf(dep.linie) === -1 ) {
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
}

export default new Timetable();
