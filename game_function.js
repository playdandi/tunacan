goog.provide('game_function');


game_function.findMatchedBlocks = function() {
	var isFound = false;
	var numOfFound = 0; 
	var end;

	// horizontally check.
	for (var i = 0; i < BOARD_SIZE; i++) {
		for (var k = 0; k < BOARD_SIZE; k++) {
			end = k; // k 이상 j 이하가 모두 같은 puzzle type이다.
			for (var j = k+1; j < BOARD_SIZE; j++) {
				if (board[i][j].type == board[i][k].type)
					end = j;
				else
					break;
			}
			// calc_board type을 바꿔준다 (터질 퍼즐은 음수로).
			for (var j = k; j <= end; j++) {
				board[i][j].type = (end - k + 1 >= 3) ? -board[i][j].type : board[i][j].type;
				isFound = (board[i][j].type < 0 || isFound) ? true : false;
			}
			if (end - k + 1 >= 3) {
				numOfFound += (end - k + 1);
				k = end;
			}
		}
	}
	
	// vertically check.
	for (var j = 0; j < BOARD_SIZE; j++) {
		for (var k = 0; k < BOARD_SIZE; k++) {
			end = k; // k 이상 j 이하가 모두 같은 puzzle type이다.
			for (var i = k+1; i < BOARD_SIZE; i++) {
				var ij = (board[i][j].type < 0) ? -board[i][j].type : board[i][j].type;
				var kj = (board[k][j].type < 0) ? -board[k][j].tyoe : board[k][j].type;
				if (ij == kj)
					end = i;
				else
					break;
			}
			// calc_board type을 바꿔준다 (터질 퍼즐은 음수로).
			for (var i = k; i <= end; i++) {
				if (end - k + 1 >= 3 && board[i][j].type > 0)
					numOfFound++;
				board[i][j].type = (end - k + 1 >= 3 && board[i][j].type > 0) ? -board[i][j].type : board[i][j].type;
				isFound = (board[i][j].type < 0 || isFound) ? true : false;
			}
			if (end - k + 1 >= 3)
				k = end;
		}
	}
	
	return {'isFound' : isFound, 'numOfFound' : numOfFound};
};



var numOfFound;
game_function.findMatchedBlocksFloodFill = function() {
	var isFound = false;
	numOfFound = 0;
	
	for (var i = 0; i < BOARD_SIZE; i++) {
		for (var j = 0; j < BOARD_SIZE; j++) {
			if (board[i][j].type > 0) {
				// check 3-connected parts with direction for right, left, down, up.
				var isValid1, isValid2, isValid3, isValid4;
				isValid1 = j < BOARD_SIZE-2 && board[i][j].type == board[i][j+1].type && board[i][j].type == board[i][j+2].type;
				isValid2 = j > 1 && board[i][j].type == board[i][j-1].type && board[i][j].type == board[i][j-2].type;
				isValid3 = i < BOARD_SIZE-2 && board[i][j].type == board[i+1][j].type && board[i][j].type == board[i+2][j].type;
				isValid4 = i > 1 && board[i][j].type == board[i-1][j].type && board[i][j].type == board[i-2][j].type;
				if (isValid1 || isValid2 || isValid3 || isValid4) {
					flood(i, j, board[i][j].type); // floodfill recursion.
					isFound = true;
				}
			}
		}
	}
	
	return {'isFound' : isFound, 'numOfFound' : numOfFound};
};

function flood(x, y, type) {
	numOfFound++;
	board[x][y].type *= -1;
	if (y > 0 			 && board[x][y-1].type == type && board[x][y-1].type > 0) flood(x, y-1, type);
	if (y < BOARD_SIZE-1 && board[x][y+1].type == type && board[x][y+1].type > 0) flood(x, y+1, type);
	if (x > 0 			 && board[x-1][y].type == type && board[x-1][y].type > 0) flood(x-1, y, type);
	if (x < BOARD_SIZE-1 && board[x+1][y].type == type && board[x+1][y].type > 0) flood(x+1, y, type);
}



game_function.fillElementsAndDrop = function() {
	var fake_calc_board = new Array(BOARD_SIZE);
	for (var i = 0; i < BOARD_SIZE; i++) {
		fake_calc_board[i] = new Array(BOARD_SIZE);
		for (var j = 0; j < BOARD_SIZE; j++)
			fake_calc_board[i][j] = board[i][j].type;
	}
	var retArray = new Array();
	
	for (var j = 0; j < BOARD_SIZE; j++) {
		for (var i = BOARD_SIZE-2; i >= 0; i--) {
			if (fake_calc_board[i][j] <= 0) {
				fake_calc_board[i][j] = 0;
				continue;
			}
				
			pos = -1;
			for (var k = i+1; k < BOARD_SIZE; k++) {
				if (fake_calc_board[k][j] > 0) {
					pos = k-1;
					break;
				}
			}
			pos = (pos == -1) ? BOARD_SIZE-1 : pos; // 최종적으로 떨어질 위치.
			
			if (pos - i > 0) { // 1 이상이란 말은, 1칸 이상 떨어뜨려야 한다는 말이므로, return array에 추가.
				fake_calc_board[pos][j] = fake_calc_board[i][j];
				fake_calc_board[i][j] = 0; // 텅 빈 위치.
				retArray.push({'row' : i, 'col' : j, 'drop' : pos - i});
			}
		}
		
		// 각 column마다 남는 공간만큼 image를 추가시킨다.
		// 새로 만든 image를 위에서부터 순서대로 넣자.
		var newLength = 0;
		for (var i = 0; i < BOARD_SIZE; i++) {
			if (fake_calc_board[i][j] == 0)
				newLength++;
		}

		for (var i = 0; i < newLength; i++) {
			//var newPiece = piece();
			//var newPiece = //res.createImageByRandom();
			var newPiece = res.createPiece(0);
			fake_calc_board[i][j] = newPiece.type;
			//retArray.push({'row' : i-newLength, 'col' : j, 'drop' : newLength, 'img' : newImg.image, 'type' : newImg.type});
			retArray.push({'row' : i-newLength, 'col' : j, 'drop' : newLength, 'piece' : newPiece});
		}
	}
	
	retArray.sort(cmp);
		
	// 이동시킬 아이템 (새로운 아이템 포함)의 좌표와 이동할 칸 수를 합쳐 array로 보낸다.
	// 또한 새로운 board도 보내면 좋을 것 같다.
	return retArray;
};

function cmp(a, b) {
	return b.row - a.row;
}


game_function.isBoardUseless = function() {
	var check_board = new Array(BOARD_SIZE);
	for (var i = 0; i < BOARD_SIZE; i++) {
		check_board[i] = new Array(BOARD_SIZE);
		for (var j = 0; j < BOARD_SIZE; j++)
			check_board[i][j] = board[i][j].type;
	}
	
	hint_direction = null; // direction for hint.
	hint_line = null; // n-th line for hint.
	
	// randomly take direction to be checked first.
	var whichDirectionFirst = Math.floor(Math.random() * 2);
	if (whichDirectionFirst == 0)
	{
		if(!checkHorizontally(check_board)) {
			check_board = null;
			return false;
		}
		if(!checkVertically(check_board)) {
			check_board = null;
			return false;
		}
	}
	else
	{
		if(!checkVertically(check_board)) {
			check_board = null;
			return false;
		}
		if(!checkHorizontally(check_board)) {
			check_board = null;
			return false;
		}
	}
	
	check_board = null;
	return true;
};

function checkHorizontally(check_board) {
	// horizontally move & check
	hint_direction = 0;
	for (var i = 0; i < BOARD_SIZE; i++) {
		hint_line = i;
		// left
		moveLeft(i, check_board);
		if (checkMatchedBlocks(check_board))
			return false;
			
		// right
		moveRightTwice(i, check_board);
		if (checkMatchedBlocks(check_board))
			return false;
		
		moveLeft(i, check_board);
	}
	return true;
}

function checkVertically(check_board) {
	// vertically move & check
	hint_direction = 1;
	for (var j = 0; j < BOARD_SIZE; j++) {
		hint_line = j;
		// up
		moveUp(j, check_board);
		if (checkMatchedBlocks(check_board))
			return false;
			
		// down
		moveDownTwice(j, check_board);
		if (checkMatchedBlocks(check_board))
			return false;
		
		moveUp(j, check_board);
	}
	return true;
}

function checkMatchedBlocks(check_board) {
	// horizontally check
	for (var i = 0; i < BOARD_SIZE; i++)
		for (var j = 0; j < BOARD_SIZE-2; j++)
			if (check_board[i][j] == check_board[i][j+1] && check_board[i][j] == check_board[i][j+2]) {
				check_board = null;
				return true;
			}
	
	// vertically check
	for (var j = 0; j < BOARD_SIZE; j++)
		for (var i = 0; i < BOARD_SIZE-2; i++)
			if (check_board[i][j] == check_board[i+1][j] && check_board[i][j] == check_board[i+2][j]) {
				check_board = null;
				return true;
			}
	
	return false;
}

function moveLeft(i, check_board) {
	temp = check_board[i][0];
	for (var j = 1; j < BOARD_SIZE; j++)
		check_board[i][j-1] = check_board[i][j];
	check_board[i][BOARD_SIZE-1] = temp;
}

function moveRightTwice(i, check_board) {
	temp1 = check_board[i][BOARD_SIZE-1];
	temp2 = check_board[i][BOARD_SIZE-2];
	for (var j = BOARD_SIZE-3; j >= 0; j--)
		check_board[i][j+2] = check_board[i][j];
	check_board[i][1] = temp1;
	check_board[i][0] = temp2;
}

function moveUp(j, check_board) {
	temp = check_board[0][j];
	for (var i = 1; i < BOARD_SIZE; i++)
		check_board[i-1][j] = check_board[i][j];
	check_board[BOARD_SIZE-1][j] = temp;
}

function moveDownTwice(j, check_board) {
	temp1 = check_board[BOARD_SIZE-1][j];
	temp2 = check_board[BOARD_SIZE-2][j];
	for (var i = BOARD_SIZE-3; i >= 0; i--)
		check_board[i+2][j] = check_board[i][j];
	check_board[1][j] = temp1;
	check_board[0][j] = temp2;
}

