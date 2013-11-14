goog.provide('timer');

goog.require('lime.RoundedRect');
goog.require('lime.animation.Resize');
goog.require('lime.fill.LinearGradient');

//timer progress
var curTime, maxTime;

var comboTime;
var comboFlag;

var showHint;
var hintTime;
var hintFlag;

var progressBar;
//, progressBarFlag = false;

timer.createProgressBar = function() {
	
	progressBar = new lime.RoundedRect();

    var WIDTH = frameWidth*BOARD_SIZE,
        HEIGHT = 16,
        RADIUS = 20,
        BORDER = 4;

    progressBar.setSize(WIDTH, HEIGHT).setRadius(RADIUS).setAnchorPoint(0, 0.5);
    progressBar.setFill(new lime.fill.LinearGradient().addColorStop(0, 0x15, 0x37, 0x62, .6).addColorStop(1, 0x1e, 0x57, 0x97, .4));

    WIDTH -= 2 * BORDER;
    HEIGHT -= 2 * BORDER;
    RADIUS = 12;

    // inner balue var
    var inner = new lime.RoundedRect().setRadius(RADIUS).setSize(WIDTH, HEIGHT).setFill('#F90').
        setAnchorPoint(0, .5).setPosition(4, 8);
    progressBar.appendChild(inner);

    inner.setFill(new lime.fill.LinearGradient().addColorStop(0, '#afcdef').addColorStop(.49, '#55a1fc').
        addColorStop(.5, '#3690f4').addColorStop(1, '#8dc9ff'));

    progressBar.width = WIDTH;
    progressBar.inner = inner;

};

timer.setProgressBar = function(value) {
    progressBar.inner.runAction(new lime.animation.Resize(progressBar.width * value, progressBar.inner.getSize().height).setDuration(0.04));
};

timer.updateTime = function() {
	if(lock) 
	{
		return;
	}
	
	tick = 100;
    curTime -= (tick/1000);
    if (curTime < 1) {
       // this.endGame();
       curTime = maxTime;
    }
        
    // hint
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
			hint.setAnchorPoint(0, 0).setRotation(0).setPosition(0, hint_line*frameHeight);
		}
		else
		{
			hint.setAnchorPoint(0, 1).setRotation(-90).setPosition(hint_line*frameWidth, 0);
		}		
		puzzleLayer.appendChild(hint);
		
		lime.scheduleManager.scheduleWithDelay(timer.removeHintTime, this, 1000, 1);
	}
	
	// combo
	comboTime += tick;
	if (comboTime >= 2000 && combo > 0) // combo가 0일 때는 굳이 이걸 실행할 이유가 없다.
	{
		console.log('combo canceled');
		//comboFlag = true;
		game_info.updateCombo(0); // init combo to 0.
	}
	
	timer.setProgressBar(curTime / maxTime);
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
