#!/bin/bash

lib=$1

if [ -z "$lib" ]; then
  echo "Please provide a library name"
  exit 1
fi

if [ ! -d "projects/$lib" ]; then
  echo "Library $lib does not exist"
  exit 1
fi

ng build $lib && \
rm -rf dist/components-wrapper && \
ng run components-wrapper:build:production --main='projects/components-wrapper/src/app/compile.ts' && \
cat dist/components-wrapper/runtime.*.js dist/components-wrapper/main.*.js > dist/components-wrapper/$lib.js && \
cp dist/components-wrapper/$lib.js ./demo-component && \
cp -r src/assets/ ./demo-component/assets/