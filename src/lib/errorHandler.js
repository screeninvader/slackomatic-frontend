var errorHandler = {
  //development errorHandler, renders error page
  development(err, req, res, next) {
    res.status(err.status || 500);
    var message = {
      message: err.message,
      error: err
    };
    res.send(`error : ${JSON.stringify(message)}`);
  },

  // production error handler
  // no stacktraces leaked to user
  production(err, req, res, next) {
    res.status(err.status || 500).send('error');
  }
};

export default errorHandler;
