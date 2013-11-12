goog.provide('game_info');

// puzzle pieces
var numOfTypes = 6+1;
var BOARDELEM_COW = 1;
var BOARDELEM_CABBAGE = 2;
var BOARDELEM_PEPPER = 3;
var BOARDELEM_OLIVE = 4;
var BOARDELEM_CHEESE = 5;
var BOARDELEM_TOMATO = 6;
var numOfGetPieces = new Array(numOfTypes);

// game
var combo;
var score;
var gauge;

var hint_direction;
var hint_line;

// board
var BOARD_SIZE = 7;
var DEFAULT_X = (720-(63*BOARD_SIZE))/2;
var DEFAULT_Y = (1280-(63*BOARD_SIZE))/2;
var board;
var calc_board;

//global variables
var DURATION_TIME = 0.2;
var layer;
var lock;

