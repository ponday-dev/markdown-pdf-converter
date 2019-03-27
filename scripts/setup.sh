#!/bin/bash

curl -LO https://github.com/vivliostyle/vivliostyle.js/releases/download/$1/vivliostyle-js-$1.zip

if [ -d viewer ]; then
    rm -rf viewer
fi

unzip vivliostyle-js-$1.zip
mv vivliostyle-js-$1 viewer
mkdir viewer/book
rm vivliostyle-js-$1.zip
