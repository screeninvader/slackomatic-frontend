import {isObj, isStr, each} from './index';

export function prepend (parent, ele) {
  if ( ele && isObj(ele.onclick) && parent && isObj(parent.onclick) ) {
    return parent.insertBefore(ele, parent.firstChild);
  }
  return false;
}

export function append (parent, ele) {
  if ( parent && parent.appendChild && isObj(ele.onclick) ) {
    return parent.appendChild(ele);
  }
  return false;
}

export function remove(ele) {
  ele.parentNode.removeChild(ele);
}

export function create(ele) {
  return document.createElement(ele);
}

export function id(ele, val) {
  if ( ! ele || ! isObj(ele.onclick) ) {
    throw new Error('dom.id called without arguments, dom.id(ele, text)');
  }
  if ( ! val ) {
    return ele.getAttribute('id');
  }
  if ( isStr(val) ) {
    ele.setAttribute('id', val);
    return ele.getAttribute('id');
  }
}

export function cssClass(ele, name) {
  if ( ! ele || ! isObj(ele.onclick) ) {
    throw Error('dom.class called without arguments, dom.class(ele, name)');
  }
  if ( ! name ) {
    return ele.className;
  }
  var nameArray = name.split(/,| /ig);
  each(nameArray, (name) => {
    addClass(ele, name);
  });
  return name;
}

export function toggleClass(ele, name) {
  if ( ! ele || ! isObj(ele.onclick) ) {
    throw Error('dom.class.toggle called without arguments, dom.class.toggle(ele, name)');
  }
  if ( hasClass(ele, name) ) {
    removeClass(ele, name);
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

export function compareType(ele, type=false) {
  if (type ) {
    if ( isStr(type) ) {
      return ele.parentNode.tagName.toLowerCase() === type.toLowerCase();
    } else if ( isArr(type) || isObj(type) ) {
      each(type, (t) => {
        if ( compareType(ele, t) ) {
          return true;
        }
      });
    }
    return false;
  } 
}

export function findParent(ele, type=false) {
  console.log(`find parent for ele ${ele} and type ${type}`);
  if ( ! ele || ! ele.parentNode || ! type  ) {
    return false;
  }
  if ( compareType(ele.parentNode, type) ) {
    return ele.parentNode;rr
  }
  findParent(ele.parentNode, type);
}


export var rm = remove;
export var add = append;

export var dom = {}

dom.prepend = prepend;
dom.append = append;
dom.remove = remove;
dom.rm = remove;
dom.create = create;
dom.id = id;
dom.class = cssClass;
dom.class.toggle = toggleClass;
dom.class.has = hasClass;
dom.class.add = addClass;
dom.class.remove  = removeClass;
dom.class.rm  = removeClass;
dom.parent = findParent;

export default dom;
