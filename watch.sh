#!/bin/bash

lib=$1
folder=$2

if [ -z "$lib" ]; then
  echo "Please provide a library name"
  exit 1
fi

if [ ! -d "projects/$lib" ]; then
  echo "Library $lib does not exist"
  exit 1
fi

./watch-build.sh $lib $folder

run-when-changed --watch "projects/$lib/**/*.*" --exec "./watch-build.sh $lib $folder"