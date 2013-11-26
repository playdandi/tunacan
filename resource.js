goog.provide('resource');

goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');
goog.require('lime.Sprite');

var commonResourceisLoaded = false;
var puzzleResourceisLoaded = false;
var raiseResourceisLoaded = false;

function commonResources()
{
	// resources
	this.heartImg;
	
	// resourece count
	this.loadedResourceCnt;
	
	// sprite or frames
	this.heart = new Array(MAX_HEART_NUM);
	
	return this;
}

function puzzleResources()
{
	// resources
	this.resImg;
	this.resImgIngre;
	this.hintImg;
	this.hintSpImg;
	
	// resources count
	this.loadedResourceCnt;
	
	// sprite or frames
	this.hint;
	this.hintSp;
	this.frames = new Array(NUM_OF_TYPES+1);
	this.framesIngre = new Array(NUM_OF_TYPES+1);
	
	return this;
};

function raiseResources()
{
	// resources
	this.buttionStartPuzzleImg;
	
	// resources count
	this.loadedResourceCnt;
	
	// sprite or frames
	this.buttonStartPuzzle;
	
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
	puzzleGame.resource.hintSpImg = new lime.fill.Image('assets/hint_one.png');
	
	// resource event listener
	puzzleGame.resource.hintImg.addEventListener('load', puzzleResourceLoadComplete, false);
	puzzleGame.resource.hintSpImg.addEventListener('load', puzzleResourceLoadComplete, false);
	puzzleGame.resource.resImg.addEventListener('load', puzzleResourceLoadComplete, false);
	puzzleGame.resource.resImgIngre.addEventListener('load', puzzleResourceLoadComplete, false);
};

/*
 * 
 */
resource.puzzleResourceTerminate = function()
{
	puzzleGame.resource.loadedResourceCnt = null;
	puzzleGame.resource.resImg = null;
	puzzleGame.resource.resImgIngre = null;
	puzzleGame.resource.hintSpImg = null;
	puzzleGame.resource.hintImg = null;
	puzzleGame.resource.hint = null;
	puzzleGame.resource.frames = null;
	puzzleGame.resource.framesIngre = null;
	
	puzzleGame.resource = null;
};

/*
 * 
 */
function puzzleResourceLoadComplete()
{
	puzzleGame.resource.loadedResourceCnt++;
	if (puzzleGame.resource.loadedResourceCnt == PUZZLE_TOTAL_RESOURCE_COUNT)
	{
		// make Sprites or Frames
		var resImgElem = puzzleGame.resource.resImg.getImageElement();
		var resImgIngreElem = puzzleGame.resource.resImgIngre.getImageElement();
		puzzleGame.resource.hint = new lime.Sprite().setFill(new lime.fill.Frame(puzzleGame.resource.hintImg.getImageElement(), 0, 0, 441, 63));		
		puzzleGame.resource.hintSp = new lime.Sprite().setFill(new lime.fill.Frame(puzzleGame.resource.hintSpImg.getImageElement(), 0, 0, 63, 63));
		
		for (var i = 1; i <= NUM_OF_TYPES; i++)
		{
			puzzleGame.resource.frames[i] = new lime.fill.Frame(resImgElem, FRAME_WIDTH*(i-1), 0, FRAME_WIDTH, FRAME_HEIGHT);
			puzzleGame.resource.framesIngre[i] = new lime.fill.Frame(resImgIngreElem, FRAME_WIDTH*(i-1), 0, FRAME_WIDTH, FRAME_HEIGHT);
		}
		
		puzzleResourceisLoaded = true;
		
		// finish loading page & start puzzle.
		console.log('[resource] puzzle resource loading done');
		puzzle.puzzleStart();
		board.create();
	}
}

/*
 * 
 */
resource.commonResourceInit = function()
{
	commonObject.resource = new commonResources();
	
	// load resources
	commonObject.resource.loadedResourceCnt = 0;
	commonObject.resource.heartImg = new lime.fill.Image('assets/heart.png');
	
	// resource event listener
	commonObject.resource.heartImg.addEventListener('load', commonResourceLoadComplete, false);
};

/*
 * 
 */
function commonResourceLoadComplete()
{
	commonObject.resource.loadedResourceCnt++;
	if (commonObject.resource.loadedResourceCnt == COMMON_TOTAL_RESOURCE_COUNT)
	{
		/// make Sprites or Frames
		for (var i = 0 ; i < MAX_HEART_NUM ; i++)
		{
			commonObject.resource.heart[i] = new lime.Sprite().setFill(new lime.fill.Frame(commonObject.resource.heartImg.getImageElement(), 0, 0, 96, 83));
		}
		
		commonResourceisLoaded = true;
				
		// finish loading page & start puzzle.
		console.log('[resource] common resource loading done');
		
		// next step
		common.applyResource();
	}
}

/*
 * 
 */
resource.raiseResourceInit = function()
{
	raiseObject.resource = new raiseResources();
	
	// load resources
	raiseObject.resource.loadedResourceCnt = 0;
	raiseObject.resource.buttonStartPuzzleImg = new lime.fill.Image('assets/button_start_puzzle.png');
	
	// resource event listener
	raiseObject.resource.buttonStartPuzzleImg.addEventListener('load', raiseResourceLoadComplete, false);
};

/*
 * 
 */
resource.raiseResourceTerminate = function()
{
	raiseObject.resource.loadedResourceCnt = null;
	raiseObject.resource.buttonStartPuzzleImg = null;
	raiseObject.resource.buttonStartPuzzle = null;
	
	raiseObject.resource = null;
};

/*
 * 
 */
function raiseResourceLoadComplete()
{
	raiseObject.resource.loadedResourceCnt++;
	if (raiseObject.resource.loadedResourceCnt == RAISE_TOTAL_RESOURCE_COUNT)
	{
		/// make Sprites or Frames
		raiseObject.resource.buttonStartPuzzle = new lime.Sprite().setFill(new lime.fill.Frame(raiseObject.resource.buttonStartPuzzleImg.getImageElement(), 0, 0, 250, 70));
		
		raiseResourceisLoaded = true;
				
		// finish loading page & start puzzle.
		console.log('[resource] raise resource loading done');
		
		raiseObject.resource.buttonStartPuzzleImg.removeEventListener('load', raiseResourceLoadComplete, false);
		
		// next step
		raise.applyResource();
	}
}