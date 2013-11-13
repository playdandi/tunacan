goog.provide('timer');

//timer progress
var curTime, maxTime;
var time_lbl;
var time_left;

var showHint;
var hintTime;
var hintFlag;

var hintImage;

timer.updateTime = function() {
	
	if(lock) 
	{
		return;
	}
	
	tick = 100;
    curTime-=(tick/1000);
    if (curTime < 1) {
       // this.endGame();
       curTime = maxTime;
    }
    
    time_left.setText(curTime.toFixed(1));    
    
    //hint
    hintTime += tick;
    if (hintTime >= 3000)
    {
    	hintFlag = true;
    }
	if (showHint == false && hintFlag == true) {
		showHint = true;
				
		if (hint_direction == 0)
		{
			hintImage = new lime.Sprite().setFill(hint).setAnchorPoint(0, 0).setPosition(DEFAULT_X, DEFAULT_Y+hint_line*63);
		}
		else
		{
			hintImage = new lime.Sprite().setFill(hint).setAnchorPoint(0, 1).setRotation(-90).setPosition(DEFAULT_X+hint_line*63, DEFAULT_Y);
		}		
		layer.appendChild(hintImage);
		
		lime.scheduleManager.scheduleWithDelay(timer.removeHintTime, this, 1000, 3);
	}
	
};

timer.setHintTime = function() {
	hintTime = 0;
};

timer.removeHintTime = function() {
	layer.removeChild(hintImage);
	showHint = false;
	hintFlag = false;
	hintTime = 0;
};
