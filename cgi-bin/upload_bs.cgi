#!/bin/bash
echo "content-type: text/plain"
echo ""
. config
ref=$(echo "${webhome}/${HTTP_REFERER#http*://*/}" | sed -e "s/\.\.//g" -e "s/[!]//g" -e "s/[$]//g" -e "s/[*]//g" -e "s/[?\\]//g")
dlhome=$([ -d "${ref}" ] && echo "${ref}" || echo "${webhome}/download")
filename=""
read filename
touch "${dlhome}/${filename}"
chmod 666 "${dlhome}/${filename}"
cat > "${dlhome}/${filename}" && echo -n "OK" || echo -n "FAIL"
