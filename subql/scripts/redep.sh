#!/bin/sh
#

BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)
WORK_PATH=${BIN_PATH}/../


PACKAGE=$1

DEP_INDEX_COMMON=${WORK_PATH}/packages/${PACKAGE}/node_modules/@darwinia/index-common
rm -rf ${DEP_INDEX_COMMON}
cp -r ${WORK_PATH}/common/dist ${DEP_INDEX_COMMON}
