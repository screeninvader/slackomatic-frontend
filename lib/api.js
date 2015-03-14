import {Router as router} from 'express';
import {get} from 'http';

var api = router()
  , debug = false
;

api.use('/slackomatic/*', (req, res, next) => {
  var url = `http://${req.ip}:8080${req.originalUrl}`;
  if ( debug ) {
    console.log(`loading url: ${url}`);
  }
  get(url, (result) => {
    //do nothing on complete
    if ( debug ) {
      console.log(`result: ${result}`);
    }
  }).on('error', (e) => {
    //do nothing on error
    if ( debug ) {
      console.log("Got error: " + e.message);
    }
  });
  res.status(200).send(url);
});

export default api;
