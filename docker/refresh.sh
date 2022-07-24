#!/usr/bin/env bash

set -e # die on errors

docker-compose rm -f
docker-compose pull
docker-compose up --build
docker cp dark-knowledge:/pdf/html ../
docker-compose down
