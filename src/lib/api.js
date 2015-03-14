import {Router as router} from 'express';
import {get} from 'http';

var api = router()
  , debugLogging = true
  , lastRequestFinished = true
  , log = console.log
  , lastUrl
;

function debugLog(str) {
  if ( debugLogging ) {
    console.log(str);
  }
}

api.use('*', (req, res, next) => {
  var url = `http://127.0.0.1:8080${req.originalUrl}`;

  if ( lastUrl !== url ) {
    lastUrl = url;

    debugLog(`loading url: ${url}`);
    get(url, (result) => {
      //do nothing on complete
      debugLog(`slackomatic get res ${result.statusCode}`);
    }).on('error', (e) => {
      //do nothing on error
      debugLog("Got error: " + e.message);
    });
  }
  res.status(200).send(url);
});

export default api;
