var rootUrl = '/slackomatic/'

function request(url) {
  var xhr = new XMLHttpRequest()
  console.log('getting url');
  xhr.open('GET', url, true);
  xhr.send(null);
}

function device(device, command) {
  var url = rootUrl + 'devices/' + device + '/' + command;
  request(url);
};

function benq(command) {
	device('benq', command);
};

function yamaha(command) {
	device('yamaha', command);
};

function nec(command) {
	device('nec', command);
};

function lounge(command) {
	var url = rootUrl + 'rooms/lounge/' + command;
  request(url);
};

function slackomatic(command) {
	var url = rootUrl + 'functions/' + command;
  request(url);
};
