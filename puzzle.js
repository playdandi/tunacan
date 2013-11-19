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
	this.director = null;
	this.scene = null;
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
	this.maxTime = 60;
	this.currentTime = 60;
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
	console.log('puzzleInit');
	
	puzzleGame = new puzzleGame();
	
	//create window
	puzzleGame.director = new lime.Director(document.body, SCREEN_WIDTH, SCREEN_HEIGHT);
	puzzleGame.scene = new lime.Scene();
	console.log('create window complete!');
	
	//bg Layer (temp)
	var bgLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0, 0);
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(SCREEN_WIDTH, SCREEN_HEIGHT).setFill("#000000");
	bgLayer.appendChild(rect);
	puzzleGame.scene.appendChild(bgLayer);
	console.log('create bg_layer complete!');
	
	//create User Interface
	createInfoLayer();
	console.log('create Info_layer complete!');
	createBoardLayer();
	console.log('create Board_layer complete!');

	//replace scene	
	puzzleGame.director.makeMobileWebAppCapable();	
	puzzleGame.director.replaceScene(puzzleGame.scene);
	
	//next step
	resource.puzzleResourceInit();
};

puzzle.puzzleStart = function()
{
	console.log('puzzleStart');
	userInput.puzzleInputEvent(puzzleGame.mask);
	lime.scheduleManager.scheduleWithDelay(puzzle.updateTime, this, puzzleGame.tick);
	//board.findBlocks(null, null);
};

puzzle.puzzleEnd = function()
{
	console.log('puzzleEnd');
};

puzzle.puzzleReleaseLock = function()
{
	console.log('puzzleReleaseLock');
	puzzleGame.comboTime = 0;
	puzzleGame.hintTime = 0;
	puzzle.checkGauge();
	puzzleGame.lock = false;
};

puzzle.updateScore = function(s) 
{
	puzzleGame.score += (s*100)*(puzzleGame.combo*puzzleGame.combo);
	puzzleGame.scoreLabel.setText('SCORE : ' + puzzleGame.score);
};

puzzle.updateCombo = function(c) 
{
	var printMessage = "";
	puzzleGame.combo = (c > 0) ? puzzleGame.combo+1 : 0;
	printMessage = puzzleGame.combo;
	printMessage += " Combo! \n";
	
	if (puzzleGame.combo == 0)
	{
		printMessage = combo_message[0];
	}
	else
	{
		if (puzzleGame.combo < combo_message.length-1)
		{
			printMessage += combo_message[puzzleGame.combo];
		} 
		else 
		{
			printMessage += combo_message[combo_message.length-1];
		}
	}
	
	puzzleGame.messageLabel.setText(printMessage);
	printMessage = null;
};

puzzle.updateGauge = function(g) 
{
	puzzleGame.gauge += g*5;
	puzzleGame.gaugeLabel.setText(puzzleGame.gauge);		
};

puzzle.checkGauge = function() 
{
	// full gauge
	if (puzzleGame.gauge >= 100)
	{ 
		var row, col, isExist;
		var coord = new Array();
		var numOfSpecialPieces = Math.floor(puzzleGame.gauge/100);

		puzzleGame.gauge -= (100*numOfSpecialPieces);
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
       // puzzle.puzzleEnd();
       puzzleGame.currentTime = puzzleGame.maxTime;
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
	console.log(puzzleGame.comboTime);
	if (puzzleGame.comboTime >= 2000 && puzzleGame.combo > 0)
	{
		// combo가 0일 때는 굳이 이걸 실행할 이유가 없다.
		console.log('combo canceled');
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
	puzzleGame.scene.appendChild(puzzleGame.infoLayer);
		
	//score
	puzzleGame.scoreLabel = new lime.Label().setFontColor('#ffffff').setFontSize(30).setAnchorPoint(1, 0).setPosition(PUZZLE_X+FRAME_WIDTH*BOARD_SIZE, 20);
	puzzleGame.infoLayer.appendChild(puzzleGame.scoreLabel);
	puzzle.updateScore(0);
	
	//gauge
	puzzleGame.gaugeLabel = new lime.Label().setFontColor('#ffff00').setFontSize(30).setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y-70);
	puzzleGame.infoLayer.appendChild(puzzleGame.gaugeLabel);
	puzzle.updateGauge(0);
	
	//info & combo
	var outer = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE, 80).setAnchorPoint(0, 0).setFill('#ffffff').setPosition(PUZZLE_X, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+10).setRadius(10);
	var inner = new lime.RoundedRect().setSize(FRAME_WIDTH*BOARD_SIZE-6, 74).setAnchorPoint(0, 0).setFill('#000000').setPosition(PUZZLE_X+3, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+13).setRadius(10);
	puzzleGame.infoLayer.appendChild(outer);
	puzzleGame.infoLayer.appendChild(inner);	
	puzzleGame.messageLabel = new lime.Label().setFontColor('#ffffff').setFontSize(20).setAnchorPoint(0.5, 0.5).setPosition(SCREEN_WIDTH/2, PUZZLE_Y+FRAME_HEIGHT*BOARD_SIZE+50).setSize(FRAME_WIDTH*BOARD_SIZE).setMultiline(true);
	puzzleGame.infoLayer.appendChild(puzzleGame.messageLabel);
	puzzle.updateCombo(0);
	
	//timer progress bar
	createProgressBar();
	puzzleGame.progressBar.setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y-20);
	puzzleGame.infoLayer.appendChild(puzzleGame.progressBar);
	puzzle.setProgressBar(puzzleGame.currentTime/puzzleGame.maxTime);	
}

function createBoardLayer()
{
	puzzleGame.puzzleLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y);
	puzzleGame.scene.appendChild(puzzleGame.puzzleLayer);
	
	puzzleGame.mask = new lime.Sprite().setAnchorPoint(0, 0).setSize(FRAME_WIDTH*BOARD_SIZE, FRAME_HEIGHT*BOARD_SIZE).setPosition(PUZZLE_X, PUZZLE_Y);
	puzzleGame.scene.appendChild(puzzleGame.mask);
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