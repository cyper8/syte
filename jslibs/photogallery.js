addStyleSheet("/styles/photogallery.css");

const itemSizeC = 3;
const photoroot = "/media/images/photogallery/resources/photo/";
const galleryroot = (typeof photogalleryprefix === "string") ? photogalleryprefix : "/photogallery/";
var colors = ["#e28989","#e289cc","#bc89e2","#899ae2","#89d2e2","#89e294","#f1f053","#f1bf54"];
var colors2 = ["Aqua","Blue","Fuchsia","Gray","Green","Lime","Maroon","Navy","Olive","Purple","Red","Silver","Teal","White","Yellow"];
var Photos = new Array();
var YEARS;
var URL = window.URL || window.webkitURL;
var body = document.body;
var gallery,folder,toolbar,sizeselector,pselector,yselector,mselector,addselector = null;
var itemQuantity = 20;

////////////////////// OBJECTS DEFINITIONS /////////////////////////////////////

//////////////////////////////MAIN OBJECT/////////////////////////////////////
//function Photogallery();
function photogallery(root){
    gallery = new section(".photogallery#photogallery");
    if (typeof root === "object") root.appendChild(root.photogallery=gallery);
    gallery.setAttribute("loaded",false);
    gallery.item = null;
    gallery.appendElement(toolbar = new Toolbar());
    gallery.appendElement(new NextButton());
    gallery.appendElement(new PrevButton());
    gallery.appendElement(new DownloadLabel());
    gallery.appendElement(folder = new Folder());
    gallery.srcLoad = function(xhr) {
        if (gallery.item) {
            var o = URL.createObjectURL(xhr.response);
            gallery.dlabel.innerHTML = "<a href='"+o+"'>Посилання на файл для збереження</a>";
            gallery.setAttribute("loaded",true);
			gallery.style.backgroundImage = 'url('+o+')';
            toolbar.progress.hide();
        }
    };
    gallery.show = function(i) {
        if (this.item != i) {
            this.item = i;
            toolbar.progress.show(100);
            document.downloader.addTask(photoroot+this.item.srcobj.year+"/"+this.item.srcobj.path,this.srcLoad,toolbar.progress);
        }
    };
    gallery.hide = function() {
        this.setAttribute("loaded",false);
        folder.selected = null;
        this.item = null;
        gallery.style.backgroundImage = "none";
        folder.scrollLeft = 0;
    };
    
    gallery.addEventListener("click", function() {
        this.hide();
    });
    (gallery.init = function(){
        toolbar.update();
    })();
    return gallery;
}
function NextButton(){
    var nb = new PushButton("next"," ");
    nb.action = function(e){
        var citem = folder.items.indexOf(gallery.item);
        if (citem < folder.items.length-1) {
            folder.items[citem+1].click();
        }
        e.stopPropagation();
    };
    return nb;
}
function PrevButton(){
    var prevb = new PushButton("prev"," ");
    prevb.action = function(e){
        var citem = folder.items.indexOf(gallery.item);
        if (citem > 0) {
            folder.items[citem-1].click();
        }
        e.stopPropagation();
    };
    return prevb;
}
function DownloadLabel(){
    var dlb = new element("div.dlabel#dlabel");
    return dlb;
}
/////////////////////////////////////GALLERY MAIN VIEW//////////////////////////
// function ItemImage(iobj);
function ItemImage(iobj){
    var itemimage = new element("img");
    itemimage.item = iobj;
    itemimage.src = photoroot+iobj.srcobj.year+"/index/"+iobj.srcobj.path;
    itemimage.addEventListener("load",function(e){
        if (this.naturalHeight < this.naturalWidth) { 
            this.item.style.width = Math.floor(this.item.itemsizeQ*2).toString()+"px";
            if ((folder.vitemscount>0) && (folder.vitemscount%2 == 1)) {
                folder.lastvitem = folder.itemloadindex-1;
                folder.vitemscount = 0;
            }
        } 
        else { 
            this.item.style.width = Math.floor(this.item.itemsizeQ).toString()+"px";
            if (folder.lastvitem != null) {
                this.item.style.order = folder.lastvitem;
                folder.lastvitem = null;
            }
            else folder.vitemscount++;
        }
        this.item.setAttribute("loaded",true);
        folder.nextItem();
    });
    return itemimage;
}

// function Item(srcobj);
function Item(srcobj){
    var item = section(".item");
    Switchable(item);
    item.sticky = true;
    item.srcobj = srcobj;
    item.style.order = item.number = folder.itemloadindex;
    item.setAttribute("loaded",false);
    item.style.borderBottomColor = colors[(parseInt(item.srcobj.day)%colors.length)];
    item.setAttribute("itemname",srcobj.year+"/"+srcobj.month+"/"+srcobj.day+" "+srcobj.hour+":"+srcobj.minutes+":"+srcobj.seconds);
    item.itemsizeQ = ((folder.clientWidth/2)/(itemSizeC));
    item.style.height = (3*item.itemsizeQ/2).toString()+"px";
    item.appendElement(new ItemImage(item));
    item.switch = function(state){
        if (state) gallery.show(this);
    }
    return item;
}

// function Folder();
function Folder(){
    var folder = selector("#folder");
    Scrollable(folder);
    folder.autoscroll = true;
    folder.itemloadindex = 0;
    folder.vitemscount = 0;
    folder.lastvitem = null;
    folder.nextItem = function(){
    	toolbar.progress.setState(folder.itemloadindex++);
    	if ((Photos[mselector.selected.num].length)>(folder.itemloadindex)){
    		folder.append(new Item(Photos[mselector.selected.num][folder.itemloadindex]));
    	}
    	else {
    		toolbar.progress.hide();
    	}
    }
    folder.fill = function() {
        gallery.hide();
        this.wipe();
        toolbar.progress.show(Photos[mselector.selected.num].length);
        this.itemloadindex = 0;
        this.vitemscount = 0;
        folder.lastvitem = null;
		this.append(new Item(Photos[mselector.selected.num][folder.itemloadindex]));
    };
    folder.addEventListener("click",function(e){e.cancelBubble = true});
    return folder;
}

//////////////////////////////MONTHS SELECTION//////////////////////////////////
// function MonthBar(count,barheight)
function MonthBar(count,barheight){
    var monthbar = element("div.monthbar");
    (monthbar.update = function(num,height){
        monthbar.setAttribute("count",num.toString());
        monthbar.style.height = height.toString()+"px";
    })(count,barheight);
    return monthbar;
}

// function Month();
function Month(monthnum){
    var month;
    if (Photos[monthnum].length > 0) {
        month = section(".month#m"+(monthnum+1).toString());
        month.num = monthnum;
        var barheight = Math.ceil(30*(Photos[monthnum].length/mselector.maximum));
        month.appendElement(month.bar = new MonthBar(Photos[monthnum].length,barheight));
        mselector.nonEmptyMonths.push(month);
    }
    else {
        month = element("div.emptymonth#m"+(monthnum+1).toString());
    }
    Switchable(month);
    month.setAttribute("disabled",(Photos[monthnum].length>0)?false:true);
    month.sticky = true;
    month.switch = function(state){
        if (state) folder.fill();
    };
    return month;
}

// function MonthSelector();
function MonthSelector(){
    var monthselector = selector("#mselector");
    monthselector.maximum = 0;
    monthselector.nonEmptyMonths = new Array();
    monthselector.fill = function(){
        var i=0;
        var m=0;
        this.wipe();
        this.nonEmptyMonths = [];
        for (i=0;i<12; i++) {
            if (Photos[i].length > m) m=Photos[i].length;
        }
        this.maximum = m;
        for (i=0;i<12;i++) {
            this.append(new Month(i));
        }
        (this.selected = this.nonEmptyMonths[0]).toggle();
    };
    monthselector.getPhotosData = function(year) {
    	document.downloader.addTask(photoroot+"/"+year+"/"+year+".json",mselector.gotAnswer,false);
    };
    monthselector.gotAnswer = function(xhr) {
            if (xhr.status == 200){
                var Response = JSON.parse("["+xhr.responseText+"]");
                Response.sort(function(a,b){return parseInt(a.path)-parseInt(b.path)});
                Photos = [[],[],[],[],[],[],[],[],[],[],[],[]];
                for (var i=0; i<Response.length; i++) {
                    Photos[parseInt((Response[i].month == "00") ? ("1") : (Response[i].month.replace(/^0/,"")))-1].push(Response[i]);
                }
                mselector.fill();
            };
    }
    return monthselector;
}

/////////////////////////////YEARS SELECTION////////////////////////////////////
//function Year();
function Year(value){
    var year = element("div.year");
    year.setAttribute("value", value);
    Switchable(year);
    year.sticky = true;
    year.switch = function(state){
        if (state) {
            mselector.getPhotosData(this.getAttribute("value"));
        }
    }
    return year;
}

//function YearSelector();
function YearSelector(){
    var yearselector = selector("#yselector");
    yearselector.fill = function(years){
        this.wipe();
        for (var i=0; i<years.length; i++) {
            this.append(new Year(years[i]));
        }
        if (this.items.length>0)
            (this.selected = this.items[0]).toggle();
    };
    return yearselector;
}

////////////////////////////IMAGE ADDING FORM///////////////////////////////////

        /////////////////////PREVIEW UPLOADING IMGS////////////////
//function PreviewItem();
function PreviewItem(imagefile){
    var previewitem = section(".ppreview.invisible");
    previewitem.fObj = imagefile;
    previewitem.setAttribute("phname",imagefile.name+" ["+(Math.ceil(imagefile.size/1024)).toString()+" kbytes]");
    previewitem.setAttribute("valid",imagefile.valid);
    previewitem.append(previewitem.image = element("img.ppreview"));
    previewitem.image.src = (previewitem.getAttribute("valid") == "true") ? URL.createObjectURL(imagefile.data) : "";
    previewitem.image.addEventListener("load",function(){
        URL.revokeObjectURL(this.src);
        this.parentNode.fObj.preview = this.parentNode;
        this.parentNode.classList.remove("invisible");
        addselector.uploadprogress.value = Math.ceil(addselector.uploadprogress.value)+1;
        if (addselector.uploadprogress.total == addselector.uploadprogress.value)
            addselector.uploadprogress.hide();
    });
    previewitem.append(previewitem.bCancel = PushButton("canceladd", "Remove"));
    previewitem.bCancel.action = function(e){
        previewsection.remove(this.parentNode);
        addselector.files.remove(addselector.files.indexOf(this.parentNode.fObj));
    };
    return previewitem;
}

//function PreviewSection()
function PreviewSection(){
    var previewsection = section(".previewsection#previewsection");
    previewsection.fill = function(farray){
        addselector.uploadprogress.show(addselector.uploadprogress.total+farray.length);
        for (var fi=0; fi<farray.length; fi++){
            this.append(new PreviewItem(farray[fi]));
        }
    };
    return previewsection;
}

        /////////////////////FILE INPUT/////////////////////////////
//function FileInput();
function FileInput(){
    var fileinput = element("input#fileinput");
    fileinput.type = "file";
    fileinput.setAttribute("multiple",true);
    fileinput.addEventListener("change",function(){
        if (this.value != ""){
            addselector.filabel.disable();
            addselector.files = new FilesCollection(this.files);
            addselector.previewsection.fill(addselector.files);
            addselector.ready();
        }
    });
    fileinput.clear = function(){
        this.value = "";
        addselector.files = null;
        addselector.filabel.enable();
    }
    return fileinput
}

//function FILabel();
function FILabel(){
    var filabel = new element("label.button#filabel");
    filabel.enable = function(){
        this.setAttribute("disabled",false);
        this.setAttribute("for","fileinput");
    };
    filabel.disable = function(){
        this.setAttribute("disabled",true);
        this.setAttribute("for","");
    };
    filabel.enable();
    return filabel
}

        //////////////////////CONTROLS//////////////////////////////
//function SendButton();
function SendButton(){
    var sendbutton = PushButton("sendbutton","Send");
    sendbutton.action = function(){
        addselector.uploadprogress.show(addselector.files.length);
        addselector.fcindex = 0;
        addselector.send();
    };
    return sendbutton;
}

//function ClearButton();
function ClearButton(){
    var clearbutton = PushButton("clearbutton","Clear");
    clearbutton.action = function(){
        addselector.clear();
    };
    return clearbutton;
}

        //////////////////////MAIN FORM DEFINITIONS///////////////////

//function FilesCollection();
var FilesCollection = (function FilesCollection(files){
    this.totalsize = 0;
    this.maxlength = 10;
    this.__defineGetter__("sent",function(){
        var r=[];
        for (var fi=0;fi<this.length;fi++){
            if (this[fi].sent) r.push(this[fi]);
        }
        return r;
    });
    this.append = function(fitem){
        return this.insert(fitem,this.length);
    };
    this.insert = function(fitem,index){
        if (this.length < this.maxlength){
            this.splice(index,0,{
                name: fitem.name || fitem.fileName,
                valid: ((fitem.name || fitem.fileName).search(/(jpg|jpeg|gif|png)$/i) < 0) ? false : true,
                size: fitem.size || fitem.fileSize,
                data: fitem,
                preview: null,
                get sent(){
                    if (this.preview.classList.contains("sent")) return true;
                    else return false;
                },
                set sent(v){
                    if (!this.sent){
                        if (v) this.preview.classList.add("sent");
                        else this.preview.classList.add("fail");
                    }
                },
                get added(){
                    if (this.preview.classList.contains("added")) return true;
                    else return false;
                },
                set added(v){
                    if (this.sent && !this.added) {
                        if (v) this.preview.classList.add("added");
                        else this.preview.classList.add("fail");
                    }
                }
            });
            this.totalsize += this[index].size;
            return true;
        }
        else {
            return false;
        }
    };
    this.remove = function(index){
        if (index >= 0){
            if (index < this.length) {
                this.totalsize -= this[index].size;
                this.splice(index,1);
            }            
        }
        if (this.length == 0){
            addselector.clear();
        }
    };
    this.fill = function(fs){
        var l = (fs.length > this.maxlength) ? this.maxlength : fs.length;
        for (var i = 0; i < l; i++) {
            this.append(fs[i]);
        }
    };
    this.fill(files);
}).extends(Array);

//function AddSelector();
function AddSelector(){
    var addselector = section(".addform.closed#addselector");
    addselector.files = null;
    addselector.fcindex = 0;
    addselector.uploadprogress = null;
    addselector.appendElement(new PushButton("opentoggle","+"));
    addselector.opentoggle.action = function(){
        this.parentNode.open();
    };
    addselector.appendElement(new FileInput());
    addselector.appendElement(new FILabel());
    addselector.appendElement(new SendButton());
    addselector.appendElement(new ClearButton());
    addselector.sendbutton.disable();
    addselector.clearbutton.disable();
    addselector.appendElement(addselector.uploadprogress = progress());
    addselector.uploadprogress.hide("invisible");
    addselector.appendElement(new PreviewSection());
    addselector.ready = function(){
        this.sendbutton.enable();
        this.clearbutton.enable();
    };
    addselector.send = function(){
        this.sendbutton.disable();
        this.clearbutton.disable();
        document.reader.add(this.files[this.fcindex].data,function(r){
            document.networking.request({
                method: "POST",
                url: "/cgi-bin/send.cgi",
                params: new Uint8Array(r),
                resulthandler: addselector.sent,
                progresshandler: addselector.uploadprogress,
                headers: {
					"Cache-Control":"no-cache"
				}
            });
        });
    };
    addselector.sent = function(xhr){
        if (xhr.status == 200) {
            if (xhr.responseText == "OK") {
                addselector.files[addselector.fcindex].sent = true;
            }
            else {
                addselector.files[addselector.fcindex].sent = true;
            }
            if (addselector.files.sent.length < addselector.files.length) {
                addselector.uploadprogress.setState(addselector.fcindex++);
                addselector.send();
            }
            else {
                addselector.add();
                addselector.uploadprogress.show(0);
            }
        }
        else {
            alert("Server reports of error: "+xhr.status.toString());
        }
    };
    addselector.add = function(){
        document.networking.request({
            method: "POST",
            url: '/cgi-bin/add.cgi',
            params: "",
            resulthandler: this.added,
            progresshandler: false,
			headers: {
				"Cache-Control":"no-cache"
			}

        })
    };
    addselector.added = function(xhr){
        addselector.uploadprogress.hide();
        var sent = addselector.files.sent;
        var collectederrors = "";
        if (xhr.status == 200) {
            var Status = JSON.parse(xhr.responseText);
            for (var i=0; i<(sent.length); i++) {
                if (Status[i.toString()] == "Success") sent[i].added = true;
                else {
                    collectederrors += "Adding "+sent[i].name+": "+Status[i.toString()]+"\n";
                    sent[i].added = false;
                }
            }
            if (collectederrors != "") {
                alert(collectederrors);
            }
            addselector.clear();
            addselector.open();
            mselector.getPhotosData(yselector.selected.getAttribute("value"));
        }
        else {
            alert("Server reports of error: "+xhr.status.toString());                    
        }
    };
    addselector.clear = function(){
        this.fileinput.clear();
        this.xhr = null;
        this.previewsection.wipe();
        this.sendbutton.disable();
        this.clearbutton.disable();
    };
    addselector.open = function(){
        this.classList.toggle("closed");
    };
    return addselector;
}

////////////////////////////MAIN FOLDER VIEW TOOLBAR////////////////////////////
//function Toolbar();
function Toolbar(){
    var toolbar = section(".ptoolbar#ptoolbar");
    toolbar.xhr = null;
    toolbar.appendElement(yselector = new YearSelector());
    toolbar.appendElement(mselector = new MonthSelector());
//    toolbar.appendElement(sizeselector = new SizeSelector());
    toolbar.appendElement(addselector = new AddSelector());
    toolbar.appendElement(toolbar.progress = new progress());
    toolbar.progress.hide("opaque");
    toolbar.update = function(){
    	document.networking.request({
			url:"/cgi-bin/years.cgi",
			method: "GET",
			resulthandler: function(xhr){
                    if (xhr.status == 200) {
                        YEARS = JSON.parse(xhr.responseText);
                        yselector.fill(YEARS);
                    }
                    else alert("Server error code: "+xhr.status);
                    toolbar.xhr = null;
            },
			progresshandler: toolbar.progress,
			headers: {
				"Cache-Control":"no-cache"
			}
		});
    };
    return toolbar;
}

document.body.addEventListener("click",function(event){
    if (gallery.item != null) {
        if (event.srcElement == body) {
            gallery.hide();
        }
    }
})
