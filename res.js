goog.provide('res');

goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');

var frameWidth = 63;
var frameHeight = 63;
var frames = new Array(7);
var framesIngre = new Array(7);
var fishing;
var hint;

res.init = function() {
	fishing = new lime.fill.Image('assets/fising.png');
	hint = new lime.fill.Image('assets/hint.png');
	
	var resImg = new lime.fill.Image('assets/puzzle_icon.png');
	var resImgElem = resImg.getImageElement();
	
	var resImgIngre = new lime.fill.Image('assets/puzzle_icon_ingredient.png');
	var resImgIngreElem = resImgIngre.getImageElement();
	
	for (var i = 1; i <= 6; i++) {
		frames[i] = new lime.fill.Frame(resImgElem, frameWidth*(i-1), 0, frameWidth, frameHeight);
		framesIngre[i] = new lime.fill.Frame(resImgIngreElem, frameWidth*(i-1), 0, frameWidth, frameHeight);
	}
};

res.createPiece = function(index, ingredient) {
	index = (index > 0) ? index : res.getRandomNumber(6) + 1;
	var p = new piece();
	p.type = index;
	p.ingredient = (Math.floor(Math.random() * 100) < INGREDIENT_PROBABILITY) ? true : false;
	if (p.ingredient)
		p.img = new lime.Sprite().setFill(framesIngre[index]).setAnchorPoint(0, 0);
	else
		p.img = new lime.Sprite().setFill(frames[index]).setAnchorPoint(0, 0);
	return p;
};

res.getRandomNumber = function(max) { // return integer between (0 <= value < max).
	return Math.floor(Math.random() * max);
};


