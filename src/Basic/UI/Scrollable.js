/*  global CustomEvent  */
import scroll from 'Scroll';

export default function Scrollable(elem){
    var vq,hq,vmax,hmax,vold,hold,vstart,hstart;
    if ((typeof elem.onwheel === "object") && (typeof elem.onmousemove === "object") /*&& (getComputedStyle(elem).getPropertyValue("overflow") == "hidden")*/) {
        elem.hscroll = elem.insertBefore(scroll("horizontal"),elem.children[0]);
        elem.vscroll = elem.insertBefore(scroll("vertical"),elem.children[0]);
        elem.initialized = false;
        elem.autoscroll = false;
        elem.scrolltimer = null;
        elem.getVScrollMax = function(){return vmax};
        elem.getHScrollMax = function(){return hmax};
        elem.addEventListener("myscroll",function(event){
            if (event.detail == 0) {
                this.vscroll.style.top = (this.scrollTop*(1+vq)).toString()+"px";
            }
            else {
                this.hscroll.style.left = (this.scrollLeft*(1+hq)).toString()+"px";
            }
          }.bind(elem));
        elem.scrollYBy = function(by){
          var cst = this.scrollTop;
          this.scrollTop = ((cst+by)>=(vmax))?(vmax):(cst+by);
          this.dispatchEvent(new CustomEvent("myscroll",{bubbles:true,detail:0}));
          return this.scrollTop;
        };
        elem.scrollXBy = function(by){
            var cst = this.scrollLeft;
            this.scrollLeft = ((cst+by)>=(hmax))?(hmax):(cst+by);
            this.dispatchEvent(new CustomEvent("myscroll",{bubbles:true,detail:1}));
            return this.scrollLeft;
        };
        elem.AutoScroll = function(){
            if (!elem.autoscroll) return clearInterval(elem.scrolltimer);
            if (elem.autoscrollDelta.X != 0) {
                elem.scrollXBy(Math.floor(elem.autoscrollDelta.X/6));
            }
            if (elem.autoscrollDelta.Y != 0){
                elem.scrollYBy(Math.floor(elem.autoscrollDelta.Y/6));
            }
        };
        elem.cancelScroll = function(){
            if (this.autoscroll && (this.scrolltimer != null)) {
                clearInterval(this.scrolltimer);
                this.scrolltimer = null;
            }
            this.vscroll.isonscroll = false;
            vold = null;
            this.hscroll.isonscroll = false;
            hold = null;
        };
        elem.addEventListener("wheel",function(e){
            elem.scrollYBy(e.deltaY/4);
            e.stopPropagation();
            e.preventDefault();
        });
        elem.addEventListener("mousedown",function(e){
            elem.cancelScroll();
            if (e.srcElement == this.vscroll){
                vold = e.clientY;
            }
            else if (e.srcElement == this.hscroll){
                hold = e.clientX;
            }
            else return false;
            var sbar = e.srcElement;
            sbar.isonscroll = true;
            e.preventDefault();
        });
        elem.addEventListener("mousemove",function(e){
            if (this.vscroll.isonscroll){
                this.scrollYBy((e.clientY-vold)/vq);
                vold = e.clientY;
            }
            else if (this.hscroll.isonscroll){
                this.scrollXBy((e.clientX-hold)/hq);
                hold = e.clientX;
            }
            else if (this.autoscroll){
                var tX = Math.ceil(this.clientWidth/5),
                    tY = Math.ceil(this.clientHeight/5),
                    pX=e.offsetX,
                    pY=e.offsetY,
                    l=0;
                while(e.path[l] != this){
                    pX += e.path[l].offsetLeft;
                    pY += e.path[l].offsetTop;
                    l++;
                }
                pX -= this.scrollLeft;
                pY -= this.scrollTop;
                this.autoscrollDelta = {
                    X: (pX < tX) ? (pX-tX) : ((this.clientWidth-pX < tX) ? (tX - this.clientWidth + pX) : 0),
                    Y: (pY < tY) ? (pY-tY) : ((this.clientHeight-pY < tY) ? (tY - this.clientHeight + pY) : 0)
                }
                if (this.scrolltimer == null) this.scrolltimer = setInterval(this.AutoScroll,100);
            }
            else return false;
            e.preventDefault();
        });
        elem.addEventListener("mouseup",function(e){
          elem.cancelScroll();
          e.preventDefault();
        });
        elem.addEventListener("mouseleave",function(e){
          elem.cancelScroll();
        });
        elem.addEventListener("touchstart",function(e){
          e.preventDefault();
          e.stopPropagation();
          if (e.touches.length == 1) {
            if (this.vscroll.getAttribute("active") == "true"){
              this.vscroll.isonscroll = true;
              vstart = vold = e.changedTouches[0].clientY;
            }
            if (this.hscroll.getAttribute("active") == "true"){
              this.hscroll.isonscroll = true;
              hstart = hold = e.changedTouches[0].clientX;
            }
          }
        });
        elem.addEventListener("touchmove",function(e){
          e.preventDefault();
          e.stopPropagation();
          if (e.touches.length == 1){
            if (this.vscroll.isonscroll) {
              this.scrollYBy(vold-e.changedTouches[0].clientY);
              vold = e.changedTouches[0].clientY;
              vstart = null;
            }
            if (this.hscroll.isonscroll) {
              this.scrollXBy(hold - e.changedTouches[0].clientX);
              hold = e.changedTouches[0].clientX;
              hstart = null;
            }
          }
          else {
            elem.cancelScroll();
          }
        });
        elem.addEventListener("touchend",function(e){
          var click = false;
          if (this.vscroll.isonscroll && vstart != null) {
            if (Math.abs(vstart-e.changedTouches[0].clientY) < 8) click = true;
          }
          if (this.hscroll.isonscroll && hstart != null) {
            if (Math.abs(hstart-e.changedTouches[0].clientX) < 8) click = true;
          }
          if (click) e.srcElement.click();
          else elem.cancelScroll();
        });
        elem.addEventListener("touchcancel",function(e){
          elem.cancelScroll();
        });
        (elem.scrollupdate = function(){
          vmax = elem.scrollHeight-elem.clientHeight;
          vq = elem.clientHeight/elem.scrollHeight;
          if (vq<1) {
            elem.vscroll.setAttribute("active",true);
            elem.vscroll.style.height = ((vq*elem.clientHeight)-4).toString()+"px";
            if (elem.selected) {
              if ((elem.selected.offsetTop<this.scrollTop) ||
              (elem.selected.offsetTop>(this.scrollTop+this.offsetHeight))){
                this.scrollYBy(elem.selected.offsetTop-this.scrollTop);
              }
            }
          }
          else elem.vscroll.setAttribute("active",false);
          hmax = elem.scrollWidth-elem.clientWidth;
          hq = elem.clientWidth/elem.scrollWidth;
          if (hq<1) {
            elem.hscroll.setAttribute("active",true);
            elem.hscroll.style.width = ((hq*elem.clientWidth)-4).toString()+"px";
            if (elem.selected) {
              if ((elem.selected.offsetLeft<this.scrollLeft) ||
              (elem.selected.offsetLeft>(this.scrollLeft+this.offsetWidth))) {
                this.scrollXBy(elem.selected.offsetLeft-this.scrollLeft);
              }
            }
          }
          else elem.hscroll.setAttribute("active",false);
        })();
        elem.addEventListener("extend",elem.scrollupdate);
        elem.addEventListener("transitionend",elem.scrollupdate);
        elem.addEventListener("webkittransitionend",elem.scrollupdate);
        elem.addEventListener("otransitionend",elem.scrollupdate);
        elem.addEventListener("mouseenter",elem.scrollupdate);
        elem.addEventListener("focus",elem.scrollupdate);
    }
	return elem;
}