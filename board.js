goog.provide('board');

goog.require('lime.Sprite');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.Spawn');
	
/*
 * each piece object of board.
 */
function piece()
{
	this.img = null;
	this.type = null;
	this.typeOfSpecial = null;
	this.isIngredient = null;
	return this;
}

/*
 * create board whose size is this.size;
 */
board.create = function(row, col)
{
	// 화면 상에서 기존에 존재하던 piece들을 모두 지운다.
	puzzleGame.puzzleLayer.removeAllChildren();
	
	// get position of all special pieces.
	var specialPieces = new Array();
	for (var i = 0 ; i < BOARD_SIZE ; i++)
	{
		for (var j = 0 ; j < BOARD_SIZE ; j++)
		{
			if (puzzleGame.board != null && !(i == row && j == col) && board[i][j].type == PIECE_SPECIAL)
			{
				specialPieces.push(board[i].slice(j, j+1)[0]);
			}
		}
	}
	
	// initialize board.	
	puzzleGame.board = null;
	puzzleGame.board = new Array(BOARD_SIZE);
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		puzzleGame.board[row] = new Array(BOARD_SIZE);
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			puzzleGame.board[row][col] = null; //board.createPiece(null, null, null);
		}
	}

	// positioning special pieces if exist.
	for (var i = 0 ; i < specialPieces.length ; i++)
	{ 
		while (1)
		{
			newRow = Math.floor(Math.random()*BOARD_SIZE);
			newCol = Math.floor(Math.random()*BOARD_SIZE);
			if (puzzleGame.board[newRow][newCol] == null)
			{
				puzzleGame.board[newRow][newCol] = specialPieces.slice(i, i+1)[0];
				break;
			}
		}
	}
	specialPieces = null;
	
	// make all pieces.
	var init = 0;
	for (var i = 0 ; i < BOARD_SIZE ; i++)
	{
		for (var j = 0 ; j < BOARD_SIZE ; j++)
		{
			if (puzzleGame.board[i][j] == null) 
			{
				// make new piece of puzzle.
				puzzleGame.board[i][j] = board.createPiece(null, null, null);
			}
			
			puzzleGame.puzzleLayer.appendChild(puzzleGame.board[i][j].img.setPosition(j*FRAME_WIDTH, i*FRAME_HEIGHT));
			
			var anim = new lime.animation.RotateBy(360).setDuration(1.5);
			puzzleGame.board[i][j].img.setAnchorPoint(0.5, 0.5).setPosition(j*FRAME_WIDTH+FRAME_WIDTH/2, i*FRAME_HEIGHT+FRAME_HEIGHT/2);
			
			// event listener - when all rotating animations are done.
			goog.events.listen(anim, lime.animation.Event.STOP, function()
			{
				init++;
				if (init == BOARD_SIZE*BOARD_SIZE) 
				{
					for (var y = 0 ; y < BOARD_SIZE ; y++)
					{
						for (var x = 0 ; x < BOARD_SIZE ; x++)
						{
							board[y][x].img.setAnchorPoint(0, 0).setPosition(x*FRAME_WIDTH, y*FRAME_HEIGHT);
						}
					}
					
					// start puzzle game
					puzzle.puzzleStart();
				}
			});
			
			puzzleGame.board[i][j].img.runAction(anim);
		}
	}
};

/*
 * create a piece of board.
 * @param {int} type / 
 * @param {boolean} isIngredient /
 * @param {int} typeOfSpecial / 
 * @return {piece()} / a piece object. 
 */
board.createPiece = function(type, isIngredient, typeOfSpecial)
{	
	var p = new piece();
	
	// type
	p.type = (type != null) ? type : board.getRandomNumber(6)+1;
	
	// ingredient 
	if (isIngredient != null) {
		// moveLine 할 때는 기존의 piece를 그대로 들고 온다.
		p.isIngredient = isIngredient;
	}
	else
	{
		p.isIngredient = (Math.floor(Math.random()*100) < INGREDIENT_PROBABILITY) ? true : false;
	}
	
	// image
	if (p.isIngredient)
	{
		p.img = new lime.Sprite().setFill(framesIngre[p.type]).setAnchorPoint(0, 0);
	}
	else
	{
		p.img = new lime.Sprite().setFill(frames[p.type]).setAnchorPoint(0, 0);
	}
	
	// type of special piece
	p.typeOfSpecial = typeOfSpecial;
		
	return p;
};

board.getRandomNumber = function(max)
{ 	// return integer between (0 <= value < max).
	return Math.floor(Math.random()*max);
};


/*
 * find 3-more-matched blocks by a proper algorithm.
 * @param {} prevState /
 * @param {} row /
 * @param {} col /
 * @return {dictionary} / a dictionary object {'isFound', 'numOfFound'}. 
 */
board.findBlocks = function(state, rowColObject)
{
	var result;
	
	if (state == 'special')
	{
		// special piece에 대한 기능 실
		result = board.findBlocksSpecial(rowColObject.row, rowColObject.col);
		//result = board.findBlocksSpecial(puzzleGame.board[row][col].typeOfSpecial, row, col);
	}
	else if (puzzleGame.combo < 2)
	{
		// 현재 콤보가 1 이하란 말은, 두번째로 검사하는 기준이란 뜻. 따라서 아래의 if문은 3번째 콤보부터 floodfill 적용된다.
		result =  board.findBlocksBasic();
	}
	else if (puzzleGame.combo >= 2)
	{
		// floodfill algorithm이 적용된다.
		result = board.findBlocksFloodFill();
	}
	
	//console.log('findBpuzzleGame.locks() done. (isFound, numOfFound) : (' + result.isFound + ', ' + result.numOfFound + ')');
	
	if (result.isFound)
	{
		// 터뜨릴 piece를 하나 이상 찾은 경우.
		board.bomb(result.numOfFound);
	}
	else if (state == 'moveLine')
	{
		// line 이동 되돌리기.
		var obj = rowColObject;
		if (obj.direction == 1)
		{
			obj.row = (obj.row == 0) ? BOARD_SIZE : obj.row;
			moveLine(obj.row-1, obj.col, 2, false);
		}
		else if (obj.direction == 2)
		{
			obj.row = (obj.row == BOARD_SIZE-1) ? -1 : obj.row;
			moveLine(obj.row+1, obj.col, 1, false);
		}
		else if (obj.direction == 3)
		{
			obj.col = (obj.col == 0) ? BOARD_SIZE : obj.col;
			moveLine(obj.row, obj.col-1, 4, false);
		}
		else if (obj.direction == 4)
		{
			obj.col = (obj.col == BOARD_SIZE-1) ? -1 : obj.col;
			moveLine(obj.row, obj.col+1, 3, false);
		}
		
		// 콤보가 끊겼으니 0으로 바꾼다.
		puzzle.updateCombo(0);
	}
	else
	{
		if (state == 'special')
		{
			// special piece가 board의 replace 상황인 경우.
			board.create(rowColObject.row, rowColObject.col);
		}
		else if (board.hasToBeReplaced())
		{
			// board 전체를 replace 하는 경우.
			board.create(null, null);
		}
		else
		{
			// puzzleGame.lock을 풀고 사용자 대기 상태로 돌아간다.
			puzzle.puzzleReleaseLock();
		}
	}
};


board.bomb = function(numOfFound)
{
	var coord = new Array();
	var destroyed = 0;
		
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			// the part to be bombed.
			if (puzzleGame.board[row][col].type < 0)
			{		
				var anim = new lime.animation.Spawn(new lime.animation.ScaleTo(1.5), new lime.animation.FadeTo(0)).setDuration(DURATION_TIME);
				puzzleGame.board[row][col].img.setAnchorPoint(0.5, 0.5).setPosition(x*FRAME_WIDTH+FRAME_WIDTH/2, y*FRAME_HEIGHT+FRAME_HEIGHT/2);
				coord.push({'row' : row, 'col' : col});
				
				if (puzzleGame.board[row][col].isIngredient)
				{
					puzzle.updateGetPieces(-puzzleGame.board[row][col].type);
				}
				
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					destroyed++;
					
					// if all animations are finished.
					if (destroyed == numOfFound)
					{
						puzzle.updateCombo(1);
						puzzle.updateScore(numOfFound);
						puzzle.updateGauge(numOfFound);
						
						for (var i = 0 ; i < coord.length ; i++)
						{
							puzzleGame.puzzleLayer.removeChild(puzzleGame.board[coord[i].row][coord[i].col]);
							puzzleGame.board[coord[i].row][coord[i].col].img.setAnchorPoint(0, 0).setPosition(coord[i].row*FRAME_WIDTH, coord[i].col*FRAME_HEIGHT);
						}
						
						// free memories.
						coord = null;
						destroyed = null;
						
						// fill new pieces and drop them.
						board.drop();
					}
				});
				
				puzzleGame.board[row][col].img.runAction(anim);
			}
		}
	}
};


board.drop = function()
{		
	var result = board.getDroppingPieces();
	var dropped = 0;
	
	for (var i = 0 ; i < result.length ; i++)
	{
		var anim = new lime.animation.MoveBy(0, FRAME_WIDTH*result[i].drop).setDuration(DURATION_TIME);
		
		goog.events.listen(anim, lime.animation.Event.STOP, function()
		{
			dropped++;
			if (dropped == retArray.length)
			{
				//bomb(0, 0, 0); // re-check if there is a piece to be bombed.
				board.findBpuzzleGame.locks(null, null, null);
			}
		});
		
		// apply and change board.
		if (result[i].row >= 0)
		{
			// 기존의 board에 남아있는 piece.
			board[result[i].row][result[i].col].img.runAction(anim);
			board[result[i].row+result[i].drop][result[i].col] = null;
			board[result[i].row+result[i].drop][result[i].col] = board[result[i].row].slice(result[i].col, result[i].col+1)[0];
		}
		else
		{
			// 새로 추가된 piece.
			puzzleLayer.appendChild(result[i].piece.img.setPosition(result[i].col*FRAME_WIDTH, result[i].row*FRAME_HEIGHT));
			result[i].piece.img.runAction(anim);
			puzzleGame.board[result[i].row+result[i].drop][result[i].col] = null;
			puzzleGame.board[result[i].row+result[i].drop][result[i].col] = result[i].piece;
		}
	}
};
/*
function bomb(x, y, direct)

	if(x = blah) {}
	
	else if (direct != 0 && direct != 'special') // get scroll back.
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
		if (direct == 'special' && !result.isFound) // special case : replace
		{
			console.log('row : ' + y + ' , col : ' + x);
			boardInit(y, x);
		}
		else if (game_function.isBoardUseless())
		{
			boardInit(null, null);
		}
		else // 터뜨리는 행위가 중지된다. puzzleGame.lock이 풀리는 부분.
		{
			game_info.checkGauge();
			hintTime = 0;
			comboTime = 0;
			puzzleGame.lock = false;
			console.log('puzzleGame.lock released - in bomb(' + x + ', ' + y + ', ' + direct + ')');
		}
	}
}
*/


/*
 * 
 */
board.moveLine = function(curRow, curCol, direction, isForBomb) // direct 1: left, 2: right, 3: up, 4: down
{
	var board = puzzleGame.board;
	
	puzzleGame.lock = true;
	console.log('puzzleGame.lock acquired - in scroll(' + x + ', ' + y + ', ' + direct + ', ' + isForBomb + ')');
	puzzleGame.hintTime = 0;
	
	var new_icon;
	
	board[curRow][curCol].img.setOpacity(0.5);
	
	switch(direction)
	{
		case 1: // left
			new_icon = board.createPiece(board[curRow][0].type, board[curRow][0].isIngredient, board[curRow][0].typeOfSpecial);
			puzzleGame.puzzleLayer.appendChild(new_icon.img.setPosition(BOARD_SIZE*FRAME_WIDTH, curRow*FRAME_HEIGHT));
			var moved = 0;
			for (var col = 0 ; col <= BOARD_SIZE ; col++)
			{
				var anim = new lime.animation.MoveBy(-FRAME_WIDTH, 0).setDuration(DURATION_TIME);
				
				// event listener - when all animations are done.
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE+1)
					{
						// 한 칸씩 옮긴다.
						board[curRow][curCol].img.setOpacity(1);
						puzzleGame.puzzleLayer.removeChild(board[curRow][0]);
						board[curRow][0] = null;
						for (var col = 0 ; col < BOARD_SIZE-1 ; col++)
						{
							board[curRow][col] = board[curRow][col+1];
						}
						board[curRow][BOARD_SIZE-1] = new_icon;
									
						if (isForBomb)
						{
							board.findBlocks('moveLine', {'row' : curRow, 'col' : curCol, 'direction' : direction});
						}
						else
						{
							puzzle.puzzleReleaseLock();
							//puzzleGame.lock = false;
							//console.log('puzzleGame.lock released - in scroll(' + x + ', ' + y + ', ' + direct + ', ' + isForBomb + ')');
						}
					}
				});
				
				if (col == BOARD_SIZE)
				{
					new_icon.img.runAction(anim);
				}
				else
				{
					board[curRow][col].img.runAction(anim);
				}
			}
			break;

		case 2: // right
			new_icon = board.createPiece(board[curRow][BOARD_SIZE-1].type, board[curRow][BOARD_SIZE-1].isIngredient, board[curRow][BOARD_SIZE-1].typeOfSpecial);
			puzzleGame.puzzleLayer.appendChild(new_icon.img.setPosition(-FRAME_WIDTH, curRow*FRAME_HEIGHT));
			var moved = 0;
			for (var col = 0 ; col <= BOARD_SIZE ; col++)
			{
				var anim = new lime.animation.MoveBy(FRAME_WIDTH, 0).setDuration(DURATION_TIME);
				
				// event listener - when all animations are done.
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE+1)
					{
						// 한 칸씩 옮긴다.
						board[curRow][curCol].img.setOpacity(1);
						puzzleGame.puzzleLayer.removeChild(board[curRow][BOARD_SIZE-1]);
						board[curRow][BOARD_SIZE-1] = null;
						for (var col = BOARD_SIZE-1 ; col > 0 ; col--)
						{
							board[curRow][col] = board[curRow][col-1];
						}
						board[curRow][0] = new_icon;
						
						if (isForBomb)
						{
							board.findBlocks('moveLine', {'row' : curRow, 'col' : curCol, 'direction' : direction});
						}
						else {
							puzzle.puzzleReleaseLock();
							//puzzleGame.lock = false;
							//console.log('puzzleGame.lock released - in scroll(' + x + ', ' + y + ', ' + direct + ', ' + isForBomb + ')');
						}
					}
				});
				
				if (col == BOARD_SIZE)
				{
					new_icon.img.runAction(anim);
				}
				else
				{
					board[curRow][col].img.runAction(anim);
				}
			}
			break;

		case 3: // up
			new_icon = board.createPiece(board[0][curCol].type, board[0][curCol].isIngredient, board[0][curCol].typeOfSpecial);
			puzzleGame.puzzleLayer.appendChild(new_icon.img.setPosition(curCol*FRAME_WIDTH, BOARD_SIZE*FRAME_HEIGHT));			
			var moved = 0;
			for (var row = 0 ; row <= BOARD_SIZE ; row++)
			{
				var anim = new lime.animation.MoveBy(0, -FRAME_HEIGHT).setDuration(DURATION_TIME);
				
				// event listener - when all animations are done.
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE+1)
					{
						// 한 칸씩 옮긴다.
						board[curRow][curCol].img.setOpacity(1);
						puzzleGame.puzzleLayer.removeChild(board[0][curCol]);
						board[0][curCol] = null;
						for (var row = 0 ; row < BOARD_SIZE-1 ; row++)
						{
							board[row][curCol] = board[row+1][curCol];
						}
						board[BOARD_SIZE-1][curCol] = new_icon;
						
						if (isForBomb)
						{
							board.findBlocks('moveLine', {'row' : curRow, 'col' : curCol, 'direction' : direction});
						}
						else
						{
							puzzle.puzzleReleaseLock();
							//puzzleGame.lock = false;
							//console.log('puzzleGame.lock released - in scroll(' + x + ', ' + y + ', ' + direct + ', ' + isForBomb + ')');
						}
					}	
				});
				
				if (row == BOARD_SIZE)
				{
					new_icon.img.runAction(anim);
				}
				else
				{
					board[row][curCol].img.runAction(anim);
				}
			}
			break;

		case 4: //down
			new_icon = board.createPiece(board[BOARD_SIZE-1][curCol].type, board[BOARD_SIZE-1][curCol].isIngredient, board[BOARD_SIZE-1][curCol].typeOfSpecial);
			puzzleGame.puzzleLayer.appendChild(new_icon.img.setPosition(curCol*FRAME_WIDTH, -FRAME_HEIGHT));
			var moved = 0;
			for (var row = 0 ; row <= BOARD_SIZE ; row++)
			{
				var anim = new lime.animation.MoveBy(0, FRAME_HEIGHT).setDuration(DURATION_TIME);
				
				// event listener - when all animations are done.
				goog.events.listen(anim, lime.animation.Event.STOP, function()
				{
					moved++;
					if (moved == BOARD_SIZE + 1)
					{
						// 한 칸씩 옮긴다.
						board[curRow][curCol].img.setOpacity(1);
						puzzleGame.puzzleLayer.removeChild(board[BOARD_SIZE-1][curCol]);
						board[BOARD_SIZE-1][curCol] = null;
						for (var row = BOARD_SIZE-1 ; row > 0 ; row--)
						{
							board[row][curCol] = board[row-1][curCol];
						}
						board[0][curCol] = new_icon;
						
						if (isForBomb)
						{
							board.findBlocks('moveLine', {'row' : curRow, 'col' : curCol, 'direction' : direction});
						}
						else
						{
							puzzle.puzzleReleaseLock();
							//puzzleGame.lock = false;
							//console.log('puzzleGame.lock released - in scroll(' + x + ', ' + y + ', ' + direct + ', ' + isForBomb + ')');
						}
					}	
				});
				
				if (row == BOARD_SIZE)
				{
					new_icon.img.runAction(anim);
				}
				else
				{
					board[row][curCol].img.runAction(anim);
				}
			}
			break;
	}	
};