#!/bin/bash

. config
. pgconfig
echo "Content-type: text/plain"
echo ""

#ls -A ${photodir} | awk -v count=$(ls -A ${photodir} | wc -l) '{if (NR == count) {print "\""$0"\"]";} else {if (NR == 1) {print "[\""$0"\",";} else {print "\""$0"\","}}}'
echo "[$(find ${photodir} -maxdepth 1 -type d -iname "[0-2][0-9][0-9][0-9]" -printf \"%f\", | sed -e 's/,$//')]"
