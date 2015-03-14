"use strict";

var errorHandler = {
  //development errorHandler, renders error page
  development: function development(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  },

  // production error handler
  // no stacktraces leaked to user
  production: function production(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {}
    });
  }
};

module.exports = errorHandler;
//# sourceMappingURL=errorHandler.js.map