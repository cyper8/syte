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
env
cat << EOM2
</PRE>
</SMALL>
<P>
</BODY>
</HTML>
EOM2
