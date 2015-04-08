#!/bin/bash

set -eu

PATH=$(pwd)/node_modules/.bin/:$PATH

DIST_DIR=dist/
SRC_DIR=src/
APPCACHE_FILE=slackomatic.appcache
CONFIG_FILE=config.js
TMP_DIR=.tmp/

function clean() {
  echo 'clean dist/'
  rm -rf dist/
  mkdir -p dist/js
}

function install() {
  mkdir -p dist/

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

  echo 'installing fontello icons'
  mkdir -p ${TMP_DIR}
  fontello-cli install \
  --css ${TMP_DIR} \
  --font ${TMP_DIR} \
  --config ${SRC_DIR}fontello.json \
  ;

  mv ${TMP_DIR}slackomatic-embedded.css ${SRC_DIR}css/include/icons.styl

  mv \
    ${TMP_DIR}slackomatic.svg \
    ${TMP_DIR}slackomatic.eot \
    ${SRC_DIR}font/ \
  ;

  #~ rm -rf ${TMP_DIR}


  echo 'install app npm dependencies'
  cp package.json ${DIST_DIR}
  cd ${DIST_DIR}
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
    ${CONFIG_FILE} \
    ${SRC_DIR}favicon.ico \
    ${SRC_DIR}install-node-raspbian.sh \
    ${SRC_DIR}run.sh \
    ${DIST_DIR} \
  ;
  chmod +x ${SRC_DIR}install-node-raspbian.sh
  chmod +x ${SRC_DIR}run.sh

  echo "sed ${APPCACHE_FILE} with current timestamp for cache reload"
  CUR_DATE=$(date --utc --rfc-3339=seconds)
  echo $CUR_DATE
  sed -i -e "s/|date|/$CUR_DATE/g" ${DIST_DIR}${APPCACHE_FILE}

  echo "compile client side js"
  browserify \
    ${SRC_DIR}js/index.js \
    --outfile ${DIST_DIR}js/slackomatic.js \
    -t babelify \
    --source-maps-inline \
  ;

  #~ echo 'uglify javascript source'
  #~ uglify \
    #~ --source ${DIST_DIR}js/slackomatic.js \
    #~ --output ${DIST_DIR}js/slackomatic.js \
  #~ ;

  echo "compile css files"
  stylus \
    ${SRC_DIR}css/slackomatic.styl \
    --out ${DIST_DIR}css/slackomatic.css \
    --import node_modules/nib \
  ;

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

function run() {
  echo 'start watchify and push it to background'
  watchify \
    src/js/main.js -t babelify -o dist/js/bundle.js \
    -- 1> ./watchify.log 2> ./watchify.log &

  echo 'starting nodemon'
  nodemon \
    dist/server.js 1337 \
  ;
}

if [ $1 ]
then
  function=$1
  shift
  $function $@
fi
