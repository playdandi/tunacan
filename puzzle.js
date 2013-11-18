goog.provide('puzzle');

function puzzleGame()
{
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
	
	var board = new boardInfo(BOARD_SIZE);
}

var puzzleGame;

puzzle.init = function()
{
	puzzleGame = new puzzleGame();
	
	console.log('puzzleStart');
	var director = new lime.Director(document.body, SCREENWIDTH, SCREENHEIGHT);
	var scene = new lime.Scene();
	
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(SCREENWIDTH, SCREENHEIGHT).setFill("#000000");
	var mask = new lime.Sprite().setAnchorPoint(0, 0).setSize(frameWidth*BOARD_SIZE, frameHeight*BOARD_SIZE).setPosition(PUZZLE_X, PUZZLE_Y);
	
	puzzleLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y);
	puzzleLayer.setMask(mask);
	
	//game_info.init();
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
	numOfGetPieces = new Array(numOfTypes+1); // 개수 초기화
	for (var i = 0; i < numOfTypes+1; i++)
		numOfGetPieces[i] = 0;
	//game_info.updateGetPieces();
	
	//timer progress bar
	timer.createProgressBar();
	progressBar.setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y-20);
	infoLayer.appendChild(progressBar);
	
	
	
	board = null;
	boardInit(null, null);
	
	bgLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	bgLayer.appendChild(rect);
		
    lime.scheduleManager.scheduleWithDelay(timer.updateTime, this, 100);
	
	scene.appendChild(bgLayer);
	scene.appendChild(infoLayer);
	
	scene.appendChild(mask);
	scene.appendChild(puzzleLayer);
	director.makeMobileWebAppCapable();	
	director.replaceScene(scene);
		
	allowUserForceDrag(mask);
	
	resource.puzzleResourceInit();
};


