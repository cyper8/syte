var colors = ["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107",
                "#FF9800","#FF5722","#795548","#9E9E9E","#607D8B"];
var startcolor = Math.floor(Math.random()*colors.length);
function chat(root){
    if (!BASIC) return null;
    if (!document.cookies) {
        document.cookies = new CookieStack();
    }

    if (!document.cookies.cookiesallowed) return null;

    var defaultprogress = document.body.mainprogress || false;
    function UserButton(username){
        var userbutton = new Switchable(new label(".user#"+username,username));
        userbutton.color = function(c){
            this.color = c;
            this.style.borderColor = c;
        }
        //userbutton.sticky = true;
        userbutton.switch = function(state){
            if (state) {
                chat.setuser(this.getAttribute("value"));
                document.cookies.add({name:"user",value:this.getAttribute("value"),expires:"inf"});
            }
            else {
                chat.setuser("");
                document.cookies.remove("user");
            }
        }
        return userbutton
    }

    function Users(){
        var users = new selector("#users");
        users.fill = function(){
            document.networking.request({
                url: "/cgi-bin/chat.cgi?users",
                method: "GET",
                resulthandler: function(xhr){
                    if (xhr.responseText == "FAIL") return null;
                    var userarray = JSON.parse(xhr.response);
                    for (var i=0; i<userarray.length; i++){
                        (users.append(new UserButton(userarray[i]))).color(colors[((startcolor+i)%colors.length)]);
                    }
                    if (document.cookies.user) {
                        users.selected = users[document.cookies.user].toggle(true);
                    }
                },
                progresshandler: defaultprogress
            })            
        }
        users.fill();
        return users;
    }


    function Composer(){
        var composer = new section(".composer#composer");
        composer.append(new element("textarea.msginput#newmsg"));
        composer.newmsg.wrap = "soft";
        composer.newmsg.placeholder = "Enter your message here.";
        composer.newmsg.multiline=true;
        composer.newmsg.addEventListener("keydown",function(e){
            var k = e.keyCode || e.which;
            if (k == 13) {
                composer.send();
            }
        });
        composer.append(composer.sendbutton=new PushButton("Send"));
        composer.sendbutton.action = composer.send = function(){
            document.networking.request({
                url: "/cgi-bin/chat.cgi",
                method: "POST",
                params: ","+JSON.stringify({
                    author: chat.users.selected.getAttribute("value"),
                    text: composer.newmsg.value,
                    id: chat.messenger.wall
                }),
                resulthandler: function(xhr){
                    if (xhr.responseText == "FAIL") alert("Message not sent");
                },
                progresshandler: defaultprogress
            });
            composer.newmsg.value = "";
        }
        return composer
    }

    function Messenger(){
        var messenger = Scrollable(new section(".messenger#messenger"));
	
	function Message(msgobj){
	    var mesg = new section(".message#msg"+msgobj.id.toString());
	    mesg.setAttribute("author",(msgobj.author == chat.user?"Me":msgobj.author));
	    mesg.innerText = msgobj.text;
	    mesg.style.borderColor = chat.users[msgobj.author].color;
	    return mesg
	}

        messenger.wall = document.cookies.msgcount || 0;
	messenger.appendMsg = function(msg){
	    var nm = this.append(new Message(msg));
	    this.scrollYBy(this.getVScrollMax());
	    return nm;
	}
	messenger.update = function(wallobj){
            if (chat.parentNode.classList.contains("selected")) chat.unread = 0;
            for (var i = this.getElementsByClassName("message").length; i<wallobj.length; i++){
                this.appendMsg(wallobj[i]);
                if (i>this.wall) chat.unread++;
            }
            this.wall = document.cookies.add({name:"msgcount",value:wallobj.length,expires:"inf"});
        }
        document.timer.add(function(){
            document.networking.request({
                url: "/cgi-bin/chat.cgi",
                method: "GET",
                resulthandler: function(xhr){
                    if (xhr.response != "FAIL") chat.messenger.update(JSON.parse("["+xhr.response.toString()+"]"));
                }
            })
        },[],5000,-1);
        return messenger;
    }

    var chat = new section(".chat.toolbar#chat");

    chat.setAttribute("logged","false");
    chat.setuser = function(u){
        if (u != ""){
            var msgs = document.getElementsByClassName("message");
            for (var m=0;m<msgs.length;m++){
                if (msgs[m].getAttribute("author") == u) {
                    msgs[m].setAttribute("author","Me")
                }
            }
            this.setAttribute("logged","true");
            this.parentNode.setAttribute("user",u);
        }
        else {
            var msgs = document.getElementsByClassName("message");
            for (var m=0;m<msgs.length;m++){
                if (msgs[m].getAttribute("author") == "Me") {
                    msgs[m].setAttribute("author",this.user)
                }
            }
            this.setAttribute("logged","false");
            this.parentNode.removeAttribute("user");            
        }
        this.user = u;
    }
    if (typeof root === "object") {
        if (root.insert) root.insert(chat);
        else if (root.appendChild) root.appendChild(root.chat = chat);
        if (root.setAttribute) {
	    chat.__defineSetter__("unread",root.setAttribute.bind(root,"unread"));
	    chat.__defineGetter__("unread",root.getAttribute.bind(root,"unread"));
	}
	chat.unread = 0;
    }
    chat.append(new Users());
    chat.append(new Messenger());
    chat.append(new Composer());
    chat.addEventListener("click",function(e){e.stopPropagation()});
    return chat
}
