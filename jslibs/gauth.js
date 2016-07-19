/*google auth module*/

var script = document.createElement("script");
script.type="text/javascript";
script.setAttribute("async","true");
script.setAttribute("defer","true");
document.head.appendChild(script);
script.src="https://apis.google.com/js/api:client.js?onload=GLoad";
var auth2,googleUser,s="profile email",cid="254961876008-p1ehln9iejar0ol8oq4uoeb6ln0r2ri8.apps.googleusercontent.com";
//var control = document.getElementById('gsignin');
function GLoad (){
    gapi.load('auth2',function(){
        auth2=gapi.auth2.init({
            client_id:cid,
            cookiepolicy:'single_host_origin',
            scope:s
        });
/*        control.addEventListener('click',function(){
            //auth2.grantOfflineAcess("{redirect_uri:'postmessage'}").then(userChanged,function(error){console.log(error)});
            auth2.signIn().then(userChanged,function(error){console.log(error)});
        });*/
        auth2.isSignedIn.listen(signinChanged);
        auth2.currentUser.listen(userChanged);
        if (auth2.isSignedIn.get() == true) {
            auth2.signIn();
        }
        refreshValues();
    });
}
var signinChanged = function (val) {
    console.log('Signin state changed to ', val);
//    control.innerText += '('+val+')';
};

var userChanged = function (user) {
    console.log('User now: ', user);
    googleUser = user;
    updateGoogleUser();
//    control.innerText = JSON.stringify(user, undefined, 2)+' is here.';
};

var updateGoogleUser = function () {
    if (googleUser) {
        console.log('getId(): '+googleUser.getId());
        console.log('getGrantedScopes(): '+googleUser.getGrantedScopes());
        console.log('getAuthResponse():  '+JSON.stringify(googleUser.getAuthResponse(), undefined, 2));
//        control.innerText=googleUser.getBasicProfile().getName()+' is here.';
    } else {
        console.log('(deauthenticated)');
    }
};

var refreshValues = function() {
    if (auth2){
        console.log('Refreshing values...');
        googleUser = auth2.currentUser.get();
        updateGoogleUser();
    }
}
