
export function toggleClass(ele, name) {
  if ( hasClass(ele, name) ) {
    rmClass(ele, name);
    return false;
  } else {
    addClass(ele, name);
    return true;
  }
}


export function hasClass(ele, name) {
  return ele.className.indexOf(name) > -1;
}


export function addClass(ele, name) {
  ele.classList.add(name);
}

export function removeClass(ele, name) {
  ele.classList.remove(name);
}

export var css = {};

css.class = {};
css.class.toggle = toggleClass;
css.class.has = hasClass;
css.class.add = addClass;
css.class.remove  = removeClass;
css.class.rm  = removeClass;

export default css;
