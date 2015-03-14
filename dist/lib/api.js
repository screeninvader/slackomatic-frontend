"use strict";

var router = require("express").Router;

var get = require("http").get;

var api = router(),
    debugLogging = true,
    lastRequestFinished = true,
    log = console.log,
    lastUrl;

function debugLog(str) {
  if (debugLogging) {
    console.log(str);
  }
}

api.use("*", function (req, res, next) {
  var url = "http://127.0.0.1:8080" + req.originalUrl;

  if (lastUrl !== url) {
    lastUrl = url;

    debugLog("loading url: " + url);
    get(url, function (result) {
      //do nothing on complete
      debugLog("slackomatic get res " + result.statusCode);
    }).on("error", function (e) {
      //do nothing on error
      debugLog("Got error: " + e.message);
    });
  }
  res.status(200).send(url);
});

module.exports = api;
//# sourceMappingURL=api.js.map