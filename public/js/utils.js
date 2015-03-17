
export function isFunc(val) {
  return typeof val === 'function';
}

var allTimeouts = [];

export function showError(error) {
  var errorEle = getErrorEle(error);
  if ( typeof error === 'string' ) {
    css.addClass(document.body, 'connection-error');
    allTimeouts.push(
      setTimeout( () => {
        each(allTimeouts, (timeOut) => {
          clearTimeout(timeOut);
        });
        css.removeClass(document.body, 'connection-error');
      }, 3000)
    );
  }
}

export function each (arrOrObj, func) {
  if ( typeof arrOrObj === 'array' ) {
    for ( let i = 0; i < arrOrObj.length; i++ ) {
      func(arrOrObj[i], i);
    }
  } else if ( typeof arrOrObj === 'object' ) {
    for ( let key in arrOrObj ) {
      if ( arrOrObj.hasOwnProperty(key) ) {
        func(arrOrObj[key], key);
      }
    }
  } else {
    error(`utils: each called without array or object: ${arrOrObj}`);
  }
}


export var css = {
  toggleClass : (ele, name) => {
    if ( ele.className.indexOf(name) > -1 ) {
      removeClass(ele, name);
      return false;
    } else {
      addClass(ele, name);
      return true;
    }
  },
  hasClass: (ele, name) => {
    return ele.className.indexOf(name) > -1;
  },
  addClass: (ele, name) => {
    ele.classList.add(name);
  },
  removeClass: (ele, name) => {
    ele.classList.remove(name);
  }
};

export function getErrorEle(val) {
  var errorEle = document.querySelector('#error');
  if ( ! errorEle || ! isFunc(errorEle.getAttribute) ) {
    errorEle = document.createElement('div');
    errorEle.id = 'error';
    document.body.insertBefore(errorEle, document.body.firstChild)
  }
  if ( typeof val === 'string' ) {
    errorEle.innerText = val;
  }
  return errorEle;
}


export function hasLocalStorage() {
  try {
      localStorage.setItem('itemtest235', 'mod');
      if ( ! localStorage.getItem('itemtest235') === 'mod') {
        throw Error('getItem failed');
      }
      localStorage.removeItem('itemtest235');
      return true;
  } catch(e) {
      return false;
  }
}
