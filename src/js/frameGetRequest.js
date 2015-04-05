import {isF} from 'magic-types';

export function frameGetRequest(url, cb) {
  cb = cb || () => {};
  var frame = document.createElement('iframe');
  frame.classList.add('hidden');
  frame.src = url;
  frame.addEventListener('load', () => {
    console.log(`iframe http request loaded with url: ${url}`);
    frame.parentNode.removeChild(frame);
    cb();
  });
  document.body.appendChild(frame);
}

export default frameGetRequest;
