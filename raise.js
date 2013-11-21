goog.provide('raise');

// raise object
var raiseObject;

function raiseObject()
{
	// window
	this.rankingLayer = null;
	this.menuLayer = null;
	
	// resource
	this.resource = null;
		
	return this;
}

raise.init = function()
{
	console.log('[raise] commonInit');
	
	raiseObject = new raiseObject();
	
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
	resource.raiseResourceInit();
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
	resource.raiseResourceTerminate();
	raiseObject.resource = null;
	
	// heart update
	common.updateHeart(commonObject.heartNum-1);
	
	// next step
	puzzle.init();
};
