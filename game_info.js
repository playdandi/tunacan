goog.provide('game_info');

function piece() {
	this.img;
	this.type;
	this.ingredient;
	return this;
}

// puzzle pieces
var numOfTypes = 6+1;
var BOARDELEM_COW = 1;
var BOARDELEM_CABBAGE = 2;
var BOARDELEM_PEPPER = 3;
var BOARDELEM_OLIVE = 4;
var BOARDELEM_CHEESE = 5;
var BOARDELEM_TOMATO = 6;
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

var scoreLabel;
var comboLabel;
var gaugeLabel;
//var getPieces;

// board
var BOARD_SIZE = 7;
//var PUZZLE_X = 0;//(720-(frameWidth*BOARD_SIZE))/2;
//var PUZZLE_Y = 0;//(1280-(frameHeight*BOARD_SIZE))/2;
var PUZZLE_X = (SCREENWIDTH - (frameWidth * BOARD_SIZE)) / 2;
var PUZZLE_Y = SCREENHEIGHT - 100 - frameHeight * BOARD_SIZE;
//var PUZZLE_Y = (SCREENHEIGHT - (frameHeight * BOARD_SIZE)) / 2;
var board; // puzzle 2d array
var DURATION_TIME = 0.2; // puzzle piece animation duration

// lock
var lock;

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
	//info_window.setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y+frameHeight*BOARD_SIZE).setSize(50,50);
	comboLabel = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(0.5, 0.5).setPosition(SCREENWIDTH/2, PUZZLE_Y+frameHeight*BOARD_SIZE+50);
	//gaugeLabel = new lime.Label().setFontColor('#ffff00').setFontSize(30).setAnchorPoint(1, 1).setPosition(frameWidth*BOARD_SIZE, -20);
	infoLayer.appendChild(scoreLabel);
	
	var outer = new lime.RoundedRect().setSize(frameWidth*BOARD_SIZE, 80).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, PUZZLE_Y+frameHeight*BOARD_SIZE+10).setRadius(10);
	var inner = new lime.RoundedRect().setSize(frameWidth*BOARD_SIZE-6, 74).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+3, PUZZLE_Y+frameHeight*BOARD_SIZE+13).setRadius(10);
	infoLayer.appendChild(outer);
	infoLayer.appendChild(inner);
	infoLayer.appendChild(comboLabel);
	score = 0;
	combo = 0;
	gauge = 0;
	game_info.updateScore(0);
	game_info.updateCombo(0);
	//game_info.updateGauge(0);
	
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
	numOfGetPieces = new Array(numOfTypes); // 개수 초기화
	for (var i = 0; i < numOfTypes; i++)
		numOfGetPieces[i] = 0;
	//game_info.updateGetPieces();
};

game_info.updateScore = function(s) {
	score += s * 100 * combo * combo;
	scoreLabel.setText('SCORE : ' + score);
};

game_info.updateCombo = function(c) {
	combo = (c > 0) ? combo+1 : 0;
	comboLabel.setText(combo + ' COMBO!');
};

game_info.updateGauge = function(g) {
	gauge += g * 4;
	gaugeLabel.setText(gauge);
};

game_info.updateGetPieces = function(type) {
	numOfGetPieces[type]++;
};
