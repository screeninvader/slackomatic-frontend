import page from 'page';
import {isF} from 'magic-types';
import config from '../../config.js';

class Router {
  constructor() {
    page.base('/');
    page('/', this.render);
    page(':page', this.render)
    page('*', this.redirect);
    page();
  }

  redirect() {
    if (location.pathname !== '/') {
      page('/');
    }
  }

  render(ctx, next) {
    const pages = document.querySelectorAll('div.content.active');
    const path  = ctx.path === '/' ? 'home' : ctx.path;
    const query = `div.content.${path}`;
    const page  = document.querySelector(query);

    Object.keys(pages).forEach(key => {
      const p = pages[key];
      if (p && p.classList && isF(p.classList.remove)) {
        p.classList.remove('active');
      }
    });

    if (page && page.classList && isF(page.classList.add)) {
      page.classList.add('active');
    }
  }
}

export default new Router();
