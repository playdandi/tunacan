goog.provide('game_info');

function piece() {
	this.img;
	this.type;
	this.special;
	this.ingredient;
	return this;
}

// puzzle pieces
var numOfTypes = 7;
var PIECE_COW = 1;
var PIECE_CABBAGE = 2;
var PIECE_PEPPER = 3;
var PIECE_OLIVE = 4;
var PIECE_CHEESE = 5;
var PIECE_TOMATO = 6;
var PIECE_SPECIAL = 7;
var numOfGetPieces;
var INGREDIENT_PROBABILITY = 10;

// screen
var SCREENWIDTH = 461;
var SCREENHEIGHT = 768;

// game info
var combo;
var score;
var gauge;
var hint_direction;
var hint_line;
var hint_coord;

var scoreLabel;
var msgLabel;
var gaugeLabel;
//var getPieces;

// board
var BOARD_SIZE = 7;
var PUZZLE_X = (SCREENWIDTH - (frameWidth * BOARD_SIZE)) / 2;
var PUZZLE_Y = SCREENHEIGHT - 100 - frameHeight * BOARD_SIZE;
var board; // puzzle 2d array
var DURATION_TIME = 0.2; // puzzle piece animation duration

// lock
var lock;
var touchLock = false;

// layer
var bgLayer;
var puzzleLayer;
var infoLayer;

goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.Sprite');

game_info.init = function() {
	infoLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	//heartLabel
	scoreLabel = new lime.Label().setFontColor('#ffffff').setFontSize(30).setAnchorPoint(1, 0).setPosition(PUZZLE_X+frameWidth*BOARD_SIZE, 20);
	msgLabel = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(0.5, 0.5).setPosition(SCREENWIDTH/2, PUZZLE_Y+frameHeight*BOARD_SIZE+50).setSize(frameWidth*BOARD_SIZE).setMultiline(true);
	gaugeLabel = new lime.Label().setFontColor('#ffff00').setFontSize(30).setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y-70);
	infoLayer.appendChild(scoreLabel);
	
	var outer = new lime.RoundedRect().setSize(frameWidth*BOARD_SIZE, 80).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, PUZZLE_Y+frameHeight*BOARD_SIZE+10).setRadius(10);
	var inner = new lime.RoundedRect().setSize(frameWidth*BOARD_SIZE-6, 74).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+3, PUZZLE_Y+frameHeight*BOARD_SIZE+13).setRadius(10);
	infoLayer.appendChild(outer);
	infoLayer.appendChild(inner);
	infoLayer.appendChild(msgLabel);
	infoLayer.appendChild(gaugeLabel);
	score = 0;
	combo = 0;
	gauge = 0;
	game_info.updateScore(0);
	game_info.updateCombo(0);
	game_info.updateGauge(0);
	
	//timer progress init
	maxTime = 60;
	curTime = 60;
	tick = 0;
	
	//hint init
	showHint = false;
	hintTime = 0;
	hintFlag = false;
	
	// get pieces (퍼즐 피스 종류마다 얻은 개수 보여주는 것)	
	/*getPieces = new Array(numOfTypes);
	for (var i = 1; i < numOfTypes; i++) {
		getPieces[i] = new lime.Label().setFontColor('#ffff00').setFontSize(20).setAnchorPoint(0, 0).setPosition(0, frameHeight*BOARD_SIZE+70+i*20);
		infoLayer.appendChild(getPieces[i]);
	}*/
	numOfGetPieces = new Array(numOfTypes+1); // 개수 초기화
	for (var i = 0; i < numOfTypes+1; i++)
		numOfGetPieces[i] = 0;
	//game_info.updateGetPieces();
	
	//timer progress bar
	timer.createProgressBar();
	progressBar.setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y-20);
	infoLayer.appendChild(progressBar);
};

game_info.updateScore = function(s) {
	score += s * 100 * combo * combo;
	scoreLabel.setText('SCORE : ' + score);
};

game_info.updateCombo = function(c) {
	var msg = "";
	combo = (c > 0) ? combo+1 : 0;
	msg = combo;
	msg += " Combo! \n";
	
	if(combo == 0) msg = combo_message[0];
	else
	{
		if(combo < combo_message.length-1)
		{
			msg += combo_message[combo];
		} 
		else 
		{
			msg += combo_message[combo_message.length-1];
		}
	}
	
	msgLabel.setText(msg);
	msg = null;
};

game_info.updateGauge = function(g) {
	gauge += g * 5;
	gaugeLabel.setText(gauge);		
};

game_info.checkGauge = function() {
	if (gauge >= 100) { // full gauge
		var x, y, isExist;
		var coord = new Array();
		var numOfSpecialPieces = Math.floor(gauge / 100);

		gauge -= (100 * numOfSpecialPieces);
		gaugeLabel.setText(gauge);
		
		for (var i = 0; i < numOfSpecialPieces; i++) {
			isExist = false;
			while (1) {
				x = Math.floor(Math.random() * BOARD_SIZE);
				y = Math.floor(Math.random() * BOARD_SIZE);
				if (board[x][y].type == PIECE_SPECIAL)
					continue;
				for (var j = 0; j < coord.length; j++) {
					if (coord[j].x == x && coord[j].y == y) {
						isExist = true;
						break;
					}
				}
				if (!isExist) {
					coord.push({'x' : x, 'y' : y});
					break;
				}
			}
			board[x][y].img.setFill(frames[PIECE_SPECIAL]);
			board[x][y].type = PIECE_SPECIAL;
			board[x][y].special = Math.floor(Math.random() * numOfSpecialTypes);
			board[x][y].ingredient = false;
		}
		
		x = y = isExist = null;
		coord = null;
	}
};

game_info.updateGetPieces = function(type) {
	numOfGetPieces[type]++;
};
