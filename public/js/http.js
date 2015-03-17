import {css, getErrorEle} from './utils';

export function get(url){
  var xhr = new XMLHttpRequest()
  console.log(`http request to url: ${url}`);
  xhr.timeout = 4000;
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if ( xhr.status === 500 ) {
        var errorEle = getErrorEle('API Connect Error');
        css.toggleClass(document.body, 'connection-error');
        var timeOut = setTimeout(() => {
          clearTimeout(timeOut);
          css.toggleClass(document.body, 'connection-error');
          getErrorEle('');
        }, 3000);
      };
    }
  }
  
  xhr.ontimeout = () => { 
    console.log("Timed out!!!"); 
  }

  xhr.open( "GET", url, true );
  xhr.send( null );
}
