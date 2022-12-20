#!/bin/bash

lib=$1

for pid in $(ps aux | grep "./build.sh $lib" | grep "/bin/bash" | awk '{ print $2 }'); do
  echo "Killing $pid"
  sudo kill -9 $pid
done

run-when-changed --watch "projects/$lib/**/*.*" --exec "./build.sh $lib"