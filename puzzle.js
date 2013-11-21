goog.provide('puzzle');

// get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.RoundedRect');
goog.require('lime.fill.Fill');
goog.require('lime.animation.Resize');
goog.require('lime.fill.LinearGradient');

// puzzle game object
var puzzleGame;

function puzzleGame()
{
	// window
	this.mask = null;
	this.infoLayer = null;
	this.puzzleLayer = null;
	
	// game info
	this.scoreLabel = null;
	this.score = 0;
	this.gaugeLabel = null;
	this.gauge = 0;
	this.messageLabel = null;
	this.combo = 0;
	this.progressBar = null;
	
	// lock
	this.lock = true;
	this.touchLock = false;
	
	// board
	this.board = null;
	
	// resource
	this.resource = null;
	
	// hint
	this.hintTime = 0;
	this.hintFlag = false;	
	this.hintDirection = 0;
	this.hintLine = 0;
	this.hintCoord = 0;
	
	// timer
	this.maxTime = PUZZLE_PLAY_TIME;
	this.currentTime = PUZZLE_PLAY_TIME;
	this.tick = 100;
	this.comboTime = 0;
		
	// get pieces (퍼즐 피스 종류마다 얻은 개수 보여주는 것)	
	this.numOfGetPieces = new Array(NUM_OF_TYPES+1);
	for (var i = 0; i < NUM_OF_TYPES+1; i++)
	{
		this.numOfGetPieces[i] = 0;
	}
	
	return this;
}

puzzle.init = function()
{	
	if (!puzzleResourceisLoaded)
	{
		puzzleGame = new puzzleGame();
	}
	else
	{
		puzzle.reInit();
	}
		
	//create User Interface
	createInfoLayer();
	createBoardLayer();
	
	console.log('[puzzle] init (create infoLayer, boardLayer) done');
	
	//next step
	if (!puzzleResourceisLoaded)
	{
		resource.puzzleResourceInit();
	}
	else
	{
		puzzle.puzzleStart();
		board.create();
	}
};

puzzle.reInit = function()
{	
	// window
	puzzleGame.mask = null;
	puzzleGame.infoLayer = null;
	puzzleGame.puzzleLayer = null;
	
	// game info
	puzzleGame.scoreLabel = null;
	puzzleGame.score = 0;
	puzzleGame.gaugeLabel = null;
	puzzleGame.gauge = 0;
	puzzleGame.messageLabel = null;
	puzzleGame.combo = 0;
	puzzleGame.progressBar = null;
	
	// lock
	puzzleGame.lock = true;
	puzzleGame.touchLock = false;
	
	// board
	puzzleGame.board = null;
		
	// hint
	puzzleGame.hintTime = 0;
	puzzleGame.hintFlag = false;	
	puzzleGame.hintDirection = 0;
	puzzleGame.hintLine = 0;
	puzzleGame.hintCoord = 0;
	
	// timer
	puzzleGame.maxTime = PUZZLE_PLAY_TIME;
	puzzleGame.currentTime = PUZZLE_PLAY_TIME;
	puzzleGame.tick = 100;
	puzzleGame.comboTime = 0;
		
	// get pieces (퍼즐 피스 종류마다 얻은 개수 보여주는 것)	
	puzzleGame.numOfGetPieces = new Array(NUM_OF_TYPES+1);
	for (var i = 0; i < NUM_OF_TYPES+1; i++)
	{
		puzzleGame.numOfGetPieces[i] = 0;
	}
};

puzzle.puzzleStart = function()
{
	console.log('[puzzle] puzzleStart');
	userInput.puzzleInputEvent(puzzleGame.mask);
	lime.scheduleManager.scheduleWithDelay(puzzle.updateTime, this, puzzleGame.tick);
};

puzzle.puzzleEnd = function()
{
	console.log('[puzzle] puzzleEnd');
	
	// stop event
	lime.scheduleManager.unschedule(puzzle.updateTime, this);
	
	// terminate by raise
	puzzleGame.infoLayer.removeAllChildren();
	commonObject.scene.removeChild(puzzleGame.infoLayer);
	
	puzzleGame.puzzleLayer.removeAllChildren();
	commonObject.scene.removeChild(puzzleGame.puzzleLayer);
	
	commonObject.beforeScore = puzzleGame.score;
	
	// server connection
	var nickName = 'Gandalf, Gay';
	var socket = io.connect();
	socket.emit('puzzleEnd', {
		nickname : nickName,
		score : puzzleGame.score
	});
	socket.on('tryDisconnect', function(data) {
		console.log(data);
		socket.disconnect();
	});
	
	raise.init();
};

puzzle.puzzleReleaseLock = function()
{
	console.log('[puzzle] puzzleReleaseLock');
	puzzleGame.comboTime = 0;
	puzzleGame.hintTime = 0;
	puzzle.checkGauge();
	puzzleGame.lock = false;
};

puzzle.updateScore = function(s) 
{
	puzzleGame.score += (s*BASIC_SCORE)*(puzzleGame.combo);
	puzzleGame.scoreLabel.setText('SCORE : ' + puzzleGame.score);
	
};

puzzle.updateCombo = function(c) 
{
	var printMessage = "";
	puzzleGame.combo = (c > 0) ? puzzleGame.combo+1 : 0;
	printMessage = puzzleGame.combo;
	printMessage += " Combo! \n";
	
	var comboMsgIdx = 0;
	if (puzzleGame.combo == 0)
	{
		comboMsgIdx = Math.floor(Math.random()*comboMessage[0].length);
		printMessage = comboMessage[0][comboMsgIdx];
		puzzleGame.messageLabel.setPosition(SCREEN_WIDTH/2, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+25+32);
	}
	else
	{
		if (puzzleGame.combo < comboMessage.length-1)
		{
			comboMsgIdx = Math.floor(Math.random()*comboMessage[puzzleGame.combo].length);
			printMessage += comboMessage[puzzleGame.combo][comboMsgIdx];
		} 
		else 
		{
			comboMsgIdx = Math.floor(Math.random()*comboMessage[comboMessage.length-1].length);
			printMessage += comboMessage[comboMessage.length-1][comboMsgIdx];
		}
		puzzleGame.messageLabel.setPosition(SCREEN_WIDTH/2, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+25+32-12);
	}
	
	puzzleGame.messageLabel.setText(printMessage);
	printMessage = null;
	comboMsgIdx = null;
};

puzzle.updateGauge = function(g) 
{
	puzzleGame.gauge += g*5;
	puzzleGame.gaugeLabel.setText(puzzleGame.gauge);		
};

puzzle.checkGauge = function() 
{
	// full gauge
	if (puzzleGame.gauge >= MAXIMUM_GAUGE)
	{ 
		var row, col, isExist;
		var coord = new Array();
		var numOfSpecialPieces = Math.floor(puzzleGame.gauge/MAXIMUM_GAUGE);

		puzzleGame.gauge -= (MAXIMUM_GAUGE*numOfSpecialPieces);
		puzzleGame.gaugeLabel.setText(puzzleGame.gauge);
		
		for (var i = 0; i < numOfSpecialPieces; i++)
		{
			isExist = false;
			while (1) 
			{
				row = Math.floor(Math.random()*BOARD_SIZE);
				col = Math.floor(Math.random()*BOARD_SIZE);
				if (puzzleGame.board[row][col].type == PIECE_SPECIAL)
				{
					continue;
				}
				for (var j = 0; j < coord.length; j++)
				{
					if (coord[j].row == row && coord[j].col == col)
					{
						isExist = true;
						break;
					}
				}
				if (!isExist)
				{
					coord.push({'row' : row, 'col' : col});
					break;
				}
			}
			puzzleGame.board[row][col].img.setFill(puzzleGame.resource.frames[PIECE_SPECIAL]);
			puzzleGame.board[row][col].type = PIECE_SPECIAL;
			puzzleGame.board[row][col].typeOfSpecial = Math.floor(Math.random()*NUM_OF_SPECIAL_TYPES);
			puzzleGame.board[row][col].isIngredient = false;
		}
		
		row = col = isExist = null;
		coord = null;
	}
};

puzzle.updateGetPieces = function(type) 
{
	puzzleGame.numOfGetPieces[type]++;
};

puzzle.setProgressBar = function(value) 
{
    puzzleGame.progressBar.inner.runAction(new lime.animation.Resize(puzzleGame.progressBar.width * value, puzzleGame.progressBar.inner.getSize().height).setDuration(0.04));
};

puzzle.updateTime = function() 
{
	if (puzzleGame.lock) 
	{
		return;
	}
	
	// update time
    puzzleGame.currentTime -= (puzzleGame.tick/1000);
    
    // end game
    if (puzzleGame.currentTime < 1)
    {
       puzzle.puzzleEnd();
    }
        
    // hint
    puzzleGame.hintTime += puzzleGame.tick;
    if (puzzleGame.hintTime >= 3000 && !puzzleGame.hintFlag)
    {
    	puzzleGame.hintFlag = true;				
		if (puzzleGame.hintDirection == 0)
		{
			// horizontal
			puzzleGame.resource.hint.setAnchorPoint(0, 0).setRotation(0).setPosition(0, puzzleGame.hintLine*FRAME_HEIGHT);
		}
		else if (puzzleGame.hintDirection == 1)
		{
			// vertical
			puzzleGame.resource.hint.setAnchorPoint(0, 1).setRotation(-90).setPosition(puzzleGame.hintLine*FRAME_WIDTH, 0);
		}
		else
		{
			// some point for special piece.
		}
		puzzleGame.puzzleLayer.appendChild(puzzleGame.resource.hint);
		
		lime.scheduleManager.scheduleWithDelay(puzzle.removeHintTime, this, 1000, 1);
	}
	
	// combo
	puzzleGame.comboTime += puzzleGame.tick;
	if (puzzleGame.comboTime >= 2000 && puzzleGame.combo > 0)
	{
		// combo가 0일 때는 굳이 이걸 실행할 이유가 없다.
		console.log('[puzzle] combo canceled');
		puzzle.updateCombo(0);
	}
	
	puzzle.setProgressBar(puzzleGame.currentTime/puzzleGame.maxTime);
};

puzzle.removeHintTime = function()
{
	if (puzzleGame.hintFlag)
	{
		puzzleGame.puzzleLayer.removeChild(puzzleGame.resource.hint);
		puzzleGame.hintFlag = false;
		puzzleGame.hintTime = 0;
	}
};

function createInfoLayer()
{
	puzzleGame.infoLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	commonObject.scene.appendChild(puzzleGame.infoLayer);
	
	var outer, inner;
	
	//top animation Rect
	outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 139).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, 46).setRadius(5);
	inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 137).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, 47).setRadius(5);
	puzzleGame.infoLayer.appendChild(outer);
	puzzleGame.infoLayer.appendChild(inner);
	
	//score & gauge Rect
	outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 30).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, PUZZLE_Y-34).setRadius(5);
	inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 28).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, PUZZLE_Y-33).setRadius(5);
	puzzleGame.infoLayer.appendChild(outer);
	puzzleGame.infoLayer.appendChild(inner);	
		
	//score
	puzzleGame.scoreLabel = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(1, 0).setPosition(PUZZLE_X+FRAME_WIDTH*BOARD_SIZE-10, PUZZLE_Y-31).setSize(250, 20).setAlign("right");
	puzzleGame.infoLayer.appendChild(puzzleGame.scoreLabel);
	puzzle.updateScore(0);
	
	//gauge
	puzzleGame.gaugeLabel = new lime.Label().setFontColor('#ffff00').setFontSize(20).setAnchorPoint(0, 0).setPosition(PUZZLE_X+10, PUZZLE_Y-31);
	puzzleGame.infoLayer.appendChild(puzzleGame.gaugeLabel);
	puzzle.updateGauge(0);
	
	//info & combo
	outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 65).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+25).setRadius(5);
	inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-2, 63).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+1, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+26).setRadius(5);
	puzzleGame.infoLayer.appendChild(outer);
	puzzleGame.infoLayer.appendChild(inner);	
	puzzleGame.messageLabel = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(0.5, 0.5).setPosition(SCREEN_WIDTH/2, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+25+32).setSize(FRAME_WIDTH*BOARD_SIZE, 23).setMultiline(true).setAlign("center");
	puzzleGame.infoLayer.appendChild(puzzleGame.messageLabel);
	puzzle.updateCombo(0);
	
	//timer progress bar
	createProgressBar();
	puzzleGame.progressBar.setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+4);
	puzzleGame.infoLayer.appendChild(puzzleGame.progressBar);
	puzzle.setProgressBar(puzzleGame.currentTime/puzzleGame.maxTime);
}

function createBoardLayer()
{
	puzzleGame.puzzleLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y);
	commonObject.scene.appendChild(puzzleGame.puzzleLayer);
	
	puzzleGame.mask = new lime.Sprite().setAnchorPoint(0, 0).setSize(FRAME_WIDTH*BOARD_SIZE, FRAME_HEIGHT*BOARD_SIZE).setPosition(PUZZLE_X, PUZZLE_Y);
	commonObject.scene.appendChild(puzzleGame.mask);
	puzzleGame.puzzleLayer.setMask(puzzleGame.mask);
}

function createProgressBar()
{	
	puzzleGame.progressBar = new lime.RoundedRect();

    var WIDTH = FRAME_WIDTH*BOARD_SIZE,
        HEIGHT = 16,
        RADIUS = 20,
        BORDER = 4;

    puzzleGame.progressBar.setSize(WIDTH, HEIGHT).setRadius(RADIUS).setAnchorPoint(0, 0.5);
    puzzleGame.progressBar.setFill(new lime.fill.LinearGradient().addColorStop(0, 0x15, 0x37, 0x62, .6).addColorStop(1, 0x1e, 0x57, 0x97, .4));

    WIDTH -= 2 * BORDER;
    HEIGHT -= 2 * BORDER;
    RADIUS = 12;

    // inner balue var
    var inner = new lime.RoundedRect().setRadius(RADIUS).setSize(WIDTH, HEIGHT).setFill('#F90').setAnchorPoint(0, .5).setPosition(4, 8);
    puzzleGame.progressBar.appendChild(inner);

    inner.setFill(new lime.fill.LinearGradient().addColorStop(0, '#afcdef').addColorStop(.49, '#55a1fc').addColorStop(.5, '#3690f4').addColorStop(1, '#8dc9ff'));

    puzzleGame.progressBar.width = WIDTH;
    puzzleGame.progressBar.inner = inner;
};