goog.provide('timer');

goog.require('lime.RoundedRect');
goog.require('lime.animation.Resize');
goog.require('lime.fill.LinearGradient');

//timer progress
var curTime, maxTime;

var showHint;
var hintTime;
var hintFlag;

var progressBar, progressBarFlag = false;

timer.createProgressBar = function() {
	
	progressBar = new lime.RoundedRect();

    var WIDTH = 441,
        HEIGHT = 20,
        RADIUS = 20,
        BORDER = 2;

    progressBar.setSize(WIDTH, HEIGHT).setRadius(RADIUS).setAnchorPoint(0, .5);
    progressBar.setFill(new lime.fill.LinearGradient().addColorStop(0, 0x15, 0x37, 0x62, .6).addColorStop(1, 0x1e, 0x57, 0x97, .4));

    WIDTH -= 2 * BORDER;
    HEIGHT -= 2 * BORDER;
    RADIUS = 12;

    // inner balue var
    var inner = new lime.RoundedRect().setRadius(RADIUS).setSize(WIDTH, HEIGHT).setFill('#F90').
        setAnchorPoint(0, .5).setPosition(8, 0);
    progressBar.appendChild(inner);

    progressBar.setFill(new lime.fill.LinearGradient().addColorStop(0, '#afcdef').addColorStop(.49, '#55a1fc').
        addColorStop(.5, '#3690f4').addColorStop(1, '#8dc9ff'));

    progressBar.width = WIDTH;
    progressBar.inner = inner;

};

timer.setProgressBar = function(value) {
    progressBar = value;
    progressBar.runAction(new lime.animation.Resize(this.width * value, this.inner.getSize().height).setDuration(0.04));
};

timer.updateTime = function() {
	if(progressBarFlag == false)
	{
		timer.createProgressBar();
		progressBarFlag = true;
		progressBar.setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y-30);
		infoLayer.appendChild(progressBar);
	}
	
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
    
    //time_left.setText(curTime.toFixed(1));    
    
    //hint
    hintTime += tick;
    if (hintTime >= 3000)
    {
    	hintFlag = true;
    }
	if (showHint == false && hintFlag == true)
	{
		showHint = true;
				
		if (hint_direction == 0)
		{
			hint.setAnchorPoint(0, 0).setPosition(0, hint_line*frameHeight);
		}
		else
		{
			hint.setAnchorPoint(0, 1).setRotation(-90).setPosition(hint_line*frameWidth, 0);
		}		
		puzzleLayer.appendChild(hint);
		
		lime.scheduleManager.scheduleWithDelay(timer.removeHintTime, this, 1000, 1);
	}
	
};

timer.setHintTime = function() {
	hintTime = 0;
};

timer.removeHintTime = function() {
	puzzleLayer.removeChild(hint);
	showHint = false;
	hintFlag = false;
	hintTime = 0;
};
