var downdir="/media/torrents";
function trinfo(root){ // CSS classes to be defined: trinfo - holder, triline - line, progress classes;
    if ((!document.networking) && (!progress)) {
        throw new Error("trInfo: no document.networking and progress classes defined");
        return false;
    }
	var ids = [];
    var d = new selector(".trinfo#trinfo");
    d.multiple = true;
    d.progressstyles = ["#BDC3C7","#E74C3C","#C0392B","#F1C40F","#F39C12","#2ECC71","#27AE60"];
    d.active = false;
    d.trinfodata = null;
    d.connattempts = 5;
    d.allReqParams = new Object();
    d.button = document.body.topbar.trinfo;
    d.appendChild(d.bSwitch = (function(){
        var b = ToggleButton("state","Stop All");
        b.switch = function(on){
            if (d.button.classList.contains("transmitting") != on) {
                if (on) {
                    d.start();
                    b.value = "Stop All";
                }
                else {
                    d.stop();
                    b.value = "Start All";
                }
            }
        }
        return b;
    })());
    d.appendChild(d.bAddFiles = (function(){
        var b = new PushButton("addFiles","+");
        b.action = function(){
            b.iFile.click();
        };
        b.ready = function(){
            b.enable();
            b.classList.remove("sending");
        };
        b.inactive = function(){
            b.disable();
        };
        b.occupied = function(){
            b.classList.add("sending");
            if (b.iFile.fQueue.length>0) d.addtorrent(b.iFile.fQueue.pop());
        };
        b.appendChild(b.iFile = (function(){
            var eFile = element("input.invisible#addtorrents");
            eFile.type = "file";
            eFile.multiple = true;
            eFile.required = true;
            eFile.fQueue = new Array();
            eFile.fQueue.Push = function(o){
                this.push(o);
                b.setAttribute("filecount",this.length);
            };
            eFile.fQueue.Pop = function(){
                b.setAttribute("filecount",this.length-1);
                return this.pop();
            };                
            eFile.onchange = function(){
                this.parentNode.disable();
                for (var fi = 0; fi<this.files.length; fi++){
                    document.reader.add(this.files[fi],function(e){
                        b.iFile.fQueue.Push(ABtoB64(e));
                        if (b.iFile.fQueue.length == b.iFile.files.length) b.occupied();
                    });
                }
            };
            eFile.reset = function(){
                this.fQueue = [];
                this.parentNode.ready();
            };
            return eFile;
        })());
        b.ready();
        return b;
    })());
    d.bRemove = function(ids){
        var b = new PushButton("remove","-");
        b.ids = ids;
        b.action = function(){
            d.removetorrent([this.ids]);
        };
        return b;
    };
    d.dFilelist = function(files){
        var flt = new ToggleButton("filelist","");
        flt.addEventListener("click",function(e){e.stopPropagation()});
        flt.switch = function(on){
            if (on) {
				for (i in flt.list.items) {
					var fli = flt.list.items[i];
                    if (!fli.player){
                        document.networking.endpointTestStatus(downdir+".webm/"+fli.filename+".webm",(function(stat){
                            if (stat == 200) {
                                this.appendChild(this.player = new d.Player(downdir+".webm/"+this.filename+".webm"));
                            }
                        }).bind(fli));
                    }
				}
            }
        }
        var df = new selector(".filelist#filelist");                                                                 //  .filelist#filelist : hide if inside .triline["downloaded"="true"]
        df.index = [];
        for (f in files) {
            var dfi = df.append(new element("div.downloadedfile"));
			dfi.sticky = true;
			dfi.disable();
			df.index.push(dfi.filename = files[f].name);
            dfi.switch = function(on){
				if (on) location.href = downdir+"/"+this.filename;
			}
            dfi.innerText = dfi.filename+" ["+(files[f].length/1048576).toPrecision(5)+" MB]";
        }
        df.updateFilelist = function(fl){
            for (i in fl) {
				var fli = this.items[this.index.indexOf(fl[i].name)];  
                if (fl[i].bytesCompleted < fl[i].length) {
					fli.disable();
					if (fli.player) fli.removeChild(fli.player);
					fli.player = false;
				}
                else {
					fli.enable();
/*					if (d.webm) {
						if (d.webm[fl[i].name]) {
							if (!fli.player) fli.appendChild(fli.player = new d.Player(d.webm[fl[i].name]));
						}
					}	*/
				}
            }
        };
        df.addEventListener("mouseout",function(e){
            if (!this.contains(e.relatedTarget || e.toElement))
                flt.toggle(false);
        });
        flt.appendChild(flt.list=df);
        flt.updateFilelist = df.updateFilelist.bind(df);
        return flt;
    };
    d.Player = function(vpath){
        var dv = PushButton("player","Play");                                                                     //  .player#player
        dv.path = vpath;
        dv.addEventListener("click",function(e){e.stopPropagation()});
        dv.action = function(){
                window.SUSPENDED = true;
                var panel = new element("div.toolbar#player");
                panel.suicide = function(){
					window.SUSPENDED = false;
					this.parentNode.removeChild(this);
                };
                panel.addEventListener("click",panel.suicide);
                document.body.appendChild(panel);
                var vp = new element("video#vplayer");                                                          //  video#player
                vp.addEventListener("click",function(e){e.stopPropagation()});
                /*vp.addEventListener("loadeddata",function(e){ // try loadmetadata instead
                    if (this.audioTracks.length > 1) {
                        this.lang = new selector("#vlang")                                                      //  #vlang
                        this.appendChild(this.lang);
                        for (c in this.audioTracks) {
                            var track = this.lang.append(new element("div.ac")).innerText = this.audioTracks[c].language.substring(0,2);        //  div.ac
                            track.switch = function(on){
                                if (on) {
                                    this.enabled = true;
                                }
                                else this.enabled = false;
                            }.bind(this.audioTracks[c]);
                        }
                    }
                }.bind(vp));*/
                panel.appendChild(vp);
                vp.setAttribute("controls",true);
                vp.setAttribute("preload","metadata");
                vp.src = dv.path;
        };
        return dv;
    }
    d.infoLine = function(info){
        var di = new section(".triline#id"+info.id.toString());
        di.torrent = info;
        di.innerText = info.name;
        di.append(di.progress = new progress());
        di.progress.show(100);
        di.append(new selector("#linecontrol"));
        di.linecontrol.append(new d.bRemove(di.torrent.id)); //linecontrol.remove
        di.linecontrol.append(di.filelist = new d.dFilelist(di.torrent.files)); //linecontrol.filelist
        di.updateLine = function(infoobj){
            if (infoobj.isFinished || (infoobj.status > 4)) {
                this.setAttribute("downloaded",true);
                //this.filelist.updateDownloadedFiles(infoobj.files);
            }
            else this.setAttribute("downloaded",false);
            if (infoobj.status == 0) this.setAttribute("stopped",true);
            else this.setAttribute("stopped",false);
            di.progress.bar.style.backgroundColor = d.progressstyles[infoobj.status];
            di.progress.style.backgroundColor = d.progressstyles[infoobj.status-1];
            di.linecontrol.filelist.updateFilelist(infoobj.files);

            return di.progress.setState((infoobj.status>4) ? (Math.ceil((infoobj.uploadRatio/infoobj.seedRatioLimit)*100)) : (Math.ceil(infoobj.percentDone*100)));
        };
        di.switch = function(state){
            if ((this.getAttribute("stopped") == "false") !== state){
                if (state){
                    d.start([this.torrent.id]);
                }
                else {
                    d.stop([this.torrent.id]);
                }
            }
        };
        di.updateLine(info);
        return di;
    };
    d.rebuildInfo = function(infos){
        d.trinfodata = infos;
        ids = [];
        var active = 0;
        this._selected = [];
        var item;
        for (var i=0;i<infos.length;i++){
            if (infos[i].status > 0) active++;
            if (typeof d["id"+infos[i].id.toString()] === "undefined"){
                item = d.insert(new d.infoLine(infos[i]),((typeof infos[i+1] === "object") ? (d["id"+infos[i+1].id.toString()] || null) : (null)));
            }
            else {
                (item = d["id"+infos[i].id.toString()]).updateLine(infos[i]);
            }
            ids.push(infos[i].id.toString());
            if (infos[i].isFinished){
                item.disable();
            }
            else{
                item.enable();
                item.toggle((item.getAttribute("stopped") == "false"));
            }
        }
        for (var l=0;l<d.items.length; ) {
            if (ids.indexOf(d.items[l].torrent.id.toString()) == -1) {
                d.remove(d.items[l]);
            }
            else l++;
        }
        if (active > 0) {
            d.button.classList.add("transmitting");
            d.bSwitch.setAttribute("value","Stop All");
        }
        else {
            d.button.classList.remove("transmitting");
            d.bSwitch.setAttribute("value","Start All");
        }
    };
    
    d.upgradeInfo = function(xhr){
        if (xhr.status == 409) {
            d.request.headers["X-Transmission-Session-Id"]=xhr.getResponseHeader("X-Transmission-Session-Id");
            xhr.request.headers = d.request.headers;
            d.connattempts--;
            if (d.connattempts == 0) {
                document.timer.remove(d.timer);
                throw new Error("trInfo: connection attempts number exceeded");
            }
            xhr.executesession();
        }
        else if (xhr.status == 200){
            d.connattempts = 5;
            if (xhr.response != null) {
                try {
                    var resp = JSON.parse(xhr.response);
                    switch (resp.tag) {
                        case 32100: //request torrent statistics
                            d.rebuildInfo(resp.arguments.torrents);
                            break;
                        case 32101: //stop all
                            if (resp.result != "success") {
                                alert("Failed to stop.");
                            }
                            else d.updateInfo();
                            break;
                        case 32102:
                            if (resp.result != "success") {
                                alert("Failed to resume downloading");
                            }
                            else d.updateInfo();
                            break;
                        case 32103: //torrentadd
                            if (d.bAddFiles.iFile.fQueue.length>0) {
                                d.addtorrent(d.bAddFiles.iFile.fQueue.Pop());
                            }
                            else {
                                d.bAddFiles.iFile.reset();
                                d.updateInfo();
                            }
                            break;
                        case 32104:
                            if (resp.result != "success") {
                                alert("Failed to remove torrents.");
                            }
                            break;
                    }
                }
                catch (err) {
                    console.log("While handling a "+xhr.responseText+" from "+xhr.request.url+" an error captured: "+err);
                }
            }
        }
        else {
            d.connattempts--;
            if (d.connattempts == 0) {
                document.timer.remove(d.timer);
                throw new Error("trInfo: connection attempts number exceeded");
            }
        }
    };

    d.updateInfo = function(){ // new request
        if (SUSPENDED) return false;
        var r = d.request;
        r.params = JSON.stringify(d.allReqParams["32100"]);
        document.networking.request({
                    method: "GET",
                    url: downdir+"/.wmdb.json",
                    resulthandler: function(xhr){
                        if (xhr.status == 200) {
                            //try {
                                d.webm = window.JSON.parse("{"+xhr.response+"\"0\":\"\"}");
                                    
				//}
                            //catch (err) {
                            //    console.log(err);
                            //}
                        }
                        else console.log("no wmdb");
                    }
                });
        document.networking.request(r);
    };

    d.allReqParams["32100"] = {arguments: {fields: ["id","name","files","percentDone","status","isFinished","seedRatioLimit","uploadRatio"]},method: "torrent-get",tag:32100};
    d.allReqParams["32101"] = {arguments: {ids:[]},method:"torrent-stop",tag:32101};
    d.allReqParams["32102"] = {arguments: {ids:[]},method:"torrent-start",tag:32102};
    d.allReqParams["32103"] = {arguments: {},method:"torrent-add",tag:32103};
    d.allReqParams["32104"] = {arguments: {ids:[],"delete-local-data":true},method:"torrent-remove",tag:32104}
    d.request = {
        method: "POST",
        url: (typeof transmissionrpc === "string") ? transmissionrpc : "/transmission/rpc",
        params:"",
        resulthandler: d.upgradeInfo,
        progreshandler: false,
        headers: {}
    };

    d.show = function(){
        if (d.timer != null) document.timer.remove(d.timer);
        d.style.maxHeight = "100vh";
        d.timer = document.timer.add(d.updateInfo,[d],2000,-1);
    };

    d.hide = function(){
        if (d.timer != null) document.timer.remove(d.timer);
        d.timer = document.timer.add(d.updateInfo,[d],10000,-1);
    };

    d.start = function(ts){
        if (d.trinfodata == null) return false;
        var r = d.request;
        var p = d.allReqParams["32102"];
        if (ts) var ids = ts;
		else {
            var ids=[];
            for (var i = 0; i<d.trinfodata.length; i++){
                if (!d.trinfodata[i].isFinished) {
                    ids.push(d.trinfodata[i].id);
                }
            }
        }
        p.arguments.ids = ids;
        r.params = JSON.stringify(p);
        document.networking.request(r);
    };

    d.stop = function(ts){
        var r = d.request;
        var p = d.allReqParams["32101"];
        if (ts) p.arguments.ids = ts;
        else p.arguments={};
        r.params = JSON.stringify(p);
        document.networking.request(r);
    };
    
    d.removetorrent = function(ts){
        var r = d.request;
        var p = d.allReqParams["32104"];
        if (ts) p.arguments.ids = ts;
        else p.arguments={};
        r.params = JSON.stringify(p);
        document.networking.request(r);
		var files = d.trinfodata[ids.indexOf(ts.toString())].files; 
		for (i in files) {
			document.networking.request({method:"GET",url:"/cgi-bin/trmv.cgi?"+files[i].name,resulthandler:function(){}});
		}
    };
    
    d.addtorrent = function(file){
        if (file == null) return false;
        var r = d.request;
        var p = d.allReqParams["32103"];
        if (file.search(/^http.*\.torrent$/) == -1)
            p.arguments.metainfo = file;
        else p.arguments.filename = file;
        r.params = JSON.stringify(p);
        document.networking.request(r);
    };

    d.addEventListener("click", function(e){
        e.stopPropagation();
    });
    d.timer = document.timer.add(d.updateInfo,[d],10000,-1);
    if (typeof root === 'object'){
        if (root.insert) root.insert(root.trinfobar = d,null);
        else root.appendChild(root.trinfobar = d);
        if (root.parentNode.classList.contains("selector")) {
            d.classList.add("toolbar");
            d.style.top = (root.parentNode.clientHeight).toString()+"px";
            root.switch = function(state){
                if (state) root.trinfobar.show();
                else root.trinfobar.hide();            
            };
        }
        else {
            root.trinfobar.show();
        }
        root.classList.remove("hidden");
    }
    Scrollable(d);
    d.updateInfo();
    return d;
}
