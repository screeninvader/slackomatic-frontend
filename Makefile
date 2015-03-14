#!/bin/bash

.PHONY: log

node: #install node
	wget -N http://node-arm.herokuapp.com/node_latest_armhf.deb
	sudo dpkg -i node_latest_armhf.deb
	rm ./node_latest_armhf.deb

npm: #install node deps
	npm install
	sudo npm install -g babel forever
	mkdir /home/pi/nodejs/log -p

install: node npm;

run: #start the app
	supervisor --harmony --extensions "js,jade,styl" \
		--exec babel-node --experimental --ignore='node_modules' -- src/slack.js
