#!/bin/bash
#

set -e

BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)

docker compose -f ${BIN_PATH}/docker-compose.yml up


