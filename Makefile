#!/bin/bash

node: #install node
	rm ./node_latest_armhf.deb -f
	wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	sudo dpkg -i node_latest_armhf.deb

npm: #install node deps
	npm install
	sudo npm install -g babel forever
	mkdir /home/pi/nodejs/log -p

install: node npm;

build: #run babel compiler
	npm run prepublish

run: #start the app forever
	forever start \
	-l ./log/access.log \
	-e ./log/error.log \
	-o ./log/out.log \
	--append \
	dist/app.js

list:
	forever list

stopall:
	forever stopall

dev: build run
