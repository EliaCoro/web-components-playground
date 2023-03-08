#!/bin/bash

lib=$1
final_path=$2

if [ -z "$lib" ]; then
  echo "Please provide a library name"
  exit 1
fi

if [ -z "$final_path" ]; then
  echo "Please provide where the compiled library should be copied to"
  exit 1
fi

if [ ! -d "projects/$lib" ]; then
  echo "Library $lib does not exist"
  exit 1
fi

# Clean up
rm -rf demo-component/*

mkdir -p demo-component/assets

ng build $lib && \
rm -rf dist/components-wrapper && \
ng run components-wrapper:build:production --main='projects/components-wrapper/src/app/compile.ts' && \
cat dist/components-wrapper/runtime.*.js dist/components-wrapper/main.*.js > dist/components-wrapper/$lib.js && \
cp dist/components-wrapper/$lib.js ./demo-component && \
cp -r src/assets/ ./demo-component/assets/

if [ -n "$final_path" ]; then
  cp dist/components-wrapper/$lib.js $final_path/$lib.js
fi
