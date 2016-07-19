#!/bin/bash
echo "Content-type: text/html"
echo ""

cat << EOM1
<HTML>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="/styles/basic.css">
<script type="text/javascript">
EOM1
cat /opt/etc/zahadky | awk -v seed=$(date +%s) 'BEGIN{FS=":";srand(seed); r=int(rand()*53)+1;}{if (NR == r) print "var sid="r";\nvar str=\""$1"\";\nvar solution=\""$2"\";"}'
cat << EOM2
var iW = 48; //ширина елементу
var iH = 48; //висота елементу
var f = [[
"close",
"1",
"2",
"3",
"4",
"5",
"6",
"7",
"8",
"9",
"0",
"-",
"й",
"ц",
"у",
"к",
"е",
"н",
"г",
"ш",
"щ",
"з",
"х",
"ї",
"ф",
"і",
"в",
"а",
"п",
"р",
"о",
"л",
"д",
"ж",
"є",
"&nbsp;",
"я",
"ч",
"с",
"м",
"и",
"т",
"ь",
"б",
"ю",
".",
",",
"UA" ],
["close",
"1",
"2",
"3",
"4",
"5",
"6",
"7",
"8",
"9",
"0",
"-",
"й",
"ц",
"у",
"к",
"е",
"н",
"г",
"ш",
"щ",
"з",
"х",
"ъ",
"ф",
"і",
"в",
"а",
"п",
"р",
"о",
"л",
"д",
"ж",
"э",
"&nbsp;",
"я",
"ч",
"с",
"м",
"и",
"т",
"ь",
"б",
"ю",
".",
",",
"RU"],
["close",
"1",
"2",
"3",
"4",
"5",
"6",
"7",
"8",
"9",
"0",
"-",
"q",
"w",
"e",
"r",
"t",
"y",
"u",
"i",
"o",
"p",
"(",
")",
"a",
"s",
"d",
"f",
"g",
"h",
"j",
"k",
"l",
":",
";",
"&nbsp;",
"z",
"x",
"c",
"v",
"b",
"n",
"m",
",",
".",
"?",
"!",
"EN"]];
var pad = iW/8; //проміжки між елементами першого рівня (в розгорнутому стані)
var fpad = iW/4;//проміжки між елементами нульового рівня
var margn = iW/16; //поля навколо домашнього екрану
var scrollspeed = Math.round(512/iH);
var zoomk = 1.2; //коефіцієнт збільшення при наведенні
wwidth= ((window.innerWidth) && (window.innerWidth>=1024)) ? window.innerWidth : 1024;
wheight = ((window.innerHeight) && (window.innerHeight>=768)) ? window.innerHeight : 768;
document.body.style.width = wwidth;
document.body.style.height = wheight;
function Item(nid,nx,ny,width,height){
	var newitem = document.createElement("div");
	newitem.elementtype="item";
	newitem.className = "item";
	newitem.id = nid;
	newitem.selected = 0;
	newitem.counter = 0;
	newitem.thumbsActive = 0;
	newitem.baseposX = 0;
	newitem.baseposY = 0;
	newitem.oldposX=null;
	newitem.oldposY=null;
	newitem.oldWidth=null;
	newitem.oldHeight=null;
	newitem.myWidth = 0;
	newitem.myHeight = 0;
	newitem.newWidth = null;
	newitem.newHeight = null;
	newitem.newposY = null;
	newitem.newposX = null;
	newitem.oldZIndex = null;
	newitem.newZIndex = null;
	newitem.timId = null;
	newitem.level = 0;
	newitem.drag = 0;
	newitem.dragX = 0;
	newitem.dragY = 0;
	newitem.dragdeltaX = 0;
	newitem.dragdeltaY = 0;
	newitem.chsize = function(w,h) {
		this.style.width = w;
		this.style.height = h;
	}
	newitem.size = function(w,h) {
		this.chsize(w,h);
		this.myWidth = w;
		this.myHeight = h;
	}
	newitem.chplace = function(x,y) {
		this.style.left = x;
		this.style.top = y;
	}
	newitem.place = function(x,y) {
		this.chplace(x,y);
		this.baseposX = x;
		this.baseposY = y;
	}
	newitem.resize = function(nW,nH,nT,nL,lev) {
		if ((this.timId == null) || (lev != this.newZIndex)) {
			if (this.timId != null) clearInterval(this.timId);
			this.oldposX = parseInt(this.style.left);
			this.oldposY = parseInt(this.style.top);
			this.newposX = (nL<0) ? 0 : nL;
			this.newposY = (nT<0) ? 0 : nT;
			this.oldWidth = this.clientWidth;
			this.oldHeight = this.clientHeight;
			this.newWidth = nW;
			this.newHeight = nH;
			this.oldZIndex = this.level;
			this.newZIndex = lev;
			this.counter = 0;
			this.timId = setInterval("document.getElementById(\""+(this.id).toString()+"\").resize("+nW.toString()+","+nH.toString()+","+nT.toString()+","+nL.toString()+","+lev.toString()+")",20);
		}
		else {
			this.counter=this.counter+1;
			var c = this.counter;
//			var q = ((c*10)/100);
			var q = Math.sin((c*15.7)/100);
			if (this.newZIndex > this.oldZIndex) {
				this.level = this.oldZIndex + (q*(this.newZIndex - this.oldZIndex));
			}
			else {
				this.level = this.oldZIndex - (q*(this.oldZIndex - this.newZIndex));
			}
			var z = Math.round(this.level/2);
			this.style.zIndex = z;
			this.style.boxShadow = "0px "+z.toString()+"px "+(z/2).toString()+"px "+(z/4).toString()+"px rgba(0,0,0,0.7)";
			this.style.WebkitBoxShadow="0px "+z.toString()+"px "+(z/2).toString()+"px "+(z/2).toString()+"px rgba(0,0,0,0.7)";
			this.style.MozBoxShadow="0px "+z.toString()+"px "+(z/2).toString()+"px "+(z/4).toString()+"px rgba(0,0,0,0.7)";
			this.chsize(this.oldWidth + Math.round(q*(this.newWidth-this.oldWidth)),this.oldHeight + Math.round(q*(this.newHeight-this.oldHeight)));
			this.chplace(this.oldposX + (Math.round(q*(Math.floor(this.newposX-this.oldposX)))),this.oldposY + (Math.round(q*(Math.floor(this.newposY-this.oldposY)))));
			if (this.counter >= 10) {
				clearInterval(this.timId);
				this.timId = null;
				this.counter = 0;
			}
		}
	}
	newitem.onmouseover = function() {
		if (this.parentNode.thumbsActive == 1) {
			var newwidth=Math.round(this.myWidth*zoomk);
			var newheight=Math.round(this.myHeight*zoomk);
			this.resize(newwidth,newheight,(this.offsetTop-((newheight-this.myHeight)/2)),(this.offsetLeft-((newwidth-this.myWidth)/2)),50);
		}
	}
	newitem.onmouseout = function() {
		if (this.parentNode.thumbsActive == 1) {
			this.resize(this.myWidth,this.myHeight,this.baseposY,this.baseposX,1);
		}
	}
	newitem.ondblclick = function(){void(0);}
	newitem.onclick = function(){
		if (this.parentNode.selected == 1) {
                        var hold = document.getElementById("top");
                        var newid = this.id+"c";
                        while (document.getElementById(newid)) {
                                newid+="c";
                        }
                        var clone = Item(newid,0,0,iW*0.7,iH*0.7);
                        clone.onclick = null;
                        clone.innerHTML = this.innerHTML;
                        hold.add(clone);
                        clone.chplace(this.baseposX,this.baseposY+document.getElementById("keys").offsetTop);
                        clone.onmouseout();
                        clone = null;
		}
	}
	newitem.size(width,height);
	newitem.place(nx,ny);
	return newitem;
}
function Folder(fid,x,y){
	var newfolder=document.createElement("div");
	newfolder.style.width=iW;
	newfolder.style.height=iH;
	newfolder.style.overflow = "visible";
	newfolder.selected = 0;
	newfolder.elementtype="folder";
	newfolder.id=fid;
	newfolder.selected = 0;
	newfolder.counter = 0;
	newfolder.thumbsActive = 0;
	newfolder.baseposX = 0;
	newfolder.baseposY = 0;
	newfolder.oldposX=null;
	newfolder.oldposY=null;
	newfolder.oldWidth=null;
	newfolder.oldHeight=null;
	newfolder.myWidth = 0;
	newfolder.myHeight = 0;
	newfolder.newWidth = null;
	newfolder.newHeight = null;
	newfolder.newposY = null;
	newfolder.newposX = null;
	newfolder.timId = null;
	newfolder.chsize = function(w,h) {
		this.style.width = w;
		this.style.height = h;
	}
	newfolder.size = function(w,h) {
		this.chsize(w,h);
		this.myWidth = w;
		this.myHeight = h;
	}
	newfolder.chplace = function(x,y) {
		this.style.left = x;
		this.style.top = y;
	}
	newfolder.place = function(x,y) {
		this.chplace(x,y);
		this.baseposX = x;
		this.baseposY = y;
	}
	newfolder.style.border="none";
	newfolder.style.background = "none";
	newfolder.rowlength=1;
	newfolder.collength=1;
	newfolder.resize = function(nW,nH,nT,nL,sel) {
		if ((this.timId == null) || (sel != this.selected)) {
			if (this.timId != null) clearInterval(this.timId);
			this.oldposX = parseInt(this.style.left);
			this.oldposY = parseInt(this.style.top);
			this.newposX = (nL<0) ? 0 : nL;
			this.newposY = (nT<0) ? 0 : nT;
			this.oldWidth = this.clientWidth;
			this.oldHeight = this.clientHeight;
			this.newWidth = nW;
			this.newHeight = nH;
			if (this.selected<sel) {
				this.style.zIndex=sel+1; //do in the beginning of the selection
			}
			else {
				this.thumbsActive = sel; //do in the beginning of the deselection
			}
			this.selected = sel;
			this.counter = 0;
			this.timId = setInterval("document.getElementById(\""+(this.id).toString()+"\").resize("+nW.toString()+","+nH.toString()+","+nT.toString()+","+nL.toString()+","+sel.toString()+")",20);
		}
		else {
			this.counter=this.counter+1;
			var c = this.counter;
//			var q = ((c*10)/100);
			var q = Math.sin((c*15.7)/100);
			this.chsize(this.oldWidth + Math.round(q*(this.newWidth-this.oldWidth)),this.oldHeight + Math.round(q*(this.newHeight-this.oldHeight)));
			this.chplace(this.oldposX + (Math.round(q*(Math.floor(this.newposX-this.oldposX)))),this.oldposY + (Math.round(q*(Math.floor(this.newposY-this.oldposY)))));
			if (this.counter >= 10) {
				this.style.zIndex=sel+1;
				this.thumbsActive = sel;
				clearInterval(this.timId);
				this.timId = null;
				this.counter = 0;
			}
		}
	}
	newfolder.rebuild = function(){
		var n = this.children.length;
		this.rowlength = 12;//Math.min(Math.ceil(Math.sqrt(n)),Math.floor((document.body.clientWidth-pad-(Math.round(iW*zoomk)-iW)-margn*2)/(iW+pad)));
		this.collength = 4;//Math.ceil(n/this.rowlength);
		var j = 0
		while (j<n) {
			var nt = Math.floor(j/this.rowlength)*(iH+pad)+margn+pad+(Math.round(iH*zoomk)-iH)/2;
			var nl = (j-Math.floor(j/this.rowlength)*this.rowlength)*(iW+pad)+margn+pad+(Math.round(iW*zoomk)-iW)/2;
			this.children[j].baseposX=nl;
			this.children[j].baseposY=nt;
			j++;
		}
		if (n==1) {
			this.selected = 1;
		}
		else {
			this.selected = 0;
		}	
	}
	newfolder.populate = function(obj){
		this.appendChild(obj);
		this.rebuild();
	}
	newfolder.open = function(){
		var newwidth = (this.rowlength*(iW+pad))+(Math.round(iW*zoomk)-iW)+pad+margn*2;
		var newheight = (this.collength*(iH+pad))+(Math.round(iH*zoomk)-iH)+pad+margn*2;
		var newleft=(this.offsetLeft-(newwidth-this.clientWidth)/2);
		this.resize(newwidth,newheight,Math.max((this.offsetTop-(newheight-this.clientHeight)/2),0),Math.max((newleft+Math.min(document.body.clientWidth-(newleft+newwidth),0)),0),1);
		var n = this.children.length;
		while (n>0) {
			n--;
			this.children[n].resize(this.children[n].myWidth,this.children[n].myHeight,this.children[n].baseposY,this.children[n].baseposX,2);
		}
		this.children[this.children.length-1].innerHTML = "enter";
	}
	newfolder.close = function(){
		var n = this.children.length;
		if (n>1) {
			while (n>0) {
				n--;
				if (n==0) {
					this.children[n].resize(iW,iH,0,0,2);
				}
				else {
					this.children[n].resize(iW,iH,0,0,1);
				}
			}
			this.resize(this.myWidth,this.myHeight,this.baseposY,this.baseposX,0)
		}
		this.children[this.children.length-1].innerHTML = f[parseInt(this.id)][this.children.length-1];
	}
	newfolder.onclick = function(event){
        	var evt = (event) ? event : window.event;
        	var prev = evt.srcElement;
        	if (((prev.id == (this.children[this.children.length-1].id)) || (prev.id == (this.children[0].id))) && (prev.drag == 0)) {
        		if (this.selected == 0) {
        		        this.open();
        		}
        		else {
        		        this.close();
        		}
        	}
        	else {
        		prev.drag = 0;
        	}
	}
	newfolder.ondblclick = function(){
		void(0);
	}
	newfolder.onmousewheel = function(event) {
		if ((this.selected == 1) && (this.scrollHeight > document.body.clientHeight)) {
			var evt = (event) ? event : window.event;
			var delta = Math.round(((evt.wheelDelta) ? evt.wheelDelta : (evt.detail*(-120)))/scrollspeed);
			if ((this.scrollHeight+this.offsetTop+delta>=document.body.clientHeight-(Math.round(iH*zoomk)-iH)/2-pad-margn) && ((this.offsetTop+delta)<=0)) {
				this.style.top = (this.offsetTop)+delta;
			}
			
		}
	}
	newfolder.size(iW+2,iH+2);
	newfolder.place(x,y);
	return newfolder;
}
</script>
<BODY>
<form name=postpass method=GET action="/cgi-bin/env.cgi"><input name=pass type=hidden></input>
<input name=sesid type=hidden></input></form>
<p id="q">zavdannia</p>
</BODY>
<script language="Javascript">
document.getElementById("q").innerText=str;
var i = f.length;
var h = document.createElement("div");
h.id = "top";
h.className = "holder";
h.style.width = wwidth*0.6;
h.style.height = iH*0.7+2+(2*pad);
h.style.border = "solid 1px #e5e5e5";
h.thumbsActive = 1;
h.add = function(obj) {
        if (this.children.length > 0) {
                var lasttop = this.children[this.children.length-1].baseposY;
                var lastheight = this.children[this.children.length-1].myHeight;
                var lastleft = this.children[this.children.length-1].baseposX;
                var lastwidth = this.children[this.children.length-1].myWidth;
                if (lastleft+lastwidth+pad+obj.myWidth+pad > this.clientWidth) {
                        newtop = lasttop+pad+lastheight;
                        newleft = pad;
                        if (this.clientHeight < newtop+obj.myHeight+pad+pad) {
                                this.style.height = this.clientHeight+iH*0.7+2+pad;
                        }
                }
                else {
                        newtop = lasttop;
                        newleft = lastleft+pad+lastwidth;
                }
        }
        else {
                newtop = pad;
                newleft = pad;
        }
        this.appendChild(obj);
        obj.place(newleft,newtop);
}
document.body.appendChild(h);
h = document.createElement("div");
h.id = "keys";
h.className = "holder";
h.style.width = wwidth-50;
h.style.height = document.body.clientHeight-180;
document.body.appendChild(h);
h = document.getElementById("keys");
function submpass() {
        if (this.parentNode.selected == 1) {
                var pass = "";
                if (document.getElementById("top").children.length>0) {
                	for (i=0; i<document.getElementById("top").children.length; i++) {
                	pass += document.getElementById("top").children[i].innerText;
                	      	}
                	document.postpass.children[0].value = pass;
                	document.postpass.children[1].value = sid;
                	if (pass == solution.toLowerCase()) document.postpass.submit();
                	else {
                		document.getElementById("top").innerHTML = "";
                	}
        	}
	}
}
while (i>0) {
	i--;
	h.appendChild(Folder(i.toString(),i*(iW+fpad)+fpad,fpad));
	var num = f[i].length;
	var j = 0;
	while (j<num) {
		var item=Item(i.toString()+"-"+j.toString(),0,0,iW,iH);
		item.innerHTML = f[i][j];
		if ((j == num-1) || (j == 0)) {
		        item.onclick = null;
		        item.style.fontSize = "80%";
		        item.style.lineHeight = "200%";
		        if (j == num-1) item.onclick = submpass;
		}
		document.getElementById(i.toString()).populate(item);
		j++;
	}
}
</script>
</HTML>
EOM2
