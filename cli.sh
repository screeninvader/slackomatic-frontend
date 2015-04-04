#!/bin/bash

set -eu

PATH=$(pwd)/node_modules/.bin/:$PATH

DIST_DIR=dist/
SRC_DIR=src/
APPCACHE_FILE=slackomatic.appcache

function clean() {
  echo 'clean dist/'
  rm -rf dist/
  mkdir -p dist/js
}

function install() {
  echo 'installing npm dependencies'
  npm install
  
  echo 'install a google webfont for local use and serving'
  webfont-dl \
    https://fonts.googleapis.com/css?family=Ubuntu+Mono:400 \
    --font-out=src/font \
    --out src/css/include/font.styl \
    --css-rel=/font \
    --eot omit \
    --svg omit \
    --ttf omit \
  ;

  echo 'install app npm dependencies'
  cp package.json ${DIST_DIR}
  cd ./${DIST_DIR}
  npm install --production
  cd ../
}

function build() {
  echo "create dist, ${DIST_DIR}css, ${DIST_DIR}js, ${DIST_DIR}log"
  mkdir -p ${DIST_DIR}css ${DIST_DIR}js

  echo "copy static files to dist"
  cp -rf \
    ${SRC_DIR}img/ \
    ${SRC_DIR}${APPCACHE_FILE} \
    ${SRC_DIR}favicon.ico \
    ${SRC_DIR}install-node-raspbian.sh \
    ${SRC_DIR}run.sh \
    ${DIST_DIR} \
  ;
  chmod +x ${SRC_DIR}install-node-raspbian.sh
  chmod +x ${SRC_DIR}run.sh

  echo "sed ${APPCACHE_FILE} with current timestamp for cache reload"
  CUR_DATE=`date --utc --rfc-3339=seconds`
  echo "${CUR_DATE}"
  sed -i -e "s/|date|/${CUR_DATE}/g" ${DIST_DIR}${APPCACHE_FILE}

  echo "compile client side js"
  browserify \
    ${SRC_DIR}js/* \
    --outfile ${DIST_DIR}js/slackomatic.js \
    -t babelify \
  ;

  echo 'uglify javascript source'
  uglify \
    --source ${DIST_DIR}js/slackomatic.js \
    --output ${DIST_DIR}js/slackomatic.js \
  ;

  echo "compile css files"
  stylus \
    ${SRC_DIR}css/slackomatic.styl \
    --out ${DIST_DIR}css/slackomatic.css \
    --import node_modules/nib \
  ;

  echo "copy ${APPCACHE_FILE}"
  cp ./${SRC_DIR}${APPCACHE_FILE} ${DIST_DIR} -f
  current_timestamp=`date +%s`
  sed -i -e "s/|date|/${current_timestamp}/g" ${DIST_DIR}${APPCACHE_FILE}

  echo "compile html files"
  jade \
    ${SRC_DIR}html/home.jade \
    --out ${DIST_DIR} \
  ;

  echo "html-inline the source"
  html-inline \
    -i ${DIST_DIR}home.html \
    -o ${DIST_DIR}index.html \
    -b ${DIST_DIR} \
  ;
  
  echo 'babelify the server.js'
  babel \
    server.js \
    --out-file dist/server.js \
  ;
}

function upload() {
  echo 'create dist directory and prebuild app there'
  build;

  echo 'remove all files from the source directory'
  ssh root@10.20.30.90 'rm -rf /home/pi/nodejs/* -r'

  echo 'copy the prebuilt dist directory to the production root'
  scp -r ./dist/* root@10.20.30.90:/home/pi/nodejs/

  echo 'call killkillkill to kill the app and force respawn by inittab'
  curl http://10.20.30.90/killkillkill
  echo ''
}

if [ $1 ]
then
  function=$1
  shift
  $function $@
fi
