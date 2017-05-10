#!/bin/bash

. config
. pgconfig
echo "Content-type: text/plain"
echo ""

result="{"
n=0
for i in ${tempdir}/*.jpg; do
    result="${result}\"${n}\":\"$(./addphotodemo "$i")\","
    n=$((n+1))
done
rm ${tempdir}/* 2>/dev/null
echo -n "${result%,}}"
