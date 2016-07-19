
function fold(root){
    if (typeof root === "object") {
        var append = (root.append || root.appendChild).bind(root);
    }
    var imgs=new Array(2);
    var Fold = (function Fold(){	    //new constructor
	this.top=new element("div.img.top");
	this.bottom=new element("div.img.bottom");	
	if (append) {
	    append(this.top);
	    append(this.bottom);
	}
	this.Load = function(){
	    if (!this.top.classList.contains("face")) {
		this.loaded=false;
		document.networking.request({
		    url: "/cgi-bin/randpic.cgi",
		    method: "GET",
		    type: "blob",
		    resulthandler: function(xhr){
				if (xhr.status == 200) {
					if (this.picdata) URL.revokeObjectURL(this.picdata);
					this.picdata=URL.createObjectURL(xhr.response);
					this.setPic("url('"+this.picdata+"#"+new Date().getTime()+"')");
					this.loaded=true;
				}
		    }.bind(this),
			headers: {
				"Cache-Control":"no-cache"
			}
		})
	    }
	};
	this.top.addEventListener("animationend",this.Load.bind(this));
	this.bottom.addEventListener("click",function(e){
	    this.other.toFace();
	}.bind(this));
	this.Load();
    }).extends({	    //base object
	    //methods
	    setPic(pic){
		this.top.style.backgroundImage = pic;
		this.bottom.style.backgroundImage = pic;
		return this
	    },  
	    toFace(){
		this.top.classList.add("face");
		this.bottom.classList.add("face");
		if (this.other) {
		    this.other.top.classList.remove("face");
		    this.other.bottom.classList.remove("face");
		}
		return this
	    },
	    get loaded(){
		if (this.top.getAttribute("loaded") == "true") return true;
		return false
	    },
	    set loaded(v){
		var b=v?"true":"false";
		this.top.setAttribute("loaded",b);
		this.bottom.setAttribute("loaded",b);
	    } 
	});
    imgs[0]=new Fold();
    imgs[1]=new Fold();
    imgs[0].other=imgs[1];imgs[1].other=imgs[0];
    imgs[0].toFace();
    if (append) {
	root.folds=imgs;
	return root
    }
    else return imgs
}
