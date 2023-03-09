#!/bin/bash

lib=$1
final_path=$2

if [ -z "$lib" ]; then
  echo "Please provide a library name"
  exit 1
fi

if [ ! -d "projects/$lib" ]; then
  echo "Library $lib does not exist"
  exit 1
fi

if [ -z "$final_path" ]; then
  echo "You can provide a final path to copy the compiled library to with a second argument. E.g. /root/compiled-libraries"
fi

# Clean up
rm -rf demo-component/*

mkdir -p demo-component/assets

node scripts/extract-data.js $lib && \
node scripts/before.js $lib && \
ng build $lib && \
rm -rf dist/components-wrapper && \
ng run components-wrapper:build:production --main='projects/components-wrapper/src/app/compile.ts' && \
cat dist/components-wrapper/runtime.*.js dist/components-wrapper/main.*.js > dist/components-wrapper/$lib.js && \
cp dist/components-wrapper/$lib.js ./demo-component && \
cp -r src/assets/ ./demo-component/assets/ && \
node scripts/after.js $lib

if [ -n "$final_path" ]; then
  cp dist/components-wrapper/$lib.js $final_path/$lib.js
fi
