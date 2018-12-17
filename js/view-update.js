function viewUpdate(currentState) {
    // Only reflect the current game state on the view in this function
    const boardTiles = document.getElementsByClassName('active-tile');
    const foxTurn = currentState.get('foxTurn');
    const messagesToDisplay = currentState.get('messageToView');
    const gameMessages = document.getElementById('game-messages');
    gameMessages.textContent = messagesToDisplay;
    if (currentState.get('dropTargetOn')) {
        const tile = document.getElementById(currentState.get('dropTargetOn'));
        foxTurn ? tile.classList.add('med-foxy') : tile.classList.add('med-goosy');
    }
    if (currentState.get('dropTargetOff')) {
        const tile = document.getElementById(currentState.get('dropTargetOff'));
        tile.classList.remove('med-foxy');
        tile.classList.remove('med-goosy');
    }
    if (currentState.get('moveSuggest')) {
        currentState
            .get('moveSuggest')
            //@ts-ignore
            .forEach(a => {
            document
                .getElementById(String(a))
                .classList.add(foxTurn ? 'light-foxy' : 'light-goosy');
        });
    }
    if (currentState.get('clearSuggestions')) {
        const lightFoxyTiles = document.getElementsByClassName('light-foxy');
        const lightGoosyTiles = document.getElementsByClassName('light-goosy');
    }
    // remove the fox and goose classes from all of the tiles
    function resetBoard() {
        let geeseImgs = document.getElementsByClassName('goose');
        for (let i = geeseImgs.length - 1; i >= 0; i--) {
            geeseImgs[i].remove();
        }
        let foxImgs = document.getElementsByClassName('fox');
        for (let i = foxImgs.length - 1; i >= 0; i--) {
            foxImgs[i].remove();
        }
    }
    resetBoard();
    //   put goose classes tiles based on currentState
    function placeGeese() {
        let newGooseLoc;
        for (let i = 0; i < currentState.get('geeseAt').size; i++) {
            newGooseLoc = document.getElementById(currentState.get('geeseAt').get(i));
            newGooseLoc.appendChild(makeGooseImg());
        }
    }
    placeGeese();
    function placeFox() {
        // Only one place where the fox might be:
        let newFoxLoc = document.getElementById(currentState.get('foxAt').toString());
        newFoxLoc.appendChild(makeFoxImg());
        boardTiles[currentState.get('foxAt')];
    }
    placeFox();
}
