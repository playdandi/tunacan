//set main namespace
goog.provide('userInput');


/*
 * 
 */
userInput.puzzleInputEvent = function(shape)
{ 
	var board = puzzleGame.board;
	
	// click OR touch event.
	goog.events.listen(shape, ['mousedown', 'touchstart'], function(e)
	{
		if (touchLock)
		{
			return;
		}
		
		if (lock == false)
		{
			console.log('touchLock acquired - in allowUserForceDrag()');
			touchLock = true;
			
			var posStart = this.localToParent(e.position);
			var colStart, rowStart;			
			colStart = Math.floor((posStart.x-PUZZLE_X)/frameWidth);
			rowStart = Math.floor((posStart.y-PUZZLE_Y)/frameHeight); 
			
			// ends user input
			e.swallow(['mouseup', 'touchend'], function(e)
			{
				touchLock = false;
				console.log('touchLock released - in allowUserForceDrag()');
				
				var posEnd = this.localToParent(e.position);
				var colEnd, rowEnd;
				colEnd = Math.floor((posEnd.x-PUZZLE_X)/frameWidth);
				rowEnd = Math.floor((posEnd.y-PUZZLE_Y)/frameHeight);
				
				if (colStart == colEnd && rowStart == rowEnd && board[rowStart][colStart].type == PIECE_SPECIAL)
				{
					// clicked special piece.
					lock = true;
					console.log('lock acquired - in allowUserForceDrag()');
					console.log('special type : ', board[rowStart][colStart].special);
					board.findBlocks('special', rowStart, colStart);
				}
				else {
					if (Math.abs(colEnd-colStart) > 0 && Math.abs(posEnd.x-posStart.x) > Math.abs(posEnd.y-posStart.y))
					{
						if (colEnd-colStart > 0)
						{
							// right
							board.moveLine(colStart, rowStart, 2, true);
						}
						else 
						{
							// left
							board.moveLine(colStart, rowStart, 1, true);
						}
					}
					else if (Math.abs(rowEnd-rowStart) > 0 && Math.abs(posEnd.y-posStart.y) > Math.abs(posEnd.x-posStart.x))
					{
						if (rowEnd-rowStart > 0)
						{
							// down
							board.moveLine(colStart, rowStart, 4, true);
						}
						else 
						{
							// up
							board.moveLine(colStart, rowStart, 3, true);
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
