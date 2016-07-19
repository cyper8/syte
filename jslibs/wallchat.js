
function Wallchat(){
    if (!BASIC) return null;
    else {
        if (document.body.topbar) {
            addStyle("/styles/wallchat.css");
        }
        else return null;
    }
}