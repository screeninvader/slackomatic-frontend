function device(device, command) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/slackomatic/devices/' + device + '/' + command, true);
	xhr.send(null);
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
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/slackomatic/rooms/lounge/' + command, true);
	xhr.send(null);
};

function slackomatic(command) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/slackomatic/functions/' + command, true);
	xhr.send(null);
};