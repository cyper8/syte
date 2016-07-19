#!/bin/bash

. ./config

[ -n "${QUERY_STRING}" -a -f "${webhome}/${QUERY_STRING}" ] && { djpeg -maxmemory 512 -scale 1/8 "${webhome}/${QUERY_STRING}" | cjpeg -quality 30 -maxmemory 512 || { echo -n "Failed preview creation for ${webhome}/${QUERY_STRING}"; exit 1; }; } || { echo -n "Invalid request ${QUERY_STRING}"; exit 1; }
