#!/bin/bash

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
ROOT=`dirname $SCRIPT`
CURRENT_DIR=`pwd`

cd $ROOT/erizoController
# node erizoController.js &
# Using forever for production
forever start -m 5 -a -l fcontroller.log -o outcontroller.log -e errcontroller.log erizoController.js


cd $CURRENT_DIR
