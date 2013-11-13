goog.provide('timer');

timer.decreaseTime = function() {
    curTime--;
    if (curTime < 1) {
       // this.endGame();
    }
    time_left.setText(curTime);
};