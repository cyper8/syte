#!/bin/bash
cat << EOM1
<html>
<head>
<meta content-type="text/html; encoding: utf-8">
</head>
<body>
<p>Filtering table:</p>
EOM1
iptables -t filter -L FORWARD -n | awk '{if (($1 == "DROP") && ($2 == "tcp") && ($4 ~ /^192.168.1/)) print "<p>"$4" - "NR-2"</p>"}'
echo "your ip: $REMOTE_ADDR"
cat << EOM2
</body>
</html>
EOM2
