FROM alpine:latest
MAINTAINER Yani Iliev <yani@servmask.com>

RUN apk update && \
    apk add nodejs-current yarn

ADD . /src

WORKDIR /src
