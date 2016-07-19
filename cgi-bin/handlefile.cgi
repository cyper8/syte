#!/usr/bin/gawk

BEGIN{sid=0; filename=""; writing=0; print "{\"Status\":\""}

{
    if ($1 ~ /^--+/) {
        gsub(/[-]+/,"",$1);
	id=$1;
	print "read id:"id;
        if (filename == "") {
            if (sid == 0) {
                sid=id;
		print "set sid:"sid;
            }
            else if (sid != id) {
                print "broken session";
                exit 2;
            }
        }
        else {
            close(filename);
            filename="";
            RS="/n";
        }
	next;
    };
    if (($1 ~ /^Content-[Dd]isposition:/) && (sid!=0)) {
        for (i=2; i<=NF; i++) {
            if ($i ~ /^filename/) {
		n=match($i,/"[^"]+"/)+1;
		print "filename offset: "n;
                filename=substr($i,n,length($i)-n-1);
		print "found file: "filename;
                break;
            }
        }
        if (filename == "") {
            print "no filename found";
            exit 3;
        }
	next;
    };
    if ($1 ~ /^$/) {
        if ((sid != 0) && (filename != "")) {
            if (writing == 0) {
		writing=1;
		print "lets write";
	    }
            else {
		print "empty record while writing";
                RS="";
                print $0 | filename;
            }
        }
	next;
    };
    if ((index($0,sid)==0) && (filename != "") && (writing == 1)) {
	print "writing record";
	print $0 | filename;
    }
}

END {print "OK\"}"; exit 0}
