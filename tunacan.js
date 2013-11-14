//set main namespace
goog.provide('tunacan');

// get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.fill.Fill');
goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');
goog.require('lime.Node');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.RotateBy');

// entry point
tunacan.start = function() {
	res.init();	
};

tunacan.puzzleStart = function() {
	console.log('puzzleStart');
	var director = new lime.Director(document.body, SCREENWIDTH, SCREENHEIGHT);
	var scene = new lime.Scene();
	
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(SCREENWIDTH, SCREENHEIGHT).setFill("#000000");
	var mask = new lime.Sprite().setAnchorPoint(0, 0).setSize(frameWidth*BOARD_SIZE, frameHeight*BOARD_SIZE).setPosition(PUZZLE_X, PUZZLE_Y);
	
	puzzleLayer = new lime.Layer().setAnchorPoint(0, 0).setPosition(PUZZLE_X, PUZZLE_Y);
	puzzleLayer.setMask(mask);
	
	game_info.init();
	boardInit();
	
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
};


function boardInit() 
{
	lock = true;
	// layer init
	puzzleLayer.removeAllChildren();
	
	board = null;
	board = new Array(BOARD_SIZE);
	
	game_info.updateCombo(0); // init combo to 0.
	game_info.updateScore(0); // init combo to 0.
	
	var i, j;
	var init = 0;
	for (i = 0; i < BOARD_SIZE; i++)
	{
		board[i] = new Array(BOARD_SIZE);
		for (j = 0; j < BOARD_SIZE; j++)
		{
			// make new piece of puzzle.
			board[i][j] = res.createPiece(0, null);

			puzzleLayer.appendChild(board[i][j].img.setPosition(j*frameWidth, i*frameHeight));
			
			var anim = new lime.animation.RotateBy(360).setDuration(1.5);
			board[i][j].img.setAnchorPoint(0.5, 0.5).setPosition(j*frameWidth+frameWidth/2, i*frameHeight+frameHeight/2);
			
			goog.events.listen(anim, lime.animation.Event.STOP, function()
			{
				init++;
				if (init == BOARD_SIZE*BOARD_SIZE) 
				{
					for(var y = 0 ; y < BOARD_SIZE ; y++)
						for(var x = 0 ; x < BOARD_SIZE ; x++)
							board[y][x].img.setAnchorPoint(0, 0).setPosition(x*frameWidth, y*frameHeight);
					
					// start game
					bomb(0, 0, 0);
				}
			});
			board[i][j].img.runAction(anim);
		}
	}
}

function allowUserForceDrag(shape)
{ 
	goog.events.listen(shape, ['mousedown', 'touchstart'], function(e)
	{
		if (lock == false)
		{
			var st_pos = this.localToParent(e.position); //need parent coordinate system

			var st_x_idx, st_y_idx;			
			st_x_idx = Math.floor((st_pos.x-PUZZLE_X)/frameWidth);
			st_y_idx = Math.floor((st_pos.y-PUZZLE_Y)/frameHeight); 
			
			// ends my input
			e.swallow(['mouseup', 'touchend'], function(e)
			{
				var ed_pos = this.localToParent(e.position);
				var ed_x_idx, ed_y_idx;
				ed_x_idx = Math.floor((ed_pos.x-PUZZLE_X)/frameWidth);
				ed_y_idx = Math.floor((ed_pos.y-PUZZLE_Y)/frameHeight);
				 
				if (Math.abs(ed_x_idx-st_x_idx) > 0 && Math.abs(ed_pos.x-st_pos.x) > Math.abs(ed_pos.y-st_pos.y)) //left or right
				{
					if (ed_x_idx-st_x_idx > 0) //right
						scroll(st_x_idx, st_y_idx, 2, true);
					else //left
						scroll(st_x_idx, st_y_idx, 1, true);
				}
				if (Math.abs(ed_y_idx-st_y_idx) > 0 && Math.abs(ed_pos.y-st_pos.y) > Math.abs(ed_pos.x-st_pos.x)) //up or down
				{
					if (ed_y_idx-st_y_idx > 0) //down
						scroll(st_x_idx, st_y_idx, 4, true);
					else //up
						scroll(st_x_idx, st_y_idx, 3, true);
				}	
			});
			// allows it to be dragged around
			e.swallow(['mousemove', 'touchmove'], function(e)
			{
				//var pos = this.localToParent(e.position);
				//mouseJoint.SetTarget(new box2d.Vec2(pos.x, pos.y));
			});
		}		
	});
}

function drop()
{	
	var retArray = game_function.fillElementsAndDrop();
	var dropped = 0;
	
	for (var i = 0; i < retArray.length; i++)
	{
		var anim = new lime.animation.MoveBy(0, frameWidth * retArray[i].drop).setDuration(DURATION_TIME);
		goog.events.listen(anim, lime.animation.Event.STOP, function()
		{
			dropped++;
			if (dropped == retArray.length)
			{
				bomb(0, 0, 0); // re-check if there is a piece to be bombed.
			}
		});
		
		if (retArray[i].row >= 0)
		{
			board[retArray[i].row][retArray[i].col].img.runAction(anim);
			board[retArray[i].row+retArray[i].drop][retArray[i].col] = null;
			board[retArray[i].row+retArray[i].drop][retArray[i].col] = board[retArray[i].row].slice(retArray[i].col, retArray[i].col+1)[0];
		}
		else
		{
			puzzleLayer.appendChild(retArray[i].piece.img.setPosition(retArray[i].col * frameWidth, retArray[i].row * frameHeight));
			retArray[i].piece.img.runAction(anim);
			board[retArray[i].row+retArray[i].drop][retArray[i].col] = null;
			board[retArray[i].row+retArray[i].drop][retArray[i].col] = retArray[i].piece;
		}
	}
}

function bomb(x, y, direct)
{	
	var result;
	if (combo < 2) // 현재콤보가 1이란 말은, 두번째로 검사하는 기준이란 뜻. 따라서 아래의 if문은 3번째 combo부터 floodfill 적용됨.
		result = game_function.findMatchedBlocks();
	else
		result = game_function.findMatchedBlocksFloodFill();
		
	if (result.isFound) // let's bomb!
	{
		var coord = new Array();
		var destroyed = 0;
		
		for(var y = 0 ; y < BOARD_SIZE ; y++)
		{
			for(var x = 0 ; x < BOARD_SIZE ; x++)
			{
				if(board[y][x].type < 0) // the part to be bombed.
				{
					var anim = new lime.animation.Spawn(new lime.animation.ScaleTo(1.5), new lime.animation.FadeTo(0)).setDuration(DURATION_TIME);
					board[y][x].img.setAnchorPoint(0.5, 0.5).setPosition(x*frameWidth+frameWidth/2, y*frameHeight+frameHeight/2);
					coord.push({'x' : x, 'y' : y});
					
					if(board[y][x].ingredient)
					{
						game_info.updateGetPieces(-board[y][x].type);
						//numOfGetPieces[-board[y][x].type]++;
					}
					goog.events.listen(anim, lime.animation.Event.STOP, function()
					{
						destroyed++;
						if (destroyed == result.numOfFound) // if all animations are finished,
						{
							game_info.updateCombo(1);
							game_info.updateScore(result.numOfFound);
							//game_info.updateGauge(result.numOfFound);
							//game_info.updateGetPieces();
							
							for (var i = 0; i < coord.length; i++)	
								board[coord[i].y][coord[i].x].img.setAnchorPoint(0, 0).setPosition(coord[i].x * frameWidth, coord[i].y * frameHeight);
							
							drop();
						}
					});
					
					board[y][x].img.runAction(anim);
				}
			}
		}
	}
	
	else if (direct != 0) // get scroll back.
	{
		if (direct == 1)
		{
			if (x == 0)
				x = BOARD_SIZE;
			scroll(x-1, y, 2, false);
		}
		else if (direct == 2)
		{
			if (x == BOARD_SIZE-1)
				x = -1;
			scroll(x+1, y, 1, false);
		}
		else if (direct == 3)
		{
			if (y == 0)
				y = BOARD_SIZE;
			scroll(x, y-1, 4, false);
		}
		else if (direct == 4)
		{
			if (y == BOARD_SIZE-1)
				y = -1;
			scroll(x, y+1, 3, false);
		}
		
		game_info.updateCombo(0); // init combo to 0.
	}
	
	else // finish the round (bomb done, drop done, and no pieces are bombbed).
	{
		if (game_function.isBoardUseless())
		{
			boardInit();
		}
		else
		{
			lock = false;
			hintTime = 0;
			comboTime = 0;
			console.log('lock released');
		}
	}
}

function scroll(x, y, direct, next_step) // direct 1: left, 2: right, 3: up, 4: down
{
	lock = true;
	hintTime = 0;
	var new_icon;
	
	board[y][x].img.setOpacity(0.5);
	
	switch(direct)
	{
		case 1: // left
		{
			new_icon = res.createPiece(board[y][0].type, board[y][0].ingredient);
			puzzleLayer.appendChild(new_icon.img.setPosition(BOARD_SIZE*frameWidth, y*frameHeight));
			var moved = 0;
			for (var i = 0; i <= BOARD_SIZE ; i++)
			{
				var anim = new lime.animation.MoveBy(-63, 0).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE + 1)
					{
						board[y][x].img.setOpacity(1);
						board[y][0] = null;
						for (var i = 0; i < BOARD_SIZE-1; i++)
							board[y][i] = board[y][i+1];
						
						board[y][BOARD_SIZE-1] = new_icon;
									
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}
				});
				if (i == BOARD_SIZE)
					new_icon.img.runAction(anim);
				else
					board[y][i].img.runAction(anim);
			}
			break;
		}
		case 2: // right
		{
			new_icon = res.createPiece(board[y][BOARD_SIZE-1].type, board[y][BOARD_SIZE-1].ingredient);
			puzzleLayer.appendChild(new_icon.img.setPosition(-frameWidth, y*frameHeight));
			var moved = 0;
			for (var i = 0; i <= BOARD_SIZE; i++)
			{
				var anim = new lime.animation.MoveBy(63, 0).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE + 1)
					{
						board[y][x].img.setOpacity(1);
						board[y][BOARD_SIZE-1] = null;
						for (var i = BOARD_SIZE-1; i > 0; i--)
							board[y][i] = board[y][i-1];

						board[y][0] = new_icon;
						
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}
				});
				if (i == BOARD_SIZE)
					new_icon.img.runAction(anim);
				else
					board[y][i].img.runAction(anim);
			}
			break;
		}
		case 3: //up
		{
			new_icon = res.createPiece(board[0][x].type, board[0][x].ingredient);
			puzzleLayer.appendChild(new_icon.img.setPosition(x*frameWidth, BOARD_SIZE*frameHeight));			
			var moved = 0;
			for (var i = 0; i <= BOARD_SIZE; i++)
			{
				var anim = new lime.animation.MoveBy(0, -63).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE + 1)
					{
						board[y][x].img.setOpacity(1);
						board[0][x] = null;
						for (var i = 0; i < BOARD_SIZE-1; i++)
							board[i][x] = board[i+1][x];
						
						board[BOARD_SIZE-1][x] = new_icon;
						
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}	
				});
				if (i == BOARD_SIZE)
					new_icon.img.runAction(anim);
				else
					board[i][x].img.runAction(anim);
			}
			break;
		}
		case 4: //down
		{
			new_icon = res.createPiece(board[BOARD_SIZE-1][x].type, board[BOARD_SIZE-1][x].ingredient);
			puzzleLayer.appendChild(new_icon.img.setPosition(x*frameWidth, -frameHeight));
			var moved = 0;
			for (var i = 0; i <= BOARD_SIZE; i++)
			{
				var anim = new lime.animation.MoveBy(0, 63).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE + 1)
					{
						board[y][x].img.setOpacity(1);
						board[BOARD_SIZE-1][x] = null;
						for (var i = BOARD_SIZE-1; i > 0; i--)
							board[i][x] = board[i-1][x];
							
						board[0][x] = new_icon;
						
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}	
				});
				if (i == BOARD_SIZE)
					new_icon.img.runAction(anim);
				else
					board[i][x].img.runAction(anim);
			}
			break;
		}
	}
	
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tunacan.start', tunacan.start);