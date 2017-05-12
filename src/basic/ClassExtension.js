/* global Element, HTMLElement */

var $E=Element,$HE=HTMLElement,$F=Function,$p="prototype";

$F[$p].extends = function(parent){
	if (typeof parent === "function"){
		this[$p] = new parent();
		this[$p].constructor = this;
		this[$p].parent = parent[$p];
	}
	else {
		this[$p] = parent;
		this[$p].constructor = this;
		this[$p].parent = parent;
	}
	return this;
};