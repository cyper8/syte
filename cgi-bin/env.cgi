#!/bin/bash

echo "Content-type: text/html; charset=utf-8"
echo ""
cat << EOM1
<HTML>
<HEAD>
</HEAD>
<BODY bgcolor="#cccccc" text="#000000">
<P>
<SMALL>
<PRE>
EOM1
pass=$(echo ${QUERY_STRING} | egrep -o "pass=[^&]*" | sed -e 's/pass=//' -e 's/%/\\x/g')
pass=$(printf $pass)
sesid=$(echo ${QUERY_STRING} | egrep -o "sesid=[^&]*" | sed -e 's/sesid=//' -e 's/%/\\x/g')
sesid=$(printf $sesid)
echo "$pass $sesid"
gpass=$(cat /opt/etc/zahadky | awk -v n=$sesid 'BEGIN{FS=":"}{if (NR == n) print $2}')
echo $gpass
[ "$pass" == "$gpass" ] && echo "Correct" || echo "Wrong"

cat << EOM2
</PRE>
</SMALL>
<P>
</BODY>
</HTML>
EOM2
