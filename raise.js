goog.provide('raise');

// raise object
var raiseObject;

function raiseObject()
{
	// window
	this.rankingLayer = null;
	this.menuLayer = null;
	
	// ranking
	this.resultScoreLabel = null;
	this.rankingList = null;
	
	// resource
	this.resource = null;
		
	return this;
}

raise.init = function()
{
	console.log('[raise] commonInit');
		
	if (!raiseResourceisLoaded)
	{
		raiseObject = new raiseObject();
	}
	
	//next step
	raise.createWindow();
};

raise.createWindow = function()
{
	// ranking Layer
	raiseObject.rankingLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	commonObject.scene.appendChild(raiseObject.rankingLayer);
	
	// menuLayer Layer
	raiseObject.menuLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	commonObject.scene.appendChild(raiseObject.menuLayer);
		
	console.log('[raise] create window done');
	
	//next step
	if (!raiseResourceisLoaded)
	{
		resource.raiseResourceInit();
	}
	else
	{
		raise.applyResource();
	}
};

raise.applyResource = function()
{
	var outer, inner;
	
	// ranking rect	
	var outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 628).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, 50).setRadius(5);
	var inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 626).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, 51).setRadius(5);
	raiseObject.rankingLayer.appendChild(outer);
	raiseObject.rankingLayer.appendChild(inner);
	
	// menu rect
	var outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 70).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, 688).setRadius(5);
	var inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 68).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, 689).setRadius(5);
	raiseObject.menuLayer.appendChild(outer);
	raiseObject.menuLayer.appendChild(inner);
	
	// menu button
	raiseObject.menuLayer.appendChild(raiseObject.resource.buttonStartPuzzle.setAnchorPoint(0.5, 0.5).setPosition(SCREEN_WIDTH/2, 723).setSize(250, 65));
	
	// result score
	raiseObject.resultScoreLabel = new lime.Label().setFontColor('#ffffff').setFontSize(30).setAnchorPoint(0.5, 0.5).setPosition(SCREEN_WIDTH/2, 80).setSize(FRAME_WIDTH*BOARD_SIZE, 23).setMultiline(false).setAlign("center");
	raiseObject.rankingLayer.appendChild(raiseObject.resultScoreLabel);
	if (commonObject.beforeScore != null)
	{
		raiseObject.resultScoreLabel.setText("Your Score : "+commonObject.beforeScore);
	}
	else
	{
		raiseObject.resultScoreLabel.setText("");
	}
	
	// ranking List
	raiseObject.resultScoreLabel = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(0.5, 0).setPosition(SCREEN_WIDTH/2, 220).setSize(FRAME_WIDTH*BOARD_SIZE-200, 300).setMultiline(true).setAlign("left");
	raiseObject.rankingLayer.appendChild(raiseObject.resultScoreLabel);
	raise.rankUpdate();
	
	outer = inner = null;	
	
	console.log('[raise] apply resource done');
		
	//next step
	raise.standby();	
};

raise.standby = function()
{
	userInput.raiseInputEvent(raiseObject.resource.buttonStartPuzzle);
};

raise.clickByStartPuzzle = function()
{
	// terminate by raise
	raiseObject.rankingLayer.removeAllChildren();
	commonObject.scene.removeChild(raiseObject.rankingLayer);
	raiseObject.menuLayer.removeAllChildren();
	commonObject.scene.removeChild(raiseObject.menuLayer);
	
	goog.events.removeAll(raiseObject.resource.buttonStartPuzzle);
	
	// heart update
	common.updateHeart(commonObject.heartNum-1);
	
	// next step
	puzzle.init();
};

raise.rankUpdate = function()
{
	var value = "";
	value += "- Top Ranking -\n";
	value += "1. aaaa / 10000\n";
	value += "2. aasdfa / 9000\n";
	value += "3. aaafdha / 8000\n";
	value += "4. aadfaa / 700\n";
	value += "5. aefwgfaaa / 600\n";
	value += "6. aaadfa / 500\n";
	value += "7. aadfaa / 400\n";
	value += "8. aadfdfaa / 300\n";
	value += "9. aaewaa / 200\n";
	value += "10. werfaaaa / 100\n";
	raiseObject.resultScoreLabel.setText(value);
};