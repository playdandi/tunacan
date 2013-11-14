goog.provide('timer');

//timer progress
var curTime, maxTime;
var time_lbl;
var time_left;

var showHint;
var hintTime;
var hintFlag;


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
    console.log(hintTime);
    if (hintTime >= 3000)
    {
    	hintFlag = true;
    }
	if (showHint == false && hintFlag == true)
	{
		showHint = true;
				
		if (hint_direction == 0)
		{
			hintImage.setAnchorPoint(0, 0).setPosition(0, hint_line*frameHeight);
		}
		else
		{
			hintImage.setAnchorPoint(0, 1).setRotation(-90).setPosition(hint_line*frameWidth, 0);
		}		
		puzzleLayer.appendChild(hintImage);
		
		lime.scheduleManager.scheduleWithDelay(timer.removeHintTime, this, 1000, 1);
	}
	
};

timer.setHintTime = function() {
	hintTime = 0;
};

timer.removeHintTime = function() {
	puzzleLayer.removeChild(hintImage);
	showHint = false;
	hintFlag = false;
	hintTime = 0;
};
