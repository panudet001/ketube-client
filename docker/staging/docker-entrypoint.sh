#!/bin/sh

# SSH service
set -e
service ssh start

# App command
cd $APP_HOME_PUBLISH && node server/index.mjs