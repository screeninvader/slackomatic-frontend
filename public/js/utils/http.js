import {showError} from './notices';

export function get(url){
  var xhr = new XMLHttpRequest()
  console.log(`http request to url: ${url}`);
  xhr.timeout = 4000;
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      //valid http error codes
      console.log('status', xhr.status);
      if ( xhr.status >= 400 && xhr.status <= 599 ) {
        showError(`API ${xhr.status} Error`);
      } else if (xhr.status === 200 ) {
        console.log(`API call returned a 200`);
      }
    }
  }
  
  xhr.ontimeout = () => { 
    console.log("Timed out!!!"); 
  }

  xhr.open( "GET", url, true );
  xhr.send( null );
}
