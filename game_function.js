goog.provide('game_function');

// calc_board에서 터진 것들을 -1로 바꿔준다.
game_function.findMatchedBlocks = function() {
	var isFound = false;
	var numOfFound = 0; 
	var end;

	// horizontally check.
	for (var i = 0; i < BOARD_SIZE; i++) {
		for (var k = 0; k < BOARD_SIZE; k++) {
			end = k; // k 이상 j 이하가 모두 같은 puzzle type이다.
			for(var j = k+1; j < BOARD_SIZE; j++) {
				if (calc_board[i][j] == calc_board[i][k])
					end = j;
				else
					break;
			}
			// calc_board type을 바꿔준다 (터질 퍼즐은 음수로).
			for (var j = k; j <= end; j++) {
				calc_board[i][j] = (end - k + 1 >= 3) ? -calc_board[i][j] : calc_board[i][j];
				isFound = (calc_board[i][j] < 0 || isFound) ? true : false;
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
			for(var i = k+1; i < BOARD_SIZE; i++) {
				var ij = (calc_board[i][j] < 0) ? -calc_board[i][j] : calc_board[i][j];
				var kj = (calc_board[k][j] < 0) ? -calc_board[k][j] : calc_board[k][j];
				//if (calc_board[i][j] != calc_board[k][j]) {
				if (ij == kj)
					end = i;
				else
					break;
			}
			// calc_board type을 바꿔준다 (터질 퍼즐은 음수로).
			for (var i = k; i <= end; i++) {
				if (end - k + 1 >= 3 && calc_board[i][j] > 0)
					numOfFound++;
				calc_board[i][j] = (end - k + 1 >= 3 && calc_board[i][j] > 0) ? -calc_board[i][j] : calc_board[i][j];
				isFound = (calc_board[i][j] < 0 || isFound) ? true : false;
			}
			if (end - k + 1 >= 3) {
				//numOfFound += (end - k + 1);
				k = end;
			}
		}
	}
	
	return {'isFound' : isFound, 'numOfFound' : numOfFound};
};


game_function.fillElementsAndDrop = function() {
	var fake_calc_board = calc_board;
	//loglog(fake_calc_board, 'hahaa');
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
				//board[pos][j] = board[i][j];
				fake_calc_board[pos][j] = fake_calc_board[i][j];
				//board[i][j] = null;
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
		//loglog(fake_calc_board, j);
		//console.log("newLength : ", newLength);
		for (var i = 0; i < newLength; i++) {
			var newImg = res.createImageByRandom();
			//board[i][j] = newImg.image;
			fake_calc_board[i][j] = newImg.type;
			retArray.push({'row' : i-newLength, 'col' : j, 'drop' : newLength, 'img' : newImg.image, 'type' : newImg.type});
		}
	}
	
	// 이동시킬 아이템 (새로운 아이템 포함)의 좌표와 이동할 칸 수를 합쳐 array로 보낸다.
	// 또한 새로운 board도 보내면 좋을 것 같다.
	//console.log(retArray);
	return retArray;
};


game_function.isBoardUseless = function() {
	var check_board = new Array(BOARD_SIZE);
	for (var i = 0; i < BOARD_SIZE; i++) {
		check_board[i] = new Array(BOARD_SIZE);
		for (var j = 0; j < BOARD_SIZE; j++)
			check_board[i][j] = calc_board[i][j];
	}
	
	// horizontally move & check
	for (var i = 0; i < BOARD_SIZE; i++) {
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
	
	// vertically move & check
	for (var j = 0; j < BOARD_SIZE; j++) {
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
	
	check_board = null;
	return true;
};

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

