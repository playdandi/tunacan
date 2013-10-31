goog.provide('res');
/*
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
*/
goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');

var frames = new Array();

res.init = function() {
	var resImg = new lime.fill.Image('../puzzle_icon.png');
	var resImgElem = resImg.getImageElement();
	
	for (var i = 0; i < 6; i++)
		frames.push( new lime.fill.Frame(resImgElem, 63*i, 0, 63, 63) );
};

res.createImageByRandom = function () {
	var index = res.getRandomNumber(6);
	
	return {'type' : index, 'image' : new lime.Sprite().setFill(frames[index]).setAnchorPoint(0, 0)};
	//return new lime.Sprite().setFill( frames[index] ).setAnchorPoint(0, 0);
};
	
res.getRandomNumber = function(max) { // return integer between (0 <= value < max).
	return Math.floor(Math.random() * max);
};

