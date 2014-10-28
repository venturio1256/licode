#!/bin/bash

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
ROOT=`dirname $SCRIPT`
CURRENT_DIR=`pwd`

cd $ROOT/erizoAgent
#node erizoAgent.js &
# using forever monitoring for Prod
forever start -m 5 -a  -l fagent.log -o outagent.log -e erragent.log erizoAgent.js


cd $CURRENT_DIR
