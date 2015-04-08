import {each} from 'magic-loops';
import {isF} from 'magic-types';
import config from '../../../config.js';

export class Socket {
  constructor(timetable) {
    if ( config && config.socket ) {
      var loc = window.location
      this.host = `${config.socket.host}:${config.socket.port}`;
      this.uri = (loc.protocol === 'https:' 
                  ? 'wss:' 
                  : 'ws:') + '//' + this.host + '/websocket/monitors/'
      ;

      this.socket = new WebSocket(this.uri)
      
      this.socket.onopen = function(evt) {
        console.log('connection to timetable opened');
      }

      this.socket.onclose = function(evt) {
        console.log('connection to timetable closed');
      }

      this.socket.onmessage = function(evt) {
        var monitor = JSON.parse(evt.data);

        if ( monitor && monitor.departures ) {
          timetable.update(monitor.departures);
        }
      }

      this.socket.onerror = function(evt) {
        console.error('Socket Error: ' + evt);
      };
    }
  }
}

export default Socket;
