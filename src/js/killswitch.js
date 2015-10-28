import {frameGetRequest} from './frameGetRequest';

const rootUrl = 'http://10.20.30.90:8080/slackomatic/';

window.addEventListener('DOMContentLoaded', () => {
  setTimeout( () => {
    //httpGet request /slackomatic/room/lounge/powersaving/killswitch/reset 
    frameGetRequest(
      rootUrl + 'rooms/lounge/powersaving/killswitch/reset'
    , () => {
        console.log('killswitch triggered');
      }
    );
  }, 200);
});
