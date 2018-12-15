function viewUpdate(currentState) {
    const gameMessages = document.getElementById('game-messages');
    // Only reflect the current game state on the view in this function
    const boardTiles = document.getElementsByClassName('active-tile');
    const resetButon = document.getElementById;
    const messagesToDisplay = currentState.get('messageToView');
    gameMessages.textContent = messagesToDisplay;
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
    // On game win, 
}
