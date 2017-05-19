export function ABtoB64(b){
    var binaryS = '';
    var bytes = new Uint8Array(b);
    var len = bytes.byteLength;
    for (var i = 0;i<len;i++){
        binaryS += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binaryS);
}