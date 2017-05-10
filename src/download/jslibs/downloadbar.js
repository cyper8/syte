/*downloadbar.js
mod name - downloadbar*/

var FORMINVALID = 1;

function GetFileInfo () {
    FORMINVALID = 0;
    var fileInput = document.getElementById ("fileInput");
    var message = "";
    if ('files' in fileInput) {
        if (fileInput.files.length == 0) {
            message = "Please browse for one or more files.";
            FORMINVALID = 1;
        }
        else {
            message += "files: "+(fileInput.files.length).toString()+"<br>";
            var size = 0;
            for (var i = 0; i < fileInput.files.length; i++) {
                var file = fileInput.files[i];
                if ('name' in file) var x = file.name;
                else var x = file.fileName;
                var color = (x.search(/(exe|msi|!)/i) > 0) ? "badfile" : "goodfile";
                if (color == "badfile") FORMINVALID = 1;
                message += "<div class='fstatus' id='"+x+"'>"+(i+1).toString() + ". <span class="+color+">" + x + "</span> ";
                if ('size' in file) var x = file.size;
                else var x = file.fileSize;
    			    message += Math.round(x/1024) + " kbytes</div> <br />";
                size += Math.round(x/1024);
            }
            if (size>102400) FORMINVALID = 1;
            message += "Total size: <span class=" + ((size>102400) ? "badfile" : "goodfile") + ">" + size.toString()+" kbytes</span>";
        }
    }
    else {
        if (fileInput.value == "") {
            message += "Please browse for one or more files.";
            message += "<br />Use the Control or Shift key for multiple selection.";
            FORMINVALID = 1;
        }
        else {
            message += "Your browser doesn't support multiple files selection.";
            if (fileInput.value.search(/(exe|msi|!)/i) > 0) {
                FORMINVALID = 1;
                message += "<br />The path of the selected file: <span class=badfile>" + fileInput.value + "</span>";
                message += "<br>You cannot upload EXE, MSI, nor the filename must contain exclamation sign (!).";
            }
            else{
                message += "<br />The path of the selected file: <span class=goodfile>" + fileInput.value + "</span>";
            }
        }
    }
    if (FORMINVALID == 0) {
        document.getElementById('fIlabel').setAttribute("for","");
        document.getElementById('ubutton').setAttribute("disabled","false");
    }
    fileInput.files.uploaded = 0;
    var info = document.getElementById ("info");
    info.innerHTML = message;
    for (var i=0; i<fileInput.files.length; i++){
        var sm=document.getElementById(fileInput.files[i].name);
        sm.unit = sm.scrollWidth / 100;
        sm.setState = function(v){
            if (v>0) {
                this.style.width = (Math.ceil(this.unit*v)).toString()+"px";
            }
            else {
                this.style.width = this.scrollWidth;
                this.style.backgroundColor = 'red';
            }
        };
    }
}

function CheckString(){
    var s=document.getElementById('d');
    if (s.value != "") {
    	s.value=s.value.replace(/^http[s]?:\/\//,'');
    	document.download.submit();
    }
}

function Uploader() {
	this.network = document.networking || new NetStack();
	this.addTask = function(fn,fd,rh,ph,h){ //filename,filedata,resulthandler,progresshandler,headers
		var d = new FormData();
		d.append("uploadfile", fd);
		this.network.request({
			method: "POST",
			url: "/cgi-bin/upload.py",
			params: d,
			resulthandler: rh,
			progresshandler: ph,
			headers: h,
			filename: fn
		});
	};
}
document.uploader = new Uploader();

function Upload(files){
	for (var i=0; i<files.length; i++){
			document.uploader.addTask(files[i].name,files[i],function(uploadresponse){
        		if (uploadresponse.responseText) {
        			if (uploadresponse.responseText == "UPDATE") {
        				document.getElementById(uploadresponse.request.filename).setState(100);
        				alert("WebRoot updated");
        			}
        			else if (uploadresponse.responseText == "OK") {
						document.getElementById(uploadresponse.request.filename).setState(100);
        			}
        			else document.getElementById(uploadresponse.request.filename).setState(-1);
        			document.getElementById("fileInput").files.uploaded++;
        			if (document.getElementById("fileInput").files.uploaded == document.getElementById("fileInput").files.length)
        				location.reload();
        		}
        	},function(s){
        		document.getElementById(this.filename).setState(s)
            });
	}
}

function downloadbar(root){
    if (!BASIC) return null;
    var db = section(".downloadbar#downloadbar");
    db.innerHTML = "<form name=postfile class='uploadfile' action='/cgi-bin/upload.py' method=POST enctype='multipart/form-data'>\
                    <input type='file' id='fileInput' name=uploadfile multiple='multiple' size='50' onchange='GetFileInfo();'>\
                    <label for='fileInput' id='fIlabel' class='button' disabled=false value='Select files'></label>\
                    <div id='ubutton' class='button' value=Upload disabled=true onclick=\"javascript: if (FORMINVALID == 0) Upload(document.getElementById('fileInput').files);\"></div>\
                    <div id='info' class='info'></div>\
                    </form><hr><form name=download class='uploadfile' action='/cgi-bin/download.cgi' method=POST>\
                    <input type=text id=d name=down>\
                    <div class='button' disabled=false onclick='javascript: CheckString();' value='Start'></div></form>";
    db.addEventListener("click", function(e){
        e.stopPropagation();
    });
    if (typeof root === 'object'){
        if (root.insert) root.insert(root.downloadbar = db,null);
        else root.appendChild(root.downloadbar = db);
        if (root.parentNode.classList.contains("selector")) {
            db.classList.add("toolbar");
            db.style.top = (root.parentNode.clientHeight).toString()+"px";
        }
        root.classList.remove("hidden");
    }
    return db;
};


