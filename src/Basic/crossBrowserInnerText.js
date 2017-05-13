/* global  Element, HTMLElement */

var $E=Element,$HE=HTMLElement,$F=Function,$p="prototype";

if (!$HE[$p].hasOwnProperty("innerText")) {
	$HE[$p].__defineSetter__("innerText",function(v){return this.textContent = v});
	$HE[$p].__defineGetter__("innerText",function(){return this.textContent});
}