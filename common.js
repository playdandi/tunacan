goog.provide('common');

// common object
var commonObject;

function commonObject()
{
	// window
	this.director = null;
	this.scene = null;
	this.commonLayer = null;
	
	// resource
	this.resource = null;
	
	// heart
	this.heartNum = 6;
	this.heartRemainTime = 60*12;
	
	return this;
}

common.init = function()
{
	console.log('[common] commonInit');
	
	commonObject = new commonObject();
	
	//next step
	resource.commonResourceInit();
};

common.createWindow = function()
{
	// create window
	commonObject.director = new lime.Director(document.body, SCREEN_WIDTH, SCREEN_HEIGHT);
	commonObject.scene = new lime.Scene();
	
	// bg Layer (temp)
	var bgLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(SCREEN_WIDTH, SCREEN_HEIGHT).setFill("#000000");
	bgLayer.appendChild(rect);
	commonObject.scene.appendChild(bgLayer);
	
	// replace scene	
	commonObject.director.makeMobileWebAppCapable();	
	commonObject.director.replaceScene(commonObject.scene);
	
	//common Layer
	commonObject.commonLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	commonObject.scene.appendChild(commonObject.commonLayer);
	
	// heart
	outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 30).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, 10).setRadius(5);
	inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 28).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, 11).setRadius(5);
	commonObject.commonLayer.appendChild(outer);
	commonObject.commonLayer.appendChild(inner);
	common.updateHeart(MAX_HEART_NUM);
	
	console.log('[common] create window done');	
	
	//next step
	//puzzle.init();
};

common.updateHeart = function(h)
{
	console.log('update_heart start');
	commonObject.heartNum = h;
	
	commonObject.resource.heart.setAnchorPoint(0, 0).setPosition(PUZZLE_X+1, 12);
	commonObject.commonLayer.appendChild(commonObject.resource.heart);
	
	/*for (var i = 0 ; i < MAX_HEART_NUM ; i++)
	{
		if (i < h)
		{
			//commonObject.commonLayer.appendChild(commonObject.resource.heart[i].setAnchorPoint(0, 0));//.setPosition(PUZZLE_X+1+(i*28), 11));
			
		}
		else
		{
			commonObject.commonLayer.removeChild(commonObject.resource.heart[i]);
		}
	}
	*/
};
