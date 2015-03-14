npm:
	npm install

install: npm
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install -y nodejs && \
	sudo npm install -g babel

run: npm;
	sudo npm start #port 80 needs sudo
