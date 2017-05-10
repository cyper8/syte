import sys, cgi, os, re
from urlparse import urlparse


print ("Content-type: text/html")
print ("")
status = True
form = cgi.FieldStorage()
files = form["uploadfile"];
if not isinstance(files, list):
    files = [files]
for file in files:
    if file.filename:
        fn = re.sub(r'[\s]+'," ",os.path.basename(file.filename));
        fn = re.sub(r'[~!:#]+',"",fn);
        if not os.environ.has_key("DOCUMENT_ROOT"):
            dr = "/var/www"
        else:
            dr = os.environ["DOCUMENT_ROOT"]
        if not os.environ.has_key("HTTP_REFERER"):
            fr = "/download/"
        else:
            fr = urlparse(os.environ["HTTP_REFERER"]).path
        try:
            suffix = ""
            nsuf = 0
            while os.path.exists('{0[0]}{1}{0[1]}'.format(os.path.splitext(dr+fr+fn),suffix)):
                nsuf = nsuf + 1
                suffix = '{!s}'.format(nsuf)
            fsfilename = '{0[0]}{1}{0[1]}'.format(os.path.splitext(dr+fr+fn),suffix)
            f = open(fsfilename, "wb", 100000)
        except IOError:
            raise
            status = False
        else:
            while True:
                chunk = file.file.read(100000)
                if not chunk: break
                f.write(chunk)
            f.close()
    else:
        status = False
if status:
    if fsfilename == "/var/www/download/web-update.tar.gz":
        os.system("tar -C /var/www --keep-newer-files --overwrite --owner=www-data --group=www-data --transform=\"s/^var\/www\///\" -xzf "+fsfilename+" && rm "+fsfilename)
        sys.stdout.write("UPDATE")
        os.remove("/var/www/download/web-update.tar.gz")
    else:
        sys.stdout.write("OK")
else:
    sys.stdout.write("FAIL")
