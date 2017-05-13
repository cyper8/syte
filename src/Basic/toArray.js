/* basic/toArray.js */

export default function(is){
  if (!is.length) return [];
  if (is instanceof Array) return is;
  var i=is.length;
  var a=new Array(i);
  while (i--){
    a[i] = is[i];
  }
  return a;
};