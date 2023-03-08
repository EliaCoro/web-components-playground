#!/bin/bash

lib=$1
folder=$2


run-when-changed --watch "projects/$lib/**/*.*" --exec "./watch-build.sh $lib $folder"