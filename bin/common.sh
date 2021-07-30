#!/bin/bash
set -e

# This allows the script to be called as ./bin/script.sh or as ./script.sh
BASENAME=$(basename $(pwd))
if [ "$BASENAME" = "bin" ]; then
    cd ..
fi

IMAGE=$(basename $(pwd))
TAG="develop"

if [[ "$(docker images -q $IMAGE:$TAG 2> /dev/null)" == "" ]]; then
    # Docker image is not the latest version, build it
    docker build . -t $IMAGE:$TAG
fi

if [[ -z "$(docker volume ls -q | grep aws-config)" ]]; then
    # Docker volumne aws-config needs to be created
    docker volume create aws-config
fi

if [[ "$(docker ps -q --filter name=$IMAGE-$TAG 2> /dev/null)" == "" ]]; then
    docker run -d --network host --mount source=aws-config,target=/root/.aws --name $IMAGE-$TAG -v $(pwd):/src $IMAGE:$TAG /bin/sh -c "trap : TERM INT; (while true; do sleep 1000; done) & wait"
fi

docker_exec() {
    docker exec $IMAGE-$TAG /bin/sh -c "$1"

    if [[ "$(docker ps -q --filter name=$IMAGE-$TAG 2> /dev/null)" != "" ]]; then
        docker stop $IMAGE-$TAG
        docker rm $IMAGE-$TAG
    fi
}
