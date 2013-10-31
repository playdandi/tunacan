goog.provide('game_function');

// calc_board에서 터진 것들을 -1로 바꿔준다.
game_function.findMatchedBlocks = function() {
	var isFound = false; 
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
			if (end - k + 1 >= 3)
				k = end;
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
				calc_board[i][j] = (end - k + 1 >= 3 && calc_board[i][j] > 0) ? -calc_board[i][j] : calc_board[i][j];
				isFound = (calc_board[i][j] < 0 || isFound) ? true : false;
			}
			if (end - k + 1 >= 3)
				k = end;
		}
	}
	
	//return {'array' : checkArray, 'isFound' : isFound};
	return isFound;
};


game_function.fillElementsAndDrop = function() {
	//var newImgEachColumn = new Array(BOARD_SIZE);
	//var emptyCnt;
	
	/*
	// init.
	chgBoard = null;
	chgBoard = new Array(BOARD_SIZE);
	for (var i = 0; i < BOARD_SIZE; i++)
		chgBoard[i] = new Array(BOARD_SIZE);
	
	// 가짜 보드를 만들어, gravity 적용시켜 모든 아이템들을 밑으로 drop시킨다.
	for (var j = 0; j < BOARD_SIZE; j++) {
		emptyCnt = 0;
		for (var i = 0; i < BOARD_SIZE; i++) {
			emptyCnt += (calc_board[i][j] == -1) ? 1 : 0; // 1이면 터져서 비었다는 의미니까 cnt++ 해 준다.
			chgBoard[i][j] = calc_board[i][j];
		}
		// make new images.
		newImgEachColumn[j] = new Array(emptyCnt);
		for (var i = 0; i < emptyCnt; i++)
			newImgEachColumn[j][i] = res.createImageByRandom();
	}
	*/
	/*
	console.log("=============================");
	for (var i = 0; i < BOARD_SIZE; i++) {
		str = '';
		for( var j = 0; j < BOARD_SIZE; j++)
			str += calc_board[i][j] + " ";
		console.log(str);
	}
	console.log("=============================");
	//return;
	*/
	
	var retArray = new Array();
	
	for (var j = 0; j < BOARD_SIZE; j++) {
		for (var i = BOARD_SIZE-2; i >= 0; i--) {
			if (calc_board[i][j] < 0)
				continue;
			
			pos = -1;			
			for (var k = i+1; k < BOARD_SIZE; k++) {
				if (calc_board[k][j] > 0) {
					pos = k-1;
					break;
				}
			}
			pos = (pos == -1) ? BOARD_SIZE-1 : pos; // 최종적으로 떨어질 위치.
			
			if (pos - i > 0) { // 1 이상이란 말은, 1칸 이상 떨어뜨려야 한다는 말이므로, return array에 추가.
				board[pos][j] = board[i][j];
				calc_board[pos][j] = calc_board[i][j];
				board[i][j] = null;
				calc_board[i][j] = 0; // 텅 빈 위치.
				retArray.push({'row' : i, 'col' : j, 'drop' : pos - i});
			}
		}
		
		// 각 column마다 남는 공간만큼 image를 추가시킨다.
		// 새로 만든 image를 위에서부터 순서대로 넣자.
		var newLength = 0;
		for (var i = 0; i < BOARD_SIZE; i++) {
			if (calc_board[i][j] != 0) {
				newLength = i;
				break;
			}
		}
		//console.log("newLength : ", newLength);
		for (var i = 0; i < newLength; i++) {
			var newImg = res.createImageByRandom();
			board[i][j] = newImg.image;
			calc_board[i][j] = newImg.type;
			retArray.push({'row' : i-newLength, 'col' : j, 'drop' : newLength, 'img' : board[i][j], 'type' : calc_board[i][j]});
		}
	}
	
	// 이동시킬 아이템 (새로운 아이템 포함)의 좌표와 이동할 칸 수를 합쳐 array로 보낸다.
	// 또한 새로운 board도 보내면 좋을 것 같다.
	return retArray;
};
