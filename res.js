goog.provide('res');

goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');

var frames = new Array(7);

res.init = function() {
	var resImg = new lime.fill.Image('assets/puzzle_icon.png');
	var resImgElem = resImg.getImageElement();
	
	for (var i = 1; i <= 6; i++)
		frames[i] = new lime.fill.Frame(resImgElem, 63*(i-1), 0, 63, 63);
};

res.createImageByRandom = function () {
	var index = res.getRandomNumber(6) + 1;
	
	return {'type' : index, 'image' : new lime.Sprite().setFill(frames[index]).setAnchorPoint(0, 0)};
};

res.createImage = function (index) {	
	return {'type' : index, 'image' : new lime.Sprite().setFill(frames[index]).setAnchorPoint(0, 0)};
};
	
res.getRandomNumber = function(max) { // return integer between (0 <= value < max).
	return Math.floor(Math.random() * max);
};

