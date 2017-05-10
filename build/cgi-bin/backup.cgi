#!/bin/bash
. config
echo 'Content-Disposition: attachment; filename="web-backup.tar.gz"'
echo "Content-type: application/octet-stream"
echo ""
find ${webhome} -type f -and \( -iwholename "${webhome}/jslibs/*.js" -or -iwholename "${webhome}/styles/*" -or -iwholename "${webhome}/cgi-bin/*" -or -iname "HEADER.txt" \) -and -not -iname "*~" -and -not -iname "_*" -exec tar cz '{}' \+
