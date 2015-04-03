import page from 'page';
import {each} from 'magic-loops';
import {isF} from 'magic-types';

class Router {
  constructor() {
    page.base('/');
    page('/', this.render);
    page(':page', this.render);
    page('*', this.redirect);
    page();
  }

  redirect() {
    if ( location.pathname !== '/' ) {
      page('/');
    }
  }

  render(ctx, next) {
    var pages = document.querySelectorAll('div.content.active')
      , path  = ctx.path === '/' ? 'home' : ctx.path
      , query = `div.content.${path}`
      , page  = document.querySelector(query)
    ;

    each(pages, (p) => {
      if ( p && p.classList && isF(p.classList.remove) ) {
        p.classList.remove('active');
      }
    });

    if ( page && page.classList && isF(page.classList.add) ) {
      page.classList.add('active');
    }
  }
}

export default new Router();
