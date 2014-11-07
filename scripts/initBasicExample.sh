#!/bin/bash

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
EXTRAS=$ROOT/extras

cd $EXTRAS/basic_example
forever start -a -m 5 -l fserver.log -o outserver.log -e errserver.log basicServer.js
#node basicServer.js &
