install:
	sudo su && \
	add-apt-repository ppa:chris-lea/node.js -y && \
	apt-get update && \
	apt-get install -y nodejs && \
	npm install -g babel

build:
	npm run prepublish

run: build
	npm start
