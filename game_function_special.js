//goog.provide('game_function');

var numOfSpecialTypes = 7;
var SPECIAL_REPLACE = 0;
var SPECIAL_SINGLELINE = 1;
var SPECIAL_DOUBLELINE = 2;
var SPECIAL_SURROUND = 3;
var SPECIAL_ONETYPE = 4;
var SPECIAL_TOTAL = 5;
var SPECIAL_EXPANDTIME = 6;

var numOfFound;
game_function.specialBomb = function(type, x, y) {
	numOfFound = 0;
	var isFound = true;
	switch (type) {
		case SPECIAL_REPLACE:	 // 보드판 교체
			specialReplace(x, y); isFound = false; break;
		case SPECIAL_SINGLELINE: // 한 줄 (가로, 세로)
			specialSingleLine(x, y); break;
		case SPECIAL_DOUBLELINE: // 두 줄 (십자가, 엑스자)
			specialDoubleLine(x, y); break;
		case SPECIAL_SURROUND:	 // 주변 8개
			specialSurround(x, y); break;
		case SPECIAL_ONETYPE:	 // 한 가지 종류
			specialOneType(x, y); break;
		case SPECIAL_TOTAL:		 // 전체
			specialTotal(x, y); break;
		case SPECIAL_EXPANDTIME: // 시간 연장
			specialExpandTime(x, y); break;
	}
	
	return {'isFound' : isFound, 'numOfFound' : numOfFound};
};

function specialReplace(x, y) {
	console.log('special : replace');
	boardInit(x, y);
	//numOfFound++;
}

function specialSingleLine(x, y) {
	console.log('special : single line');
	if (Math.floor(Math.random() * 2) == 0) { // 세로
		for (var i = 0; i < BOARD_SIZE; i++)
			if (board[i][y].type != PIECE_SPECIAL) {
				board[i][y].type *= -1;
				numOfFound++;
			}
	}
	else { // 가로
		for (var j = 0; j < BOARD_SIZE; j++)
			if (board[x][j].type != PIECE_SPECIAL) {
				board[x][j].type *= -1;
				numOfFound++;
			}
	}
	board[x][y].type *= -1;
	numOfFound++;
}

function specialDoubleLine(x, y) {
	console.log('special : double line');
	if (Math.floor(Math.random() * 2) == 0) { // 십자가
		for (var i = 0; i < BOARD_SIZE; i++)
			if (board[i][y].type != PIECE_SPECIAL) {
				board[i][y].type *= -1;
				numOfFound++;
			}
		for (var j = 0; j < BOARD_SIZE; j++)
			if (board[x][j].type != PIECE_SPECIAL) {
				board[x][j].type *= -1;
				numOfFound++;
			}
	}
	else { // 엑스자
		for (var i = x-1, j = y-1; i >= 0 && j >= 0; i--, j--) 
			if (board[i][j].type != PIECE_SPECIAL) {
				board[i][j].type *= -1;
				numOfFound++;
			}
		for (var i = x-1, j = y+1; i >= 0 && j < BOARD_SIZE; i--, j++)
			if (board[i][j].type != PIECE_SPECIAL) {
				board[i][j].type *= -1;
				numOfFound++;
			}
		for (var i = x+1, j = y-1; i < BOARD_SIZE && j >= 0; i++, j--)
			if (board[i][j].type != PIECE_SPECIAL) {
				board[i][j].type *= -1;
				numOfFound++;
			}
		for (var i = x+1, j = y+1; i < BOARD_SIZE && j < BOARD_SIZE; i++, j++)
			if (board[i][j].type != PIECE_SPECIAL) {
				board[i][j].type *= -1;
				numOfFound++;
			}
	}
	board[x][y].type *= -1;
	numOfFound++;
}

function specialSurround(x, y) {
	console.log('special : surround');
	for (var i = x-1; i <= x+1; i++)
		for (var j = y-1; j <= y+1; j++)
			if (0 <= i && i < BOARD_SIZE && 0 <= j && j < BOARD_SIZE && board[i][j].type != PIECE_SPECIAL) {
				board[i][j].type *= -1;
				numOfFound++;
			}
	board[x][y].type *= -1;
	numOfFound++;
}

function specialOneType(x, y) {
	console.log('special : one type');
	var type = Math.floor(Math.random() * (numOfTypes-1)) + 1;
	for (var i = 0; i < BOARD_SIZE; i++)
		for (var j = 0; j < BOARD_SIZE; j++)
			if (board[i][j].type == type) {
				board[i][j].type *= -1;
				numOfFound++;
			}
	board[x][y].type *= -1;
	numOfFound++;
}

function specialTotal(x, y) {
	console.log('special : total');
	for (var i = 0; i < BOARD_SIZE; i++)
		for (var j = 0; j < BOARD_SIZE; j++)
			if (board[i][j].type != PIECE_SPECIAL) {
				board[i][j].type *= -1;
				numOfFound++;
			}
	board[x][y].type *= -1;
	numOfFound++;
}

function specialExpandTime(x, y) {
	console.log('special : expand time 5 sec');
	curTime += 5;
	if (curTime > maxTime)
		curTime = maxTime;
	board[x][y].type *= -1;
	numOfFound++;
}
