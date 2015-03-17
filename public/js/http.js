export function get(url){
    var xmlHttp = null;
    console.log(`http request to url: ${url}`);
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, true );
    xmlHttp.send( null );
    //we do not care about the return for now
}
