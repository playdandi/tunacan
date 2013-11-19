//set main namespace
goog.provide('userInput');


/*
 * 
 */
userInput.puzzleInputEvent = function(shape)
{ 
	// click OR touch event.
	goog.events.listen(shape, ['mousedown', 'touchstart'], function(e)
	{
		if (puzzleGame.touchLock)
		{
			return;
		}
		
		if (puzzleGame.lock == false)
		{
			console.log('touchLock acquired - in allowUserForceDrag()');
			puzzleGame.touchLock = true;
			
			var posStart = this.localToParent(e.position);
			var colStart, rowStart;			
			colStart = Math.floor((posStart.x-PUZZLE_X)/FRAME_WIDTH);
			rowStart = Math.floor((posStart.y-PUZZLE_Y)/FRAME_HEIGHT); 
			
			// ends user input
			e.swallow(['mouseup', 'touchend'], function(e)
			{
				puzzleGame.touchLock = false;
				console.log('touchLock released - in allowUserForceDrag()');
				
				var posEnd = this.localToParent(e.position);
				var colEnd, rowEnd;
				colEnd = Math.floor((posEnd.x-PUZZLE_X)/FRAME_WIDTH);
				rowEnd = Math.floor((posEnd.y-PUZZLE_Y)/FRAME_HEIGHT);
				
				if (colStart == colEnd && rowStart == rowEnd && puzzleGame.board[rowStart][colStart].type == PIECE_SPECIAL)
				{
					// clicked special piece.
					puzzleGame.lock = true;
					console.log('lock acquired - in allowUserForceDrag()');
					console.log('special type : ', puzzleGame.board[rowStart][colStart].typeOfSpecial, ' /// ' , rowStart, colStart);
					board.findBlocks('special', {'row' : rowStart, 'col' : colStart});
				}
				else {
					if (Math.abs(colEnd-colStart) > 0 && Math.abs(posEnd.x-posStart.x) > Math.abs(posEnd.y-posStart.y))
					{
						if (colEnd-colStart > 0)
						{
							// right
							board.moveLine(rowStart, colStart, 2, true);
						}
						else 
						{
							// left
							board.moveLine(rowStart, colStart, 1, true);
						}
					}
					else if (Math.abs(rowEnd-rowStart) > 0 && Math.abs(posEnd.y-posStart.y) > Math.abs(posEnd.x-posStart.x))
					{
						if (rowEnd-rowStart > 0)
						{
							// down
							board.moveLine(rowStart, colStart, 4, true);
						}
						else 
						{
							// up
							board.moveLine(rowStart, colStart, 3, true);
						}
					}
				}	
			});
			
			// allows it to be dragged around
			e.swallow(['mousemove', 'touchmove'], function(e)
			{
				//var pos = this.localToParent(e.position);
				//mouseJoint.SetTarget(new box2d.Vec2(pos.x, pos.y));
			});
		}		
	});
};
