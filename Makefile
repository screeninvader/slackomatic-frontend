install:
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install -y nodejs && \
	sudo npm install -g babel

build:
	npm install
	npm run prepublish

run: build
	npm start
