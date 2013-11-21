goog.provide('common');

// common object
var commonObject;

function commonObject()
{
	// window
	this.director = null;
	this.scene = null;
	this.bgLayer = null;
	this.commonLayer = null;
	
	// resource
	this.resource = null;
	
	// heart
	this.heartNum = 6;
	this.heartRemainTime = HEART_WAITING_TIME;
	this.heartRemainTimeLable = null;
	
	return this;
}

common.init = function()
{
	console.log('[common] commonInit');
	
	commonObject = new commonObject();
	
	//next step
	common.createWindow();
};

common.createWindow = function()
{
	// create window
	commonObject.director = new lime.Director(document.body, SCREEN_WIDTH, SCREEN_HEIGHT);
	commonObject.scene = new lime.Scene();
	
	// bg Layer (temp)
	commonObject.bgLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	commonObject.scene.appendChild(commonObject.bgLayer);
	
	//common Layer
	commonObject.commonLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	commonObject.scene.appendChild(commonObject.commonLayer);	
	
	// replace scene	
	commonObject.director.makeMobileWebAppCapable();	
	commonObject.director.replaceScene(commonObject.scene);	
	
	console.log('[common] create window done');
	
	//next step
	resource.commonResourceInit();
};

common.applyResource = function()
{
	// background rect
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(SCREEN_WIDTH, SCREEN_HEIGHT).setFill("#000000");
	commonObject.bgLayer.appendChild(rect);
	
	// heart & remain time
	var outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 30).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, 10).setRadius(5);
	var inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 28).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, 11).setRadius(5);
	commonObject.commonLayer.appendChild(outer);
	commonObject.commonLayer.appendChild(inner);
	// heart
	common.updateHeart(5);
	// remain time
	commonObject.heartRemainTimeLable = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(1, 0).setPosition(PUZZLE_X+FRAME_WIDTH*BOARD_SIZE-10, 12);
	common.updateHeartRemainTime();
	lime.scheduleManager.scheduleWithDelay(common.updateHeartRemainTime, this, 1000);
	commonObject.commonLayer.appendChild(commonObject.heartRemainTimeLable);
	
	rect = outer = inner = null;	
	
	console.log('[common] apply resource done');
		
	//next step
	raise.init();
};

common.updateHeart = function(h)
{
	commonObject.heartNum = h;
		
	for (var i = 0 ; i < MAX_HEART_NUM ; i++)
	{
		if (i < h)
		{
			commonObject.commonLayer.appendChild(commonObject.resource.heart[i].setAnchorPoint(0, 0).setPosition(PUZZLE_X+1+(i*28), 12).setSize(27, 27));//.setPosition(PUZZLE_X+1+(i*28), 11));
			
		}
		else
		{
			commonObject.commonLayer.removeChild(commonObject.resource.heart[i]);
		}
	}
	
	console.log('[common] update heart done - heartNum:', commonObject.heartNum);
};

common.updateHeartRemainTime = function()
{
	if (commonObject.heartRemainTime == 0)
	{
		commonObject.heartRemainTime = HEART_WAITING_TIME;
		if (commonObject.heartNum+1 < MAX_HEART_NUM)
		{
			common.updateHeart(commonObject.heartNum+1);
		}
	}
	var min, sec;
	min = Math.floor((commonObject.heartRemainTime)/60);
	sec = (commonObject.heartRemainTime)%60;
	commonObject.heartRemainTimeLable.setText("Remain Time "+min+":"+(sec >= 10 ? sec : "0"+sec));
	
	commonObject.heartRemainTime--;
	min = sec = null;
};
