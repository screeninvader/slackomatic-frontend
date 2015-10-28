import {isF} from 'magic-types';
import {frameGetRequest} from './frameGetRequest';

class Api {
  constructor() {
    this.rootUrl = 'http://10.20.30.90:8080/slackomatic/';

    //add eventlisteners to all inputs
    const clickInputs = document.body.querySelectorAll('input[data-command]');
    Object.keys(clickInputs).forEach(key => {
      const input = clickInputs[key];
      if (isF(input.addEventListener)) {
        input.addEventListener( 'click', this.clickEventListener.bind(this), false );
      }
    });
  }

  clickEventListener(evt) {
    if (evt.target || isF(evt.target.getAttribute === 'function')) {
      const command = evt.target.getAttribute('data-command')
        , url = this.rootUrl + command
      ;
      frameGetRequest(url);
    }
  }
}

export default new Api();
