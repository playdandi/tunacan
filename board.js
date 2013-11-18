goog.provide('board');


/*
 * board object.
// * @param {int} size / horizontal & vertical size of the board.
 */
function boardInfo()
{
	this.board = null;
	return this;
}

/*
 * each piece object of board.
 */
function piece()
{
	this.img = null;
	this.type = null;
	this.typeOfSpecial = null;
	this.isIngredient = null;
	return this;
}

/*
 * create board whose size is this.size;
 */
board.create = function()
{
	//var board = puzzleGame.board;
	puzzleGame.board = null;
	puzzleGame.board = new Array(BOARD_SIZE);
	for (var row = 0; row < BOARD_SIZE; row++)
	{
		puzzleGame.board[row] = new Array(BOARD_SIZE);
		for (var col = 0; col < BOARD_SIZE; col++)
		{
			puzzleGame.board[row][col] = board.createPiece(null, null, null);
		}
	}
	
};


board.createPiece = function(type, isIngredient, typeOfSpecial) {	
	var p = new piece();
	
	// type
	index = (index > 0) ? index : res.getRandomNumber(6) + 1;
	p.type = index;
	// ingredient
	if (ingredient != null) // scroll 때는 기존의 piece를 그대로 들고온다.
		p.ingredient = ingredient;
	else
		p.ingredient = (Math.floor(Math.random() * 100) < INGREDIENT_PROBABILITY) ? true : false;
	// image
	if (p.ingredient)
		p.img = new lime.Sprite().setFill(framesIngre[index]).setAnchorPoint(0, 0);
	else
		p.img = new lime.Sprite().setFill(frames[index]).setAnchorPoint(0, 0);
	// special type
	p.special = special;
		
	return p;
};

res.getRandomNumber = function(max) { // return integer between (0 <= value < max).
	return Math.floor(Math.random() * max);
};