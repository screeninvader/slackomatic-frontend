slackomatic frontend
====

######!!! Assumes that the app root is in /home/pi/nodejs !!!
```bash
#clone git repository
git clone https://github.com/jaeh/slackomatic-frontend /home/pi/nodejs
cd /home/pi/nodejs
```

```bash
#INSTALL: used once before building for the very first time:
cd /home/pi/nodejs/
./bin/install
```

```bash
#BUILD: adds local changes to dist directory
cd /home/pi/nodejs/
./bin/build
```

```bash
#BUILD && RUN: builds local deps to dist and runs dist/slack.js
cd /home/pi/nodejs/;
npm start 
```

```bash
#RUN
#bin/run the compiled version of the app from dist without compilation
cd /home/pi/nodejs/;
bin/run
```

```bash
#UPLOAD: push to production (when slackomatic is at 10.20.30.90)
cd /home/pi/nodejs/;
bin/upload
```

```bash
#To start on boot in /etc/inittab on raspbian 
#with the source in /home/pi/nodejs:
/home/pi/nodejs/slack.js
```
