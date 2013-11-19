board.findBlocksSpecial = function(row, col)
{
	var result;
	var type = puzzleGame.board[row][col].typeOfSpecial;
	
	switch (type)
	{
		case SPECIAL_REPLACE:	 // 보드판 교체
			result = specialReplace(row, col);
			//isFound = false;
			break;
		case SPECIAL_SINGLELINE: // 한 줄 (가로, 세로)
			result = specialSingleLine(row, col);
			break;
		case SPECIAL_DOUBLELINE: // 두 줄 (십자가, 엑스자)
			result = specialDoubleLine(row, col);
			break;
		case SPECIAL_SURROUND:	 // 주변 8개
			result = specialSurround(row, col);
			break;
		case SPECIAL_ONETYPE:	 // 한 가지 종류
			result = specialOneType(row, col);
			break;
		case SPECIAL_TOTAL:		 // 전체
			result = specialTotal(row, col);
			break;
		case SPECIAL_EXPANDTIME: // 시간 연장
			result = specialExpandTime(row, col);
			break;
	}
	
	return result;
};

function specialReplace(row, col)
{
	console.log('special : replace');
	return {'isFound' : false, 'numOfFound' : 0};
}

function specialSingleLine(row, col)
{
	var numOfFound = 0;
	console.log('special : single line');
	if (Math.floor(Math.random()*2) == 0)
	{
		// vertical
		for (var i = 0 ; i < BOARD_SIZE ; i++)
		{
			if (puzzleGame.board[i][col].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][col].type *= -1;
				numOfFound++;
			}
		}
	}
	else
	{
		// horizontal
		for (var j = 0 ; j < BOARD_SIZE ; j++)
		{
			if (puzzleGame.board[row][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[row][j].type *= -1;
				numOfFound++;
			}
		}
	}
	
	// 자기 자신 (row, col) 에 있는 special piece는 없앤다.
	puzzleGame.board[row][col].type *= -1;
	numOfFound++;
	
	return {'isFound' : true, 'numOfFound' : numOfFound};
}

function specialDoubleLine(row, col)
{
	var numOfFound = 0;
	console.log('special : double line');
	if (Math.floor(Math.random()*2) == 0)
	{ 
		// 십자가
		for (var i = 0 ; i < BOARD_SIZE ; i++)
		{
			if (puzzleGame.board[i][col].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][col].type *= -1;
				numOfFound++;
			}
		}
		for (var j = 0 ; j < BOARD_SIZE ; j++)
		{
			if (puzzleGame.board[row][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[row][j].type *= -1;
				numOfFound++;
			}
		}
	}
	else
	{
		// 엑스자
		for (var i = row-1, j = col-1 ; i >= 0 && j >= 0 ; i--, j--)
		{
			if (puzzleGame.board[i][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}
		for (var i = row-1, j = col+1 ; i >= 0 && j < BOARD_SIZE ; i--, j++)
		{
			if (puzzleGame.board[i][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}
		for (var i = row+1, j = col-1 ; i < BOARD_SIZE && j >= 0 ; i++, j--)
		{
			if (puzzleGame.board[i][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}
		for (var i = row+1, j = col+1 ; i < BOARD_SIZE && j < BOARD_SIZE ; i++, j++)
		{
			if (puzzleGame.board[i][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}
	}
	
	// 자기 자신 (row, col) 에 있는 special piece는 없앤다.
	puzzleGame.board[row][col].type *= -1;
	numOfFound++;
	
	return {'isFound' : true, 'numOfFound' : numOfFound};
}

function specialSurround(row, col)
{
	var numOfFound = 0;
	console.log('special : surround');
	for (var i = row-1 ; i <= row+1 ; i++)
	{
		for (var j = col-1 ; j <= col+1 ; j++)
		{
			if (0 <= i && i < BOARD_SIZE && 0 <= j && j < BOARD_SIZE && puzzleGame.board[i][j].type != PIECE_SPECIAL) {
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}	
	}
	
	// 자기 자신 (row, col) 에 있는 special piece는 없앤다.
	puzzleGame.board[row][col].type *= -1;
	numOfFound++;
	
	return {'isFound' : true, 'numOfFound' : numOfFound};
}

function specialOneType(row, col)
{
	var numOfFound = 0;
	console.log('special : one type');
	var type = Math.floor(Math.random()*(NUM_OF_TYPES-1)) + 1;
	
	for (var i = 0 ; i < BOARD_SIZE ; i++)
	{
		for (var j = 0 ; j < BOARD_SIZE ; j++)
		{
			if (puzzleGame.board[i][j].type == type)
			{
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}	
	}
	
	// 자기 자신 (row, col) 에 있는 special piece는 없앤다.
	puzzleGame.board[row][col].type *= -1;
	numOfFound++;
	
	return {'isFound' : true, 'numOfFound' : numOfFound};
}

function specialTotal(row, col)
{
	var numOfFound = 0;
	console.log('special : total');
	for (var i = 0 ; i < BOARD_SIZE ; i++)
	{
		for (var j = 0 ; j < BOARD_SIZE ; j++)
		{
			if (puzzleGame.board[i][j].type != PIECE_SPECIAL)
			{
				puzzleGame.board[i][j].type *= -1;
				numOfFound++;
			}
		}
	}
			
	// 자기 자신 (row, col) 에 있는 special piece는 없앤다.
	puzzleGame.board[row][col].type *= -1;
	numOfFound++;
	
	return {'isFound' : true, 'numOfFound' : numOfFound};
}

function specialExpandTime(row, col)
{
	console.log('special : expand time 5 sec');
	puzzleGame.currentTime += 5;
	puzzleGame.currentTime = (puzzleGame.currentTime > puzzleGame.maxTime) ? puzzleGame.maxTime : puzzleGame.currentTime;
		
	// 자기 자신 (row, col) 에 있는 special piece는 없앤다.
	puzzleGame.board[row][col].type *= -1;
	
	return {'isFound' : true, 'numOfFound' : 1};
}
