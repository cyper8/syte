#!/bin/bash

. config
. pgconfig
echo "Content-type: image/jpeg"
echo "Cache-control: max-age=0, must-revalidate"
echo ""

djpeg -scale 1/2 ${photodir}/$(find ${photodir} -type f -iname "*.json" -exec cat {} \; -exec echo "" \; | sort -R | tail -n 1 | grep -Eio "[0-9]+\.jp[e]?g" | sed "s/\(^[0-9]...\)/\1\/\1/") | cjpeg -quality 50
