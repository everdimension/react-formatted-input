#!/bin/bash

IFS='%'
git checkout master
npm run build:examples:prod
mkdir examples-temp-build
cp examples/build/* examples-temp-build
git checkout gh-pages

declare -i prefixLength=9 # `{"hash":"` part
declare -i suffixLength=2 # `"}` part`

indexTemplate=$(cat index_src.html)
stats=$(cat examples-temp-build/stats.json)

hashString=${stats:$prefixLength:(${#stats} - $prefixLength - $suffixLength)}

rm "javascripts/examples*"
cp "examples-temp-build/examples.bundle$hashString"".js" "javascripts/"
echo ${indexTemplate/\[hash\]/$hashString} > "index.html"

rm -rf examples-temp-build

unset IFS
