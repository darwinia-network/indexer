#!/bin/sh
#

BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)
WORK_PATH=${BIN_PATH}/../


for ITEM in $(ls ${WORK_PATH}/packages); do
  DEP_INDEX_COMMON=${WORK_PATH}/packages/${ITEM}/node_modules/@darwinia/index-common
  rm -rf ${DEP_INDEX_COMMON}
  cp -r ${WORK_PATH}/common/dist ${DEP_INDEX_COMMON}
done

cd ${WORK_PATH}/packages/$1
docker-compose up
