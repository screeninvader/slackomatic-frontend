export function view(req, res, next) {
  res.render('pages/' + req.params.page, (err, html) => {
    if ( err || ! html ) { next(err); }

    res.status(200).send(html);
  });
}
