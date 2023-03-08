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

for pid in $(ps aux | grep "./build.sh $lib" | grep "/bin/bash" | awk '{ print $2 }'); do
  echo "Killing $pid"
  sudo kill -9 $pid
done

./build.sh $lib $folder