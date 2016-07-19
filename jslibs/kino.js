var prefix="/cgi-bin/cgiproxy.py?url=";
var re=/.*=([0-9]{4}$)/;
function kino(){
    var kino = new section(".kino#kino");
    if (arguments.length > 0) {
        if (arguments[0].appendChild) arguments[0].appendChild(arguments[0].kino = kino);
    } 
    Scrollable(kino);
    kino.Film = function(fdata){
        var film =  new section(".films");
        film.fid = fdata.getElementsByTagName('link')[0].childNodes[0].data.replace(re,"\$1");
        film.title = fdata.getElementsByTagName('title')[0].childNodes[0].data;
        film.innerHTML = "<h3>"+film.title+"</h3><br><font>"+fdata.getElementsByTagName('description')[0].childNodes[0].data+"</font><br>";
        film.append(new PushButton("kinoaddtorrent","Add torrent")).action = function(e){
            document.networking.request({
                method: "GET",
                url: "/cgi-bin/getfilm.cgi?"+film.fid,
                resulthandler: function(xhr){
                    if (xhr.responseText.search(/^http.*\.torrent$/) == -1){
                        alert("Failed to get .torrent URL");
                    }
                    else {
                        document.body.topbar.trinfo.trinfobar.addtorrent(xhr.responseText);
                        film.kinoaddtorrent.disable();
                    }
                }
            })
        };
        film.append(new PushButton("kinoaskgoo","More...")).action = function(e){
            window.open("http://google.com.ua/search?q="+film.title,"_blank");
        };
        return film;
    };
    kino.fill = function(data){
            var xmldoc = data;
            var xmldata = xmldoc.getElementsByTagName('item');
            var xmlimg = xmldoc.getElementsByTagName('img');
            var imgcache = [];      
            for (var i=0;i<xmlimg.length; i++){
                imgcache[i] = new Image();
                imgcache[i].src = prefix+(xmlimg[i].childNodes[0].data.replace(/http:\/\/(.*)/,"\$1"));
                this.append(new this.Film(xmldata[i])).insert(imgcache[i],0);
            }   
    };
    document.networking.request({
        url:prefix+"kinomaniya.org/rss.php",
        method: "GET",
        resulthandler: function(xhr){
            kino.fill(new DOMParser().parseFromString(xhr.response,'text/xml'));
        },
        progresshandler: document.body.mainprogress
    });
    return kino;
}
