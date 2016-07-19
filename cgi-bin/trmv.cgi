#!/bin/bash

fid="${QUERY_STRING:-$1}"
[ -z "$fid" ] && { echo "FAIL"; exit 1; } || f="..$(cat ../media/torrents/.wmdb.json | grep -E "^\"${fid#\?}\"" | gawk 'BEGIN{FS=":"}{print$2}' | sed "s/^\"\(.*\)\",/\1/")"
[ -f "$f" ] && { rm "$f" && echo "OK"; } || echo "FAIL"
