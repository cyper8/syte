/* basic/Broadcast.js */

/* global Element */

import toA from 'toArray.js';

var $E=Element, $p = 'prototype';

$E[$p].addBCListener = function(msg,act){
	return Object.defineProperty(this,msg,{
	  value: act.bind(this),
	  configurable: true,
	  enumerable: true,
	  writable: true
	});
};
$E[$p].removeBCListener = function(msg){
  delete this[msg];
  return this;
}
$E[$p].broadcast = function(){ // and some arguments
	try {
		if (typeof this[arguments[0]] === "function") {
		  this[arguments[0]].apply(this,toA(arguments).slice(1));
		}
	}
	catch (err) {throw err}
	finally {
		for (var i=0;i<this.children.length;i++) {
			this.children[i].broadcast.apply(this.children[i],arguments);
		}
		return this;
	}
};