/* global Basic */

const module = {
  name: "SampleModule",
  type: "module",
  style: "styles/samplemodule.css",
  content: "",
  action: "samplemodule.js"
};

const config = {
  greeting: "Hello",
  name: "world"
};

export default (function(module_function){
  if (!Basic) throw new Error(`${module.name}: no framework`);
  window.Basic.System.ModuleStack.modules[module.name].entry = function(module_root){
    var module_tree = module_function(module_root);
    if (typeof module_root === 'object'){
      if (module_root.insert) {
        module_root.insert(module_root[module.name] = module_tree,null);
      }
      else {
        module_root.appendChild(module_root[module.name] = module_tree);
      }
      
      /* optional container tweaking begin */
      
      if (module_root.parentNode.classList.contains("selector")) {
        module_tree.classList.add("toolbar");
        module_tree.style.top = (module_root.parentNode.clientHeight).toString()+"px";
        module_root.switch = function(state){
          if (state) module_root[module.name].show();
          else module_root[module.name].hide();
        };
      }
      else {
        module_root.trinfobar.show();
      }
      
      /* end */
      
      module_root.classList.remove("hidden");
      
      // something to be done after actual DOM mounting goes here
      
      
      
      // END
    }
  };
  
  return window.Basic.System.ModuleStack.modules[module.name];
})(function(root){
  // module tree generation and logic code
  
  var modtree = Basic.UI.section(".downloadbar#downloadbar");
  
  modtree.append(Basic.UI.element("form.uploadfile#uploadform"));
  modtree.uploadform = 
  modtree.innerHTML = "<form name=postfile class='uploadfile' action='/cgi-bin/upload.py' method=POST enctype='multipart/form-data'>\
                    <input type='file' id='fileInput' name=uploadfile multiple='multiple' size='50' onchange='GetFileInfo();'>\
                    <label for='fileInput' id='fIlabel' class='button' disabled=false value='Select files'></label>\
                    <div id='ubutton' class='button' value=Upload disabled=true onclick=\"javascript: if (FORMINVALID == 0) Upload(document.getElementById('fileInput').files);\"></div>\
                    <div id='info' class='info'></div>\
                    </form><hr><form name=download class='uploadfile' action='/cgi-bin/download.cgi' method=POST>\
                    <input type=text id=d name=down>\
                    <div class='button' disabled=false onclick='javascript: CheckString();' value='Start'></div></form>";
  
  var FORMINVALID = 1;

  window.GetFileInfo=function () {
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
    info.append(Basic.UI.progress(".lowbar#uploadprogress"));
}

window.CheckString=function(){
    var s=document.getElementById('d');
    if (s.value != "") {
    	s.value=s.value.replace(/^http[s]?:\/\//,'');
    	document.download.submit();
    }
}

function Upload(files){
  function resphdlr(uploadresponse){
    if (uploadresponse.responseText) {
      if (uploadresponse.responseText == "UPDATE") {
        //document.getElementById(uploadresponse.request.filename).setState(100);
        alert("WebRoot updated");
      }
      else if (uploadresponse.responseText == "OK") {
        //document.getElementById(uploadresponse.request.filename).setState(100);
      }
      //else document.getElementById(uploadresponse.request.filename).setState(-1);
      document.getElementById("fileInput").files.uploaded++;
      if (document.getElementById("fileInput").files.uploaded == document.getElementById("fileInput").files.length)
        window.location.reload();
    }
  }
  var fd = new FormData();
	  
	for (var i=0; i<files.length; i++){
	  fd.append(files[i].name,files[i])
	}
	Basic.App.Network.request({
	  method: "POST",
		url: "/cgi-bin/upload.py",
		params: fd,
		resulthandler: resphdlr
	})
}
  
  modtree.addEventListener("click", function(e){
      e.stopPropagation();
  });

  
  return modtree;
})