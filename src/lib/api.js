import {Router as router} from 'express';
import {get} from 'http';

var api = router()
  , debugLogging = true
;

api.use('*', (req, res, next) => {
  var url = `http://10.20.30.90:8080${req.originalUrl}`;
  if ( debugLogging ) {
    console.log(`loading url: ${url}`);
  }
  get(url, (result) => {
    //do nothing on complete
    if ( debugLogging ) {
      console.log(`slackomatic get res ${result.statusCode}`);
    }
  }).on('error', (e) => {
    //do nothing on error
    if ( debugLogging ) {
      console.log("Got error: " + e.message);
    }
  });
  res.status(200).send(url);
});

export default api;
