import {each} from 'magic-loops';
import {isF} from 'magic-types';

class Api {
  constructor() {
    this.rootUrl = 'http://10.20.30.90:8080/slackomatic/';

    //add eventlisteners to all inputs
    var clickInputs = document.body.querySelectorAll('input[data-command]');
    each(clickInputs, (input) => {
      if ( isF(input.addEventListener) ) {
        input.addEventListener( 'click', this.clickEventListener.bind(this), false );
      }
    });
    //httpGet request /slackomatic/room/lounge/powersaving/killswitch/reset 
    this.frameGet(this.rootUrl + 'rooms/lounge/powersaving/killswitch/reset');
  }

  clickEventListener(evt) {
    if ( evt.target || isF(evt.target.getAttribute === 'function') ) {
      let command = evt.target.getAttribute('data-command')
        , url = this.rootUrl + command
      ;
      this.frameGet(url);
    }
  }

  frameGet(url) {
    var frame = document.createElement('iframe');

    frame.classList.add('hidden');
    frame.src = url;
    frame.addEventListener('load', () => {
      console.log(`iframe http request loaded with url: ${url}`);
      frame.parentNode.removeChild(frame);
    });

    document.body.appendChild(frame);
  }
}

export default new Api();
