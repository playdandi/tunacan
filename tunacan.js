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
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');

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
	
	res.init();
	/*
	var icon_image = new lime.fill.Image("assets/puzzle_icon.png");
	icons[BOARDELEM_COW] = new lime.fill.Frame(icon_image.getImageElement(), 63*0, 0, 63, 63);
	icons[BOARDELEM_CABBAGE] = new lime.fill.Frame(icon_image.getImageElement(), 63*1, 0, 63, 63);
	icons[BOARDELEM_PEPPER] = new lime.fill.Frame(icon_image.getImageElement(), 63*2, 0, 63, 63);
	icons[BOARDELEM_OLIVE] = new lime.fill.Frame(icon_image.getImageElement(), 63*3, 0, 63, 63);
	icons[BOARDELEM_CHEESE] = new lime.fill.Frame(icon_image.getImageElement(), 63*4, 0, 63, 63);
	icons[BOARDELEM_TOMATO] = new lime.fill.Frame(icon_image.getImageElement(), 63*5, 0, 63, 63);
	*/
	
	layer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0,0);
	layer.appendChild(rect);
	
	for(var i = 0 ; i < BOARD_SIZE ; i++)
	{
		board[i] = new Array(BOARD_SIZE);
		calc_board[i] = new Array(BOARD_SIZE);
		for(var j = 0 ; j < BOARD_SIZE ; j++)
		{
			//var icon_index = Math.floor(Math.random() * 6)+1;
			var img = res.createImageByRandom();
			var icon_index = img.type;
			board[i][j] = img.image;
			//board[i][j] = new lime.Sprite().setFill(img.image).setAnchorPoint(0, 0);
			calc_board[i][j] = icon_index;
			layer.appendChild(board[i][j].setPosition(j*63+DEFAULT_X, i*63+DEFAULT_Y));
		}
		//console.log(calc_board[i][0], calc_board[i][1], calc_board[i][2], calc_board[i][3], calc_board[i][4], calc_board[i][5], calc_board[i][6]);
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

function drop()
{
	retArray = game_function.fillElementsAndDrop();
	if(retArray.length > 0)
	{
		var drop_action = new Array();
		var new_icon = new Array(), new_icon_type = new Array(), new_icon_count = 0;
		for(var i = 0 ; i < retArray.length ; i++)
		{
			if(retArray[i].row >= 0)
			{
				drop_action.push(new lime.animation.MoveBy(0, 63*retArray[i].drop).setDuration(0.3));
				board[retArray[i].row][retArray[i].col].runAction(drop_action[i]);
			}
			else
			{
				new_icon[new_icon_count] = retArray[i].img;
				new_icon_type[new_icon_count] = retArray[i].type;
				layer.appendChild(new_icon[new_icon_count].setPosition(retArray[i].col*63+DEFAULT_X, retArray[i].row*63+DEFAULT_Y));
				drop_action.push(new lime.animation.MoveBy(0, 63*retArray[i].drop).setDuration(0.3));
				new_icon[new_icon_count].runAction(drop_action[i]);
				new_icon_count++;
			}
		}
		goog.events.listen(drop_action[0], lime.animation.Event.STOP, function(){
			new_icon_count = 0;
			for(var i = 0 ; i < retArray.length ; i++)
			{
				if(retArray[i].row >= 0)
				{
					board[retArray[i].row+retArray[i].drop][retArray[i].col] = null;
					board[retArray[i].row+retArray[i].drop][retArray[i].col] = board[retArray[i].row][retArray[i].col];
					calc_board[board[retArray[i].row+retArray[i].drop][retArray[i].col]] = calc_board[retArray[i].row][retArray[i].col];
				}
				else
				{
					board[retArray[i].row+retArray[i].drop][retArray[i].col] = null;
					board[retArray[i].row+retArray[i].drop][retArray[i].col] = new_icon[new_icon_count];
					calc_board[board[retArray[i].row+retArray[i].drop][retArray[i].col]] = new_icon_type[new_icon_count];
					new_icon_count++;
				}
			}
			var next_x = Math.floor(Math.random() * 7);
			var next_y = Math.floor(Math.random() * 7);
			var next_direct = Math.floor(Math.random() * 4)+1;
			scroll(next_x, next_y, next_direct);			
		});
	}
	else
	{
		var next_x = Math.floor(Math.random() * 7);
		var next_y = Math.floor(Math.random() * 7);
		var next_direct = Math.floor(Math.random() * 4)+1;
		scroll(next_x, next_y, next_direct);
	}
}

function bomb()
{
	result = game_function.findMatchedBlocks();
	if(result)
	{
		console.log("true");
		//터트리는 연출
		var bomb_action = new Array();
		var coord = new Array();
		for(var y = 0 ; y < BOARD_SIZE ; y++)
		{
			for(var x = 0 ; x < BOARD_SIZE ; x++)
			{
				if(calc_board[y][x] < 0)
				{
					console.log("in!", y, x);
					bomb_action.push(new lime.animation.Spawn(new lime.animation.ScaleTo(1.2), new lime.animation.FadeTo(0)));
					board[y][x].setAnchorPoint(0.5, 0.5).setPosition(DEFAULT_X+(x*63)+63/2, DEFAULT_Y+(y*63)+63/2);
					board[y][x].runAction(bomb_action[bomb_action.length-1]);
					coord.push({'x':x, 'y':y});
				}
			}
		}
		goog.events.listen(bomb_action[0], lime.animation.Event.STOP, function(){
			for(var i = 0 ; i < coord.length ; i++)
			{
				board[coord[i].y][coord[i].x].setAnchorPoint(0, 0).setPosition(DEFAULT_X+(coord[i].x*63), DEFAULT_Y+(coord[i].y*63));
			}
			drop();				
		});
	}
	else
	{
		var next_x = Math.floor(Math.random() * 7);
		var next_y = Math.floor(Math.random() * 7);
		var next_direct = Math.floor(Math.random() * 4)+1;
		scroll(next_x, next_y, next_direct);
	}
}

function scroll(x, y, direct) //direct 1: left, 2: right, 3: up, 4: down
{
	var new_icon;
	var move_action;
	board[y][x].setOpacity(0.5);
	switch(direct)
	{
		case 1: //left
		{
			new_icon = res.createImage(calc_board[y][0]).image;
			//new_icon = new lime.Sprite().setFill(frames[calc_board[y][0]]).setAnchorPoint(0, 0);
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
							
				bomb();		
			});
			break;
		}
		case 2: //right
		{
			new_icon = res.createImage(calc_board[y][BOARD_SIZE-1]).image;
			//new_icon = new lime.Sprite().setFill(icons[calc_board[y][BOARD_SIZE-1]]).setAnchorPoint(0, 0);
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
				
				bomb();	
			});
			break;
		}
		case 3: //up
		{
			new_icon = res.createImage(calc_board[0][x]).image;
			//new_icon = new lime.Sprite().setFill(icons[calc_board[0][x]]).setAnchorPoint(0, 0);
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
				
				bomb();	
			});
			break;
		}
		case 4: //down
		{
			new_icon = res.createImage(calc_board[BOARD_SIZE-1][x]).image;
			//new_icon = new lime.Sprite().setFill(icons[calc_board[BOARD_SIZE-1][x]]).setAnchorPoint(0, 0);
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
				
				bomb();	
			});
			break;
		}
	}
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tunacan.start', tunacan.start);