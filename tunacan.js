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

var DURATION_TIME = 0.1;

//global variables
var board;
var calc_board;
var layer;
var lock;

function boardInit() {
	board = null;
	calc_board = null;
	board = new Array(BOARD_SIZE);
	calc_board = new Array(BOARD_SIZE);
	for (var i = 0; i < BOARD_SIZE; i++) {
		board[i] = new Array(BOARD_SIZE);
		calc_board[i] = new Array(BOARD_SIZE);
		for (var j = 0; j < BOARD_SIZE; j++) {
			var img = res.createImageByRandom();
			var icon_index = img.type;
			board[i][j] = img.image;
			calc_board[i][j] = icon_index;
			layer.appendChild(board[i][j].setPosition(j*63+DEFAULT_X, i*63+DEFAULT_Y));
		}
	}
}

// entry point
tunacan.start = function() {
	var director = new lime.Director(document.body, 720, 1280);
	var scene = new lime.Scene();
	var rect = new lime.RoundedRect().setAnchorPoint(0, 0).setSize(720, 1280).setFill("#000000");
	var mask = new lime.Sprite().setAnchorPoint(0, 0).setSize(63*BOARD_SIZE, 63*BOARD_SIZE).setPosition(DEFAULT_X, DEFAULT_Y);
	
	res.init();
	
	layer = new lime.Layer().setAnchorPoint(0, 0).setPosition(0,0);
	layer.appendChild(rect);
	
	boardInit();
	
	layer.setMask(mask);
	
	scene.appendChild(mask);
	scene.appendChild(layer);
	director.makeMobileWebAppCapable();	
	director.replaceScene(scene);
		
	allowUserForceDrag(mask);
	
	// start game
	lock = true;
	bomb(0, 0, 0);
};

function allowUserForceDrag(shape){ 
	goog.events.listen(shape, ['mousedown', 'touchstart'], function(e){
		if(lock == false)
		{
			var st_pos = this.localToParent(e.position); //need parent coordinate system
			
			//console.log(st_pos);
			var st_x_idx, st_y_idx;
			
			st_x_idx = Math.floor((st_pos.x-DEFAULT_X)/63);
			st_y_idx = Math.floor((st_pos.y-DEFAULT_Y)/63);
			//console.log("st_x:", st_x_idx, "st_y:", st_y_idx); 
			
			// ends my input
			e.swallow(['mouseup', 'touchend'], function(e){
				var ed_pos = this.localToParent(e.position);
				var ed_x_idx, ed_y_idx;
				ed_x_idx = Math.floor((ed_pos.x-DEFAULT_X)/63);
				ed_y_idx = Math.floor((ed_pos.y-DEFAULT_Y)/63);
				//console.log("ed_x:", ed_x_idx, "ed_y:", ed_y_idx); 
				if(Math.abs(ed_x_idx-st_x_idx) > 0 && Math.abs(ed_pos.x-st_pos.x) > Math.abs(ed_pos.y-st_pos.y)) //left or right
				{
					if(ed_x_idx-st_x_idx > 0) //right
					{
						scroll(st_x_idx, st_y_idx, 2, true);
					}
					else //left
					{
						scroll(st_x_idx, st_y_idx, 1, true);
					}
				}
				if(Math.abs(ed_y_idx-st_y_idx) > 0 && Math.abs(ed_pos.y-st_pos.y) > Math.abs(ed_pos.x-st_pos.x)) //up or down
				{
					if(ed_y_idx-st_y_idx > 0) //down
					{
						scroll(st_x_idx, st_y_idx, 4, true);
					}
					else //up
					{
						scroll(st_x_idx, st_y_idx, 3, true);
					}
					
				}
				
			});
			// allows it to be dragged around
			e.swallow(['mousemove', 'touchmove'], function(e){
				//var pos = this.localToParent(e.position);
				//mouseJoint.SetTarget(new box2d.Vec2(pos.x, pos.y));
			});
		}		
	});
}

function drop()
{	
	retArray = game_function.fillElementsAndDrop();
	
	var new_icon = new Array(), new_icon_type = new Array(), new_icon_count = 0;
	var dropped = 0;
	
	for (var i = 0; i < retArray.length; i++) {
		var anim = new lime.animation.MoveBy(0, 63 * retArray[i].drop).setDuration(0.3);
		goog.events.listen(anim, lime.animation.Event.STOP, function() {
			dropped++;
			if (dropped == retArray.length) {
				new_icon_count = 0;
				for (var i = 0; i < retArray.length; i++) {
					if (retArray[i].row >= 0) {
						board[retArray[i].row+retArray[i].drop][retArray[i].col] = null;
						board[retArray[i].row+retArray[i].drop][retArray[i].col] = board[retArray[i].row][retArray[i].col];
						calc_board[board[retArray[i].row+retArray[i].drop][retArray[i].col]] = calc_board[retArray[i].row][retArray[i].col];
					} else {
						board[retArray[i].row+retArray[i].drop][retArray[i].col] = null;
						board[retArray[i].row+retArray[i].drop][retArray[i].col] = new_icon[new_icon_count];
						calc_board[board[retArray[i].row+retArray[i].drop][retArray[i].col]] = new_icon_type[new_icon_count];
						new_icon_count++;
					}
				}
				bomb(0, 0, 0);
			}
		});
		
		if (retArray[i].row >= 0) {
			board[retArray[i].row][retArray[i].col].runAction(anim);
		}
		else {
			new_icon[new_icon_count] = retArray[i].img;
			new_icon_type[new_icon_count] = retArray[i].type;
			layer.appendChild(new_icon[new_icon_count].setPosition(retArray[i].col * 63 + DEFAULT_X, retArray[i].row * 63 + DEFAULT_Y));
			new_icon[new_icon_count].runAction(anim);
			new_icon_count++;
		}
	}
}

function bomb(x, y, direct)
{	
	var result = game_function.findMatchedBlocks();
	if (result.isFound)
	{
		//터트리는 연출
		//var bomb_action = new Array();
		var coord = new Array();
		var destroyed = 0;
		
		console.log("result.numOfFind:",result.numOfFound);
		
		for(var y = 0 ; y < BOARD_SIZE ; y++)
		{
			for(var x = 0 ; x < BOARD_SIZE ; x++)
			{
				if(calc_board[y][x] < 0)
				{
					var anim = new lime.animation.Spawn(new lime.animation.ScaleTo(1.2), new lime.animation.FadeTo(0)).setDuration(DURATION_TIME);
					board[y][x].setAnchorPoint(0.5, 0.5).setPosition(DEFAULT_X+(x*63)+63/2, DEFAULT_Y+(y*63)+63/2);
					coord.push({'x' : x, 'y' : y});
					
					goog.events.listen(anim, lime.animation.Event.STOP, function() {
						destroyed++;
						if (destroyed == result.numOfFound) {
							for (var i = 0; i < coord.length; i++) {	
								board[coord[i].y][coord[i].x].setAnchorPoint(0, 0).setPosition(DEFAULT_X+(coord[i].x*63), DEFAULT_Y+(coord[i].y*63));
							}
							
							drop();
						}
					});
					
					board[y][x].runAction(anim);
				}
			}
		}
	}
	else if(direct != 0)
	{
		if(direct == 1)
		{
			if(x == 0)
			{
				x = BOARD_SIZE;
			}
			scroll(x-1, y, 2, false);
		}
		else if(direct == 2)
		{
			if(x == BOARD_SIZE-1)
			{
				x = -1;
			}
			scroll(x+1, y, 1, false);
		}
		else if(direct == 3)
		{
			if(y == 0)
			{
				y = BOARD_SIZE;
			}
			scroll(x, y-1, 4, false);
		}
		else if(direct == 4)
		{
			if(y == BOARD_SIZE-1)
			{
				y = -1;
			}
			scroll(x, y+1, 3, false);
		}
	}
	else {
		// 스크롤을 한 상태도 아니고 , 폭탄이 터진 경우도 아니다.
		if (game_function.isBoardUseless())
			boardInit();
		lock = false;
	}
}

function scroll(x, y, direct, next_step) //direct 1: left, 2: right, 3: up, 4: down
{
	lock = true;
	var new_icon;
	board[y][x].setOpacity(0.5);
	switch(direct)
	{
		case 1: //left
		{
			new_icon = res.createImage(calc_board[y][0]).image;
			layer.appendChild(new_icon.setPosition(BOARD_SIZE*63+DEFAULT_X, y*63+DEFAULT_Y));
			var moved = 0;
			for (var i = 0; i <= BOARD_SIZE ; i++) {
				var anim = new lime.animation.MoveBy(-63, 0).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function() {
					moved++;
					if (moved == BOARD_SIZE + 1) {
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
									
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}
				});
				if (i == BOARD_SIZE)
					new_icon.runAction(anim);
				else
					board[y][i].runAction(anim);
			}
			break;
		}
		case 2: //right
		{
			new_icon = res.createImage(calc_board[y][BOARD_SIZE-1]).image;
			layer.appendChild(new_icon.setPosition(-63+DEFAULT_X, y*63+DEFAULT_Y));
			var moved = 0;
			for (var i = 0 ; i <= BOARD_SIZE ; i++) {
				var anim = new lime.animation.MoveBy(63, 0).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function(){
					moved++;
					if (moved == BOARD_SIZE + 1) {
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
						
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}
				});
				if (i == BOARD_SIZE)
					new_icon.runAction(anim);
				else
					board[y][i].runAction(anim);
			}
			break;
		}
		case 3: //up
		{
			new_icon = res.createImage(calc_board[0][x]).image;
			layer.appendChild(new_icon.setPosition(x*63+DEFAULT_X, BOARD_SIZE*63+DEFAULT_Y));			
			var moved = 0;
			for(var i = 0 ; i <= BOARD_SIZE ; i++)
			{
				var anim = new lime.animation.MoveBy(0, -63).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function(){
					moved++;
					if (moved == BOARD_SIZE + 1) {
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
						
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}	
				});
				if (i == BOARD_SIZE)
					new_icon.runAction(anim);
				else
					board[i][x].runAction(anim);
			}
			break;
		}
		case 4: //down
		{
			new_icon = res.createImage(calc_board[BOARD_SIZE-1][x]).image;
			layer.appendChild(new_icon.setPosition(x*63+DEFAULT_X, -63+DEFAULT_Y));
			var moved = 0;
			for(var i = 0 ; i <= BOARD_SIZE ; i++)
			{
				var anim = new lime.animation.MoveBy(0, 63).setDuration(DURATION_TIME);
				goog.events.listen(anim, lime.animation.Event.STOP, function() {
					moved++;
					if (moved == BOARD_SIZE + 1) {
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
						
						if (next_step)
							bomb(x, y, direct);
						else
							lock = false;
					}	
				});
				if (i == BOARD_SIZE)
					new_icon.runAction(anim);
				else
					board[i][x].runAction(anim);
			}
			break;
		}
	}
	
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tunacan.start', tunacan.start);