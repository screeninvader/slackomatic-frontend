slackomatic frontend
====

######!!! Assumes that the app root is in /home/pi/nodejs !!!
```bash
#clone git repository
git clone https://github.com/jaeh/slackomatic-frontend /home/pi/nodejs
cd /home/pi/nodejs
```

```bash
#BUILD in dist directory
cd /home/pi/nodejs/
./bin/build
```

```bash
#BUILD and RUN
#bin/build and bin/run the app
cd /home/pi/nodejs/;
npm start 
```

```bash
#RUN
#bin/run the app, no rebuilds of static files
cd /home/pi/nodejs/;
bin/run
```


```bash
#push to production (when slackomatic is at 10.20.30.90)
cd /home/pi/nodejs/;
bin/upload
```

```bash
#To start on boot in /etc/inittab on raspbian 
#with the source in /home/pi/nodejs:
/home/pi/nodejs/slack.js
```
