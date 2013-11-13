goog.provide('timer');


//timer progress
var curTime, maxTime;
var time_lbl;
var time_left;

var showHint;
var hintTime;

timer.decreaseTime = function() {
    curTime--;
    if (curTime < 1) {
       // this.endGame();
    }
    time_left.setText(curTime);
};

timer.setHintTime = function() {
	hintTime = 0;
};

timer.updateHintTime = function() {
	hintTime += 0.1;
	if (hintTime >= 3.0) {
		showHint = true;
		console.log('direction : ', hint_direction);
		console.log('line : ', hint_line);
	}
};
