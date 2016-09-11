#!/bin/bash

rm -rf dist
./node_modules/.bin/webpack
./node_modules/.bin/webpack --output-filename=dist/ReactFormattedInput.min.js --optimize-minimize

rm -rf lib
./node_modules/.bin/babel src --out-dir lib
