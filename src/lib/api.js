import {Router as router} from 'express';
import {get} from 'http';

var api = router()
  , debugLogging = true
  , lastRequestFinished = true
  , lastUrl
;

function debugLog(str) {
  if ( debugLogging ) {
    console.log(str);
  }
}

api.use((req, res, next) => {
  var url = `http://127.0.0.1:8080${req.originalUrl}`;

  debugLog(`loading url: ${url}`);
  get(url, (result) => {
    debugLog(`slackomatic get res ${result.statusCode}`);
    res.status(200).send(`Slackomatic get request <span color="green">succeeded</span>: redirected request to backend url ${url}`);
  }).on('error', (e) => {
    debugLog("Got error: " + e.message);
    res.status(500).send(`Slackomatic get request <span color="red">errored</span>: redirected request to backend url ${url}`);
  });
});

export default api;
