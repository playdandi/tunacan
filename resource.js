goog.provide('resource');

goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');

// resources
var resImg;
var resImgIngre;
var hintImg;

// resources count
var loadedResourceCnt;

// sprite or frames
var hint;
var frames = new Array(numOfTypes+1);
var framesIngre = new Array(numOfTypes+1);


/*
 * 
 */
resource.puzzleResourceInit = function()
{
	// load resources
	loadedResourceCnt = 0;
	resImg = new lime.fill.Image('assets/puzzle_icon.png');
	resImgIngre = new lime.fill.Image('assets/puzzle_icon_ingredient.png');
	hintImg = new lime.fill.Image('assets/hint.png');
	
	// resource event listener
	hintImg.addEventListener('load', puzzleResourceLoadComplete, false);
	resImg.addEventListener('load', puzzleResourceLoadComplete, false);
	resImgIngre.addEventListener('load', puzzleResourceLoadComplete, false);
};

/*
 * 
 */
function puzzleResourceLoadComplete()
{
	loadedResourceCnt++;
	if (loadedResourceCnt == totalResourceCnt)
	{
		// make Sprites or Frames
		var resImgElem = resImg.getImageElement();
		var resImgIngreElem = resImgIngre.getImageElement();
		hint = new lime.Sprite().setFill(hintImg);
		
		for (var i = 1; i <= numOfTypes; i++)
		{
			frames[i] = new lime.fill.Frame(resImgElem, FRAME_WIDTH*(i-1), 0, FRAME_WIDTH, FRAME_HEIGHT);
			framesIngre[i] = new lime.fill.Frame(resImgIngreElem, FRAME_WIDTH*(i-1), 0, FRAME_WIDTH, FRAME_HEIGHT);
		}
		
		// finish loading page & start puzzle.
		console.log('resource loading done');
		board.create();
		puzzle.puzzleStart();
	}
}