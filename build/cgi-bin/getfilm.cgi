#!/bin/bash
id=$(echo $QUERY_STRING | grep -E -o "[0-9][0-9][0-9][0-9]")
[ -z `find . -name kino.index -mtime -1 2>/dev/null` ] && wget -q "http://tracker.brovis.net/torrents?C=M;O=A" -O - | grep -o -E "\"[^\"]+\.torrent\"" | sed -e "s/^\"/http\:\/\/tracker\.brovis\.net\/torrents\//" -e "s/\"//g" > kino.index
echo -e -n "Content-type: plain/text\n\n"$(cat kino.index | grep "_${id}.torrent")
