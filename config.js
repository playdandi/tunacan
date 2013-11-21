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

// puzzle common set
var PUZZLE_PLAY_TIME = 60;

// score Variable
var BASIC_SCORE = 20;
var MAXIMUM_GAUGE = 250;

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
var PUZZLE_TOTAL_RESOURCE_COUNT = 3;
var COMMON_TOTAL_RESOURCE_COUNT = 1;
var RAISE_TOTAL_RESOURCE_COUNT = 1;
var FRAME_WIDTH = 63;
var FRAME_HEIGHT = 63;

// board
var BOARD_SIZE = 7;
var PUZZLE_X = (SCREEN_WIDTH-(FRAME_WIDTH*BOARD_SIZE))/2;
var PUZZLE_Y = SCREEN_HEIGHT-100-(FRAME_HEIGHT*BOARD_SIZE);
var DURATION_TIME = 0.2; // puzzle piece animation duration

// common
var MAX_HEART_NUM = 5;
var HEART_WAITING_TIME = 60*12;

// combo random messages.
var comboMessage = new Array();
comboMessage[0] = new Array();
comboMessage[0][0] = "A 참치 캔의 재료는 어디 있을까?";
comboMessage[0][1] = "B 참치 캔의 재료는 어디 있을까?";
comboMessage[0][2] = "C 참치 캔의 재료는 어디 있을까?";
comboMessage[0][3] = "D 참치 캔의 재료는 어디 있을까?";

comboMessage[1] = new Array();
comboMessage[1][0] = "A 하나 하나 잘 찾아봐~";
comboMessage[1][1] = "B 하나 하나 잘 찾아봐~";
comboMessage[1][2] = "C 하나 하나 잘 찾아봐~";
comboMessage[1][3] = "D 하나 하나 잘 찾아봐~";

comboMessage[2] = new Array();
comboMessage[2][0] = "다음 재료는 어디 있을까?";

comboMessage[3] = new Array();
comboMessage[3][0] = "지금 부터 콤보 찬스!!";

comboMessage[4] = new Array();
comboMessage[4][0] = "우와 대단해!";

comboMessage[5] = new Array();
comboMessage[5][0] = "놀랍구나!";

comboMessage[6] = new Array();
comboMessage[6][0] = "이정도야?";

comboMessage[7] = new Array();
comboMessage[7][0] = "언제까지?";

comboMessage[8] = new Array();
comboMessage[8][0] = "할미새 사촌";
comboMessage[8][1] = "할미새 사촌에 사촌";
comboMessage[8][2] = "할미새 사촌에 사촌에 사촌";
comboMessage[8][3] = "할미새 사촌에 사촌에 사촌에 사촌";
comboMessage[8][4] = "할미새 오촌";

