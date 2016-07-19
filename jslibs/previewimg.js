
function previewimg(root){
    if (typeof document.body.thumbnail === "object") return false;
    root.parentNode.appendChild(document.body.thumbnail = new Thumbnail(root.className));
    root.parentNode.removeChild(root);
    var s,as;
    s=document.body.getElementsByClassName("n");
    for (var i=0; i<s.length; i++) {
        if ((as = s[i].getElementsByTagName("a")).length > 0) {
            if (as[0].href.search(/\.jpg/i) != -1){
                s[i].targetfile = as[0].href.substr(as[0].href.search(location.hostname)+location.hostname.length+1);
                s[i].thumb = '/cgi-bin/thumbnailer.cgi?'+s[i].targetfile;
                s[i].setAttribute("thumbnail",s[i].thumb);
                s[i].onmouseover = function(e){
                    this.moTimeOut = document.timer.add(document.body.thumbnail.showthumb,[this,{x:e.pageX+(this.offsetWidth-e.offsetX),y:e.pageY-(e.offsetY)}],300,1);
                };
                s[i].onmouseout = function(e){
                    document.body.thumbnail.hidethumb();
                    document.timer.remove(this.moTimeOut);
                };
            };
        }
    }
}
function Thumbnail(){
    var t = element("img.preview"+((arguments[0].length>0)?(" "+arguments[0]):(""))+"#thumb");
    t.showthumb = function(){
        t.style.top = (arguments[1].y).toString()+"px";
        t.style.left = (arguments[1].x).toString()+"px";
        t.src = arguments[0].thumb;
    };
    t.onload = function(){
        if (t.src != "") {
            if (((window.innerHeight+window.scrollY)-t.offsetHeight) < t.offsetTop) {
                t.style.top = ((window.innerHeight+window.scrollY)-t.offsetHeight-25).toString()+"px";
            }
            t.style.opacity = 1;
        }
        else t.style.opacity = 0;
    };
    t.hidethumb = function(){
        t.style.opacity = 0;
        t.src = "";
    };
    return t;
}

