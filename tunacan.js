//set main namespace
goog.provide('tunacan');

// get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.fill.Fill');
goog.require('lime.fill.Image');
goog.require('lime.fill.Frame');
goog.require('lime.Node');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.Spawn');

//define
var BOARDELEM_COW = 1;
var BOARDELEM_CABBAGE = 2;
var BOARDELEM_PEPPER = 3;
var BOARDELEM_OLIVE = 4;
var BOARDELEM_CHEESE = 5;
var BOARDELEM_TOMATO = 6;

var BOARD_SIZE = 7;
var DEFAULT_X = (720-(63*BOARD_SIZE))/2;
var DEFAULT_Y = (1280-(63*BOARD_SIZE))/2;

var DURATION_TIME = 0.5;

//global variables
var board = new Array(BOARD_SIZE), calc_board = new Array(BOARD_SIZE);
var icons = new Array(7);
var layer;

// entry point
tunacan.start = function() {
	var director = new lime.Director(document.body, 720, 1280);
	var scene = new lime.Scene();
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(720, 1280).setFill("#000000");
	var mask = new lime.Sprite().setAnchorPoint(0, 0).setSize(63*BOARD_SIZE, 63*BOARD_SIZE).setPosition(DEFAULT_X, DEFAULT_Y);
	
	var icon_image = new lime.fill.Image("assets/puzzle_icon.png");
	icons[BOARDELEM_COW] = new lime.fill.Frame(icon_image.getImageElement(), 63*0, 0, 63, 63);
	icons[BOARDELEM_CABBAGE] = new lime.fill.Frame(icon_image.getImageElement(), 63*1, 0, 63, 63);
	icons[BOARDELEM_PEPPER] = new lime.fill.Frame(icon_image.getImageElement(), 63*2, 0, 63, 63);
	icons[BOARDELEM_OLIVE] = new lime.fill.Frame(icon_image.getImageElement(), 63*3, 0, 63, 63);
	icons[BOARDELEM_CHEESE] = new lime.fill.Frame(icon_image.getImageElement(), 63*4, 0, 63, 63);
	icons[BOARDELEM_TOMATO] = new lime.fill.Frame(icon_image.getImageElement(), 63*5, 0, 63, 63);
	
	layer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0,0);
	layer.appendChild(rect);
	
	for(var i = 0 ; i < BOARD_SIZE ; i++)
	{
		board[i] = new Array(BOARD_SIZE);
		calc_board[i] = new Array(BOARD_SIZE);
		for(var j = 0 ; j < BOARD_SIZE ; j++)
		{
			var icon_index = Math.floor(Math.random() * 6)+1;
			board[i][j] = new lime.Sprite().setFill(icons[icon_index]).setAnchorPoint(0, 0);
			calc_board[i][j] = icon_index;
			layer.appendChild(board[i][j].setPosition(j*63+DEFAULT_X, i*63+DEFAULT_Y));
		}
		console.log(calc_board[i][0], calc_board[i][1], calc_board[i][2], calc_board[i][3], calc_board[i][4], calc_board[i][5], calc_board[i][6]);
	}
	
	layer.setMask(mask);
	
	scene.appendChild(mask);
	scene.appendChild(layer);
	director.makeMobileWebAppCapable();	
	director.replaceScene(scene);
	
	var next_x = Math.floor(Math.random() * 7);
	var next_y = Math.floor(Math.random() * 7);
	var next_direct = Math.floor(Math.random() * 4)+1;
	scroll(next_x, next_y, next_direct);
};

function scroll(x, y, direct) //direct 1: left, 2: right, 3: up, 4: down
{
	var new_icon;
	var move_action;
	board[y][x].setOpacity(0.5);
	switch(direct)
	{
		case 1: //left
		{
			new_icon = new lime.Sprite().setFill(icons[calc_board[y][0]]).setAnchorPoint(0, 0);
			layer.appendChild(new_icon.setPosition(BOARD_SIZE*63+DEFAULT_X, y*63+DEFAULT_Y));
			for(var i = 0 ; i < BOARD_SIZE ; i++)
			{
				board[y][i].runAction(new lime.animation.MoveBy(-63, 0).setDuration(DURATION_TIME));
			}
			move_action = new lime.animation.MoveBy(-63, 0).setDuration(DURATION_TIME);
			new_icon.runAction(move_action);
			
			goog.events.listen(move_action, lime.animation.Event.STOP, function(){
				board[y][x].setOpacity(1);
				var temp = calc_board[y][0];
				board[y][0] = null;				
				for(var i = 0 ; i < BOARD_SIZE-1 ; i++)
				{
					board[y][i] = board[y][i+1];
					calc_board[y][i] = calc_board[y][i+1];
				}
				board[y][BOARD_SIZE-1] = new_icon;
				calc_board[y][BOARD_SIZE-1] = temp;
				
				var next_x = Math.floor(Math.random() * 7);
				var next_y = Math.floor(Math.random() * 7);
				var next_direct = Math.floor(Math.random() * 4)+1;
				scroll(next_x, next_y, next_direct);
			});
			break;
		}
		case 2: //right
		{
			new_icon = new lime.Sprite().setFill(icons[calc_board[y][BOARD_SIZE-1]]).setAnchorPoint(0, 0);
			layer.appendChild(new_icon.setPosition(-63+DEFAULT_X, y*63+DEFAULT_Y));
			for(var i = 0 ; i < BOARD_SIZE ; i++)
			{
				board[y][i].runAction(new lime.animation.MoveBy(63, 0).setDuration(DURATION_TIME));
			}
			move_action = new lime.animation.MoveBy(63, 0).setDuration(DURATION_TIME);
			new_icon.runAction(move_action);
			
			goog.events.listen(move_action, lime.animation.Event.STOP, function(){
				board[y][x].setOpacity(1);
				var temp = calc_board[y][BOARD_SIZE-1];
				board[y][BOARD_SIZE-1] = null;
				for(var i = BOARD_SIZE-1 ; i > 0 ; i--)
				{
					board[y][i] = board[y][i-1];
					calc_board[y][i] = calc_board[y][i-1];
				}
				board[y][0] = new_icon;
				calc_board[y][0] = temp;
				
				var next_x = Math.floor(Math.random() * 7);
				var next_y = Math.floor(Math.random() * 7);
				var next_direct = Math.floor(Math.random() * 4)+1;
				scroll(next_x, next_y, next_direct);
			});
			break;
		}
		case 3: //up
		{
			new_icon = new lime.Sprite().setFill(icons[calc_board[0][x]]).setAnchorPoint(0, 0);
			layer.appendChild(new_icon.setPosition(x*63+DEFAULT_X, BOARD_SIZE*63+DEFAULT_Y));
			for(var i = 0 ; i < BOARD_SIZE ; i++)
			{
				board[i][x].runAction(new lime.animation.MoveBy(0, -63).setDuration(DURATION_TIME));
			}
			move_action = new lime.animation.MoveBy(0, -63).setDuration(DURATION_TIME);
			new_icon.runAction(move_action);
			
			goog.events.listen(move_action, lime.animation.Event.STOP, function(){
				board[y][x].setOpacity(1);
				var temp = calc_board[0][x];
				board[0][x] = null;
				for(var i = 0 ; i < BOARD_SIZE-1 ; i++)
				{
					board[i][x] = board[i+1][x];
					calc_board[i][x] = calc_board[i+1][x];
				}
				board[BOARD_SIZE-1][x] = new_icon;
				calc_board[BOARD_SIZE-1][x] = temp;
				
				var next_x = Math.floor(Math.random() * 7);
				var next_y = Math.floor(Math.random() * 7);
				var next_direct = Math.floor(Math.random() * 4)+1;
				scroll(next_x, next_y, next_direct);
			});
			break;
		}
		case 4: //down
		{
			new_icon = new lime.Sprite().setFill(icons[calc_board[BOARD_SIZE-1][x]]).setAnchorPoint(0, 0);
			layer.appendChild(new_icon.setPosition(x*63+DEFAULT_X, -63+DEFAULT_Y));
			for(var i = 0 ; i < BOARD_SIZE ; i++)
			{
				board[i][x].runAction(new lime.animation.MoveBy(0, 63).setDuration(DURATION_TIME));
			}
			move_action = new lime.animation.MoveBy(0, 63).setDuration(DURATION_TIME);
			new_icon.runAction(move_action);
			
			goog.events.listen(move_action, lime.animation.Event.STOP, function(){
				board[y][x].setOpacity(1);
				var temp = calc_board[BOARD_SIZE-1][x];
				board[BOARD_SIZE-1][x] = null;
				for(var i = BOARD_SIZE-1 ; i > 0 ; i--)
				{
					board[i][x] = board[i-1][x];
					calc_board[i][x] = calc_board[i-1][x];
				}
				board[0][x] = new_icon;
				calc_board[0][x] = temp;
				
				var next_x = Math.floor(Math.random() * 7);
				var next_y = Math.floor(Math.random() * 7);
				var next_direct = Math.floor(Math.random() * 4)+1;
				scroll(next_x, next_y, next_direct);
			});
			break;
		}
	}
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tunacan.start', tunacan.start);