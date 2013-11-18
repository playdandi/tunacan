board.findBlocksBasic = function()
{
	var board = puzzleGame.board;
	var isFound = false;
	var numOfFound = 0;
	var k;
	
	// initialize temp check array.
	var checkArray = new Array(BOARD_SIZE);
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		checkArray[row] = new Array(BOARD_SIZE);
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			checkArray[row][col] = 0;
		}
	}
		
	// horizontally check.
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		for (var col = 0 ; col < BOARD_SIZE-2 ; col++)
		{
			if (board[row][col].type == PIECE_SPECIAL)
			{
				 // special piece는 고려하지 않는다.
				continue;
			}

			k = col+1;
			while (k < BOARD_SIZE && board[row][col].type == board[row][k].type)
			{
				k++;
			}
			
			// 같은 piece가 3개 이상 연결되어 있으면 체크한다.
			if (k - col >= 3)
			{
				for (var temp = col ; temp < k ; temp++)
				{
					if (checkArray[row][temp] == 0)
					{
						// 1이면 이미 예전에 추가했었으니, 다시 추가하면 안 된다.
						numOfFound++;
					}
					checkArray[row][temp] = 1;
				}
				isFound = true;
				col = k-1;
			}
		}
	}
	
	// vertically check
	for (var col = 0 ; col < BOARD_SIZE ; col++)
	{
		for (var row = 0 ; row < BOARD_SIZE-2 ; row++)
		{
			if (board[i][j].type == PIECE_SPECIAL)
			{
				 // special piece는 고려하지 않는다.
				continue;
			}
			
			k = row+1;
			while (k < BOARD_SIZE && board[row][col].type == board[k][col].type)
			{
				k++;
			}
			
			// 같은 piece가 3개 이상 연결되어 있으면 체크한다.
			if (k - row >= 3)
			{
				for (var temp = row ; temp < k ; temp++)
				{
					if (checkArray[temp][col] == 0)
					{
						 // 1이면 이미 예전에 추가했었으니, 다시 추가하면 안 된다.
						numOfFound++;
					}
					checkArray[temp][col] = 1;
				}
				isFound = true;
				row = k-1;
			}
		}
	}
	
	// apply the area of bomb.
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			if (checkArray[row][col] == 1)
			{
				board[row][col].type *= -1;
			}
		}	
	}
	
	// free memories.
	k = null;
	checkArray = null;
	
	return {'isFound' : isFound, 'numOfFound' : numOfFound};
};


board.findBlocksFloodFill = function()
{
	var board = puzzleGame.board;
	var isFound = false;
	var numOfFound = 0;
	
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			if (board[row][col].type > 0 && board[row][col].type != PIECE_SPECIAL)
			{
				// check 3-connected parts with direction for right, left, down, up.
				var isValid1, isValid2, isValid3, isValid4;
				isValid1 = col < BOARD_SIZE-2 && board[row][col].type == board[row][col+1].type && board[row][col].type == board[row][col+2].type;
				isValid2 = col > 1 			  && board[row][col].type == board[row][col-1].type && board[row][col].type == board[row][col-2].type;
				isValid3 = row < BOARD_SIZE-2 && board[row][col].type == board[row+1][col].type && board[row][col].type == board[row+2][col].type;
				isValid4 = row > 1 			  && board[row][col].type == board[row-1][col].type && board[row][col].type == board[row-2][col].type;
				if (isValid1 || isValid2 || isValid3 || isValid4)
				{
					// floodfill recursion.
					numOfFound += flood(row, col, board[row][col].type, numOfFound);
					isFound = true;
				}
			}
		}
	}
	
	return {'isFound' : isFound, 'numOfFound' : numOfFound};
};

function flood(row, col, type)
{
	cnt = 0;
	board[row][col].type *= -1;
	if (col > 0 		   && board[row][col-1].type == type && board[row][col-1].type > 0) cnt += flood(row, col-1, type);
	if (col < BOARD_SIZE-1 && board[row][col+1].type == type && board[row][col+1].type > 0) cnt += flood(row, col+1, type);
	if (row > 0 		   && board[row-1][col].type == type && board[row-1][col].type > 0) cnt += flood(row-1, col, type);
	if (row < BOARD_SIZE-1 && board[row+1][col].type == type && board[row+1][col].type > 0) cnt += flood(col+1, col, type);
	return cnt + 1;
}



/*
 * get dropping pieces (including new pieces).
 * @return
 */
board.getDroppingPieces = function()
{
	// initialize type check array.
	var boardType = new Array(BOARD_SIZE);
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		boardType[row] = new Array(BOARD_SIZE);
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			boardType[row][col] = board[row][col].type;
		}
	}
	
	var result = new Array();
	
	// drop해야 할 piece들을 모두 찾는다.
	for (var col = 0 ; col < BOARD_SIZE; col++)
	{
		for (var row = BOARD_SIZE-1 ; row >= 0 ; row--)
		{
			// bomb된 piece들은 0으로 바꿔서 빈 칸임을 나타내도록 한다.
			if (boardType[row][col] < 0)
			{
				boardType[row][col] = 0;
				continue;
			}
			
			// (row, col) 좌표에 있는 piece가 떨어질 위치를 찾는다.
			pos = -1;
			for (var k = row+1 ; k < BOARD_SIZE ; k++)
			{
				if (boardType[k][col] > 0)
				{
					pos = k-1;
					break;
				}
			}
			pos = (pos == -1) ? BOARD_SIZE-1 : pos; // 최종적으로 떨어질 위치.
			
			if (pos - row > 0)
			{ 
				// 1 이상이란 말은, 1칸 이상 떨어뜨려야 한다는 말이므로, return array에 추가.
				boardType[pos][col] = boardType[row][col];
				boardType[row][col] = 0; // 텅 빈 위치.
				result.push({'row' : row, 'col' : col, 'drop' : pos - row});
			}
		}
		
		// 각 column마다 남는 공간만큼 image를 추가시킨다.
		var newLength = 0;
		for (var row = 0 ; row < BOARD_SIZE ; row++)
		{
			if (boardType[row][col] == 0)
			{
				newLength++;
			}
		}
		for (var row = 0 ; row < newLength ; row++)
		{
			var newPiece = board.createPiece(null, null, null);
			//boardType[row][col] = newPiece.type;
			result.push({'row' : row-newLength, 'col' : col, 'drop' : newLength, 'piece' : newPiece});
		}
	}
	
	// 큰 row부터 처리하도록 정렬.
	result.sort(cmp);
	
	// free memories.
	boardType = null;
		
	return result;
};

function cmp(a, b)
{
	return b.row - a.row;
}


/*
 * 
 */
board.hasToBeReplaced = function()
{
	// initialize temp check array
	var boardType = new Array(BOARD_SIZE);
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		boardType[row] = new Array(BOARD_SIZE);
		for (var col = 0 ; col < BOARD_SIZE ; col++)
		{
			boardType[row][col] = board[row][col].type;
		}
	}
	
	puzzleGame.hintDirection = null; // direction for hint.
	puzzleGame.hintLine = null; // n-th line for hint.
	puzzleGame.hintCoord = null; // row, col coordinates for hint (only for special piece).
	
	// randomly take direction to be checked first.
	var whichDirectionFirst = Math.floor(Math.random()*2);
	if (whichDirectionFirst == 0)
	{
		if (!checkHorizontally(boardType))
		{
			boardType = null;
			return false;
		}
		if (!checkVertically(boardType))
		{
			boardType = null;
			return false;
		}
	}
	else
	{
		if (!checkVertically(boardType))
		{
			boardType = null;
			return false;
		}
		if (!checkHorizontally(boardType))
		{
			boardType = null;
			return false;
		}
	}
	
	// check special pieces.
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		for (var col = 0; col < BOARD_SIZE ; col++)
		{
			if (boardType[row][col] == PIECE_SPECIAL)
			{
				puzzleGame.hintDirection = -1;
				puzzleGame.hintCoord = {'row' : row, 'col' : col};
				boardType = null;
				return false;
			}
		}
	}
	
	// free memories.
	boardType = null;
	
	return true;
};

function checkHorizontally(boardType)
{
	// horizontally move & check
	puzzleGame.hintDirection = 0;
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		puzzleGame.hintLine = row;
		// left
		moveLeft(row, boardType);
		if (checkMatchedBlocks(boardType))
		{
			return false;
		}
			
		// right
		moveRightTwice(row, boardType);
		if (checkMatchedBlocks(boardType))
		{
			return false;
		}
		
		moveLeft(row, boardType);
	}
	
	return true;
}

function checkVertically(boardType)
{
	// vertically move & check
	puzzleGame.hintDirection = 1;
	for (var col = 0 ; col < BOARD_SIZE ; col++)
	{
		puzzleGame.hintLine = col;
		// up
		moveUp(col, boardType);
		if (checkMatchedBlocks(boardType))
		{
			return false;
		}
			
		// down
		moveDownTwice(col, boardType);
		if (checkMatchedBlocks(boardType))
		{
			return false;
		}
		
		moveUp(col, boardType);
	}
	
	return true;
}

function checkMatchedBlocks(boardType)
{
	// horizontally check
	for (var row = 0 ; row < BOARD_SIZE ; row++)
	{
		for (var col = 0 ; col < BOARD_SIZE-2 ; col++)
		{
			if (boardType[row][col] == boardType[row][col+1] && boardType[row][col] == boardType[row][col+2])
			{
				return true;
			}
		}
	}
	
	// vertically check
	for (var col = 0 ; col < BOARD_SIZE ; col++)
	{
		for (var row = 0 ; row < BOARD_SIZE-2 ; row++)
		{
			if (boardType[row][col] == boardType[row+1][col] && boardType[row][col] == boardType[row+2][col])
			{
				return true;
			}
		}
	}
	
	return false;
}

function moveLeft(row, boardType)
{
	temp = boardType[row][0];
	for (var col = 1 ; col < BOARD_SIZE ; col++)
	{
		boardType[row][col-1] = boardType[row][col];
	}
	boardType[row][BOARD_SIZE-1] = temp;
}

function moveRightTwice(row, boardType)
{
	temp1 = boardType[row][BOARD_SIZE-1];
	temp2 = boardType[row][BOARD_SIZE-2];
	for (var col = BOARD_SIZE-3 ; col >= 0 ; col--)
	{
		boardType[row][col+2] = boardType[row][col];
	}
	boardType[row][1] = temp1;
	boardType[row][0] = temp2;
}

function moveUp(col, boardType)
{
	temp = boardType[0][col];
	for (var row = 1 ; row < BOARD_SIZE ; row++)
	{
		boardType[row-1][col] = boardType[row][col];
	}
	boardType[BOARD_SIZE-1][col] = temp;
}

function moveDownTwice(col, boardType)
{
	temp1 = boardType[BOARD_SIZE-1][col];
	temp2 = boardType[BOARD_SIZE-2][col];
	for (var row = BOARD_SIZE-3 ; row >= 0 ; row--)
	{
		boardType[row+2][col] = boardType[row][col];
	}
	boardType[1][col] = temp1;
	boardType[0][col] = temp2;
}