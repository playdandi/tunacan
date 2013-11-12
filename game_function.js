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
				calc_board[i][j] = (end - k + 1 >= 3 && calc_board[i][j] > 0) ? -calc_board[i][j] : calc_board[i][j];
				isFound = (calc_board[i][j] < 0 || isFound) ? true : false;
			}
			if (end - k + 1 >= 3) {
				numOfFound += (end - k + 1);
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

/*
function loglog(fake_calc_board, tt) {
	console.log("=======", tt, " th", "==================");
	for (var ii = 0; ii < BOARD_SIZE; ii++) {
		str = '';
		for(var jj = 0; jj < BOARD_SIZE; jj++)
			str += fake_calc_board[ii][jj] + " ";
		console.log(str);
	}
	console.log("=======================================");
}
*/
