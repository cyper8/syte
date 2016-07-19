var WAITCLOCK = true;
function prepareWaitStyle(){

    const waitstylekeyframes = "@-webkit-keyframes waitingclock {             \
    from {-webkit-transform: rotate(0deg)}                                  \
    to {-webkit-transform: rotate(360deg)}                                  \
    }";

    const waitstyle = "div.waiting {                                          \
        position: absolute;                                                 \
        display: block;                                                     \
        z-index: 100;                                                       \
        top:0px;                                                            \
        left: 0px;                                                          \
        width: 20px;                                                        \
        height: 20px;                                                       \
        margin: 0px;                                                        \
        padding: 0px;                                                       \
        border-radius: 15px;                                                \
        visibility: hidden;                                                 \
        background-color: transparent;                                      \
        border-width: 5px;                                                  \
        border-style: solid;                                               \
        border-top-color: rgba(170,225,100,1);                              \
        border-left-color: rgba(170,225,100,0.75);                          \
        border-bottom-color: rgba(170,225,100,0.5);                         \
        border-right-color: rgba(170,225,100,0);                            \
        -webkit-transform-origin: center center;                            \
        -webkit-animation-duration: 1.5s;                                   \
        -webkit-animation-iteration-count: infinite;                        \
        -webkit-animation-timing-function: linear;                          \
        -webkit-animation-name: waitingclock;                               \
        -webkit-animation-play-state: paused;                               \
        -webkit-box-shadow: none;                                           \
    }";

    if (document.styleSheets.length == 0) {
        var css = document.createElement("style");
        css.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(css);
    }
    document.styleSheets[0].insertRule(waitstylekeyframes, document.styleSheets[0].cssRules.length);
    document.styleSheets[0].insertRule(waitstyle, document.styleSheets[0].cssRules.length);
}

function WaitClock() {
    prepareWaitStyle();
    var wait = document.createElement("div");
    wait.className = "waiting";
    wait.id = "wait";
    wait.show = function(element){
        if (element != null) {
            this.style.left = Math.floor(element.offsetLeft+((element.clientWidth - this.clientWidth)/2)).toString()+"px";
            this.style.top = Math.floor(element.offsetTop+((element.clientHeight - this.clientHeight)/2)).toString()+"px";
            this.style.WebkitAnimationPlayState = "running";
            this.style.visibility = "visible";
        }
    };
    wait.hide = function(){
        this.style.visibility = "hidden";
        this.style.WebkitAnimationPlayState = "paused";
    };
    return wait;
}
