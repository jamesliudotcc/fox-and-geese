function viewUpdate(currentState: any) {
  const gameMessages = document.getElementById('game-messages');
  // Only reflect the current game state on the view in this function
  const boardTiles = document.getElementsByClassName('active-tile');

  const messagesToDisplay = currentState.get('messageToView');

  console.log(messagesToDisplay);

  // remove the fox and goose classes from all of the tiles

  let geeseImgs = document.getElementsByClassName('goose');
  for (let i = geeseImgs.length - 1; i >= 0; i--) {
    geeseImgs[i].remove();
  }
  let foxImgs = document.getElementsByClassName('fox');
  for (let i = foxImgs.length - 1; i >= 0; i--) {
    foxImgs[i].remove();
  }

  //   put goose classes tiles based on currentState
  let newGooseLoc;
  for (let i = 0; i < currentState.get('geeseAt').size; i++) {
    newGooseLoc = document.getElementById(currentState.get('geeseAt').get(i));
    newGooseLoc.appendChild(makeGooseImg());
  }
  // Only one place where the fox might be:
  let newFoxLoc = document.getElementById(currentState.get('foxAt').toString());
  newFoxLoc.appendChild(makeFoxImg());

  boardTiles[currentState.get('foxAt')];

  // Declare victory for fox or geese if appropriate
  if (currentState.get('foxWon')) {
    gameMessages.textContent = 'Fox Won!';

    // Turn off board.
  }
  //   if (currentState.get('geeseWon')) {
  //     gameMessages.textContent = 'Geeeese Won!';

  //     // Turn off board.
  //     // number of ee's == number of geese
  //   }
}
