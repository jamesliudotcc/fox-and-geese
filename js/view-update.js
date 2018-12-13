function viewUpdate(currentState) {
    const gameMessages = document.getElementById('game-messages');
    // Only reflect the current game state on the view in this function
    const boardTiles = document.getElementsByClassName('active-tile');
    const messagesToDisplay = currentState.get('messageToView');
    console.log(messagesToDisplay);
    for (let i = 0; i < HEIGHT * WIDTH; i++) {
        // remove the fox and goose classes from all of the tiles
        if (boardTiles[i] !== undefined) {
            boardTiles[i].classList.remove('fox');
            boardTiles[i].classList.remove('goose');
        }
    } // for
    //   put goose classes tiles based on currentState
    let newGooseLoc;
    for (let i = 0; i < currentState.get('geeseAt').size; i++) {
        newGooseLoc = document.getElementById(currentState.get('geeseAt').get(i));
        newGooseLoc.classList.add('goose');
    }
    // Only one place where the fox might be:
    let newFoxLoc = document.getElementById(currentState.get('foxAt').toString());
    newFoxLoc.classList.add('fox');
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
