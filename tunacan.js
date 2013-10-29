//set main namespace
goog.provide('tunacan');

// get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.RoundedRect');

// entry point
tunacan.start = function() {
	var director = new lime.Director(document.body, 100, 100);
	var scene = new lime.Scene();
	var layer = new lime.Layer().setAnchorPoint(0, 0);
	var circle = new lime.Circle().setAnchorPoint(0, 0).setSize(200, 200).setFill(255,150,0);
	var rr = new lime.RoundedRect().setAnchorPoint(0, 0).setPosition(200, 200).setSize(100, 100).setFill(0, 0, 0);
	
	layer.appendChild(circle);
	layer.appendChild(rr);
	
	//scene.appendChild(layer);
	scene.appendChild(circle);
	
	director.makeMobileWebAppCapable();
	
	director.replaceScene(scene);
};



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tunacan.start', tunacan.start);