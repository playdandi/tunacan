goog.provide('resource');

goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');


function puzzleResources()
{
	// resources
	this.resImg;
	this.resImgIngre;
	this.hintImg;
	
	// resources count
	this.loadedResourceCnt;
	
	// sprite or frames
	this.hint;
	this.frames = new Array(NUM_OF_TYPES+1);
	this.framesIngre = new Array(NUM_OF_TYPES+1);
	
	return this;
};

/*
 * 
 */
resource.puzzleResourceInit = function()
{
	puzzleGame.resource = new puzzleResources();
	
	// load resources
	puzzleGame.resource.loadedResourceCnt = 0;
	puzzleGame.resource.resImg = new lime.fill.Image('assets/puzzle_icon.png');
	puzzleGame.resource.resImgIngre = new lime.fill.Image('assets/puzzle_icon_ingredient.png');
	puzzleGame.resource.hintImg = new lime.fill.Image('assets/hint.png');
	
	// resource event listener
	puzzleGame.resource.hintImg.addEventListener('load', puzzleResourceLoadComplete, false);
	puzzleGame.resource.resImg.addEventListener('load', puzzleResourceLoadComplete, false);
	puzzleGame.resource.resImgIngre.addEventListener('load', puzzleResourceLoadComplete, false);
};

/*
 * 
 */
function puzzleResourceLoadComplete()
{
	puzzleGame.resource.loadedResourceCnt++;
	if (puzzleGame.resource.loadedResourceCnt == TOTAL_RESOURCE_COUNT)
	{
		// make Sprites or Frames
		var resImgElem = puzzleGame.resource.resImg.getImageElement();
		var resImgIngreElem = puzzleGame.resource.resImgIngre.getImageElement();
		puzzleGame.resource.hint = new lime.Sprite().setFill(hintImg);
		
		for (var i = 1; i <= NUM_OF_TYPES; i++)
		{
			puzzleGame.resource.frames[i] = new lime.fill.Frame(resImgElem, FRAME_WIDTH*(i-1), 0, FRAME_WIDTH, FRAME_HEIGHT);
			puzzleGame.resource.framesIngre[i] = new lime.fill.Frame(resImgIngreElem, FRAME_WIDTH*(i-1), 0, FRAME_WIDTH, FRAME_HEIGHT);
		}
		
		// finish loading page & start puzzle.
		console.log('resource loading done');
		board.create();
	}
}