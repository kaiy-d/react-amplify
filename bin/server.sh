#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $DIR/common.sh

COMMAND="yarn server $@"

docker_exec "$COMMAND"
