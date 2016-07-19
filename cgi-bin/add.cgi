#!/bin/bash

. config
. pgconfig
echo "Content-type: text/plain"
echo ""

result="{"
n=0
for i in ${tempdir}/*.jpg; do
    result="${result}\"${n}\":\"$(${webhome}/cgi-bin/addphoto "$i")\","
    n=$((n+1))
done
rm ${tempdir}/* 2>/dev/null
echo -n "${result%,}}"
