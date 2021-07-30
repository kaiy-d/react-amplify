#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/common.sh

COMMAND="./node_modules/.bin/amplify $@"

docker_exec "$COMMAND"
