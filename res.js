goog.provide('res');

goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');

// resources
var resImg;
var resImgIngre;
var hintImg;
var infoWindowImg;

// resources cnt
var totalResourceCnt = 3; // resource 개수
var loadedResourceCnt;

// sprite or frames
var hint;
var info_window;
var frames = new Array(7);
var framesIngre = new Array(7);
var frameWidth = 63;
var frameHeight = 63;


res.init = function() {
	// load resources
	loadedResourceCnt = 0;
	resImg = new lime.fill.Image('assets/puzzle_icon.png');
	resImgIngre = new lime.fill.Image('assets/puzzle_icon_ingredient.png');
	hintImg = new lime.fill.Image('assets/hint.png');
	//infoWindowImg = new lime.fill.Image('assets/info_window.png');
	
	// resource event listener
	hintImg.addEventListener('load', resourceLoadComplete, false);
	resImg.addEventListener('load', resourceLoadComplete, false);
	resImgIngre.addEventListener('load', resourceLoadComplete, false);
	//infoWindowImg.addEventListener('load', resourceLoadComplete, false);
};


function resourceLoadComplete() {
	loadedResourceCnt++;
	if (loadedResourceCnt >= totalResourceCnt)
	{
		// make Sprites or Frames
		var resImgElem = resImg.getImageElement();
		var resImgIngreElem = resImgIngre.getImageElement();
		hint = new lime.Sprite().setFill(hintImg);
		//info_window = new lime.Sprite().setFill(infoWindowImg);
		
		for (var i = 1; i <= 6; i++) {
			frames[i] = new lime.fill.Frame(resImgElem, frameWidth*(i-1), 0, frameWidth, frameHeight);
			framesIngre[i] = new lime.fill.Frame(resImgIngreElem, frameWidth*(i-1), 0, frameWidth, frameHeight);
		}
		
		// finish loading page & start puzzle.
		console.log('resource loading done');
		tunacan.puzzleStart();
	}
}

res.createPiece = function(index, ingredient) {	
	var p = new piece();
	
	// type
	index = (index > 0) ? index : res.getRandomNumber(6) + 1;
	p.type = index;
	// ingredient
	if (ingredient != null) // scroll 때는 기존의 piece를 그대로 들고온다.
		p.ingredient = ingredient;
	else
		p.ingredient = (Math.floor(Math.random() * 100) < INGREDIENT_PROBABILITY) ? true : false;
	// image
	if (p.ingredient)
		p.img = new lime.Sprite().setFill(framesIngre[index]).setAnchorPoint(0, 0);
	else
		p.img = new lime.Sprite().setFill(frames[index]).setAnchorPoint(0, 0);
		
	return p;
};

res.getRandomNumber = function(max) { // return integer between (0 <= value < max).
	return Math.floor(Math.random() * max);
};


