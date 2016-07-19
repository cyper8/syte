#!/bin/bash

. config
. pgconfig
echo "Content-type: text/plain"
echo ""

n=$(ls -A ${tempdir}/ | wc -l);
while [ -f "${tempdir}/tmp_${n}.jpg" ]; do n=$((n+1)); done
cat <&0 >${tempdir}/tmp_${n}.jpg && { echo -n OK; exit 0; } || { echo -n FAIL; exit 1; }

