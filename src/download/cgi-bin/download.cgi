#!/bin/bash
echo "content-type: text/html"
echo ""
. config
dlhome="${webhome}/download"
file=$(grep -E -o "^down=[a-zA-F0-9%.]+$" | sed -e "s/down=//" -e "s/\r//g" -e "s/%/\\\x/g")
wget -P "${dlhome}" $(printf "$file") &
echo -e "<html><body onload=\"javascript: history.back();\"></body><pre></pre></html>"
