#!/bin/bash

. config

TRINFO="${webhome}/jslibs/trinfo.js";
TR_DB="$(grep "var downdir" ${TRINFO} | sed 's/^var downdir="\(.*\)";$/\1/')/.wmdb.json";

fid="${QUERY_STRING:-$1}"
[ -z "$fid" ] && { echo "FAIL"; exit 1; } || f="..$(cat ${TR_DB} | grep -E "^\"${fid#\?}\"" | gawk 'BEGIN{FS=":"}{print$2}' | sed "s/^\"\(.*\)\",/\1/")"
[ -f "$f" ] && { rm "$f" && echo "OK"; } || echo "FAIL"
