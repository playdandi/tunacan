// puzzle pieces
var NUM_OF_TYPES = 7;
var PIECE_COW = 1;
var PIECE_CABBAGE = 2;
var PIECE_PEPPER = 3;
var PIECE_OLIVE = 4;
var PIECE_CHEESE = 5;
var PIECE_TOMATO = 6;
var PIECE_SPECIAL = 7;
var INGREDIENT_PROBABILITY = 10;

// special puzzle pieces
var NUM_OF_SPECIAL_TYPES = 7;
var SPECIAL_REPLACE = 0;
var SPECIAL_SINGLELINE = 1;
var SPECIAL_DOUBLELINE = 2;
var SPECIAL_SURROUND = 3;
var SPECIAL_ONETYPE = 4;
var SPECIAL_TOTAL = 5;
var SPECIAL_EXPANDTIME = 6;

// screen
var SCREEN_WIDTH = 461;
var SCREEN_HEIGHT = 768;

// resources
var TOTAL_RESOURCE_COUNT = 3;
var FRAME_WIDTH = 63;
var FRAME_HEIGHT = 63;

// board
var BOARD_SIZE = 7;
var PUZZLE_X = (SCREEN_WIDTH-(FRAME_WIDTH*BOARD_SIZE))/2;
var PUZZLE_Y = SCREEN_HEIGHT-100-(FRAME_HEIGHT*BOARD_SIZE);
var DURATION_TIME = 0.2; // puzzle piece animation duration


// combo random messages.
var combo_message = new Array();		
combo_message[0] = "참치 캔의 재료는 어디 있을까?";
combo_message[1] = "하나 하나 잘 찾아봐~";
combo_message[2] = "다음 재료는 어디 있을까?";
combo_message[3] = "지금 부터 콤보 찬스!!";
combo_message[4] = "우와 대단해!";
combo_message[5] = "놀랍구나!";
combo_message[6] = "이정도야?";
combo_message[7] = "언제까지?";
combo_message[8] = "할미새 사촌";