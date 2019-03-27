#!/bin/bash

node js/main.js -c ./config.yml
npx http-server public -p 8000 -c-1 --cors & pid=$!
open 'https://vivliostyle.github.io/vivliostyle.js/viewer/vivliostyle-viewer.html#x=http://localhost:8000/'
wait $pid
