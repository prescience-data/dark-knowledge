#!/usr/bin/env bash

set -e # die on errors

docker-compose down
docker-compose pull
docker-compose up --build
docker cp dark-knowledge:/pdf/html ../
docker cp dark-knowledge:/pdf/README.md ../
docker-compose down
