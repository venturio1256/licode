#!/bin/bash

SCRIPT=`pwd`/$0
ROOT=`dirname $SCRIPT`
CURRENT_DIR=`pwd`

cd $ROOT/nuveAPI

# node nuve.js &
# Using forever for production
forever start -m 5 -a -l fnuve.log -o outnuve.log -e errnuve.log nuve.js


cd $CURRENT_DIR
