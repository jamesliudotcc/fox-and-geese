//ImmutabeJS types are declared as any for now.
let currentState;
let boardNeighbors; // Directory of legal moves
document.addEventListener('DOMContentLoaded', main);
function main() {
    boardNeighbors = createBoard();
    startingState = createBoardState();
    createBoardDOMElement(boardNeighbors);
    currentState = allowFirstMove(startingState);
    function createBoardState() {
        // TODO: Place geese should be in board-setup.ts
        // Place geese
        for (let i = 28; i < HEIGHT * WIDTH; i++) {
            if (boardNeighbors.get(i)) {
                startingState.geeseAt.push(i);
            }
        } // for
        return fromJS(startingState);
    }
}
//Figure this out later
function setInitialGeeseLegalMoves(geeseAt) {
    // for each goose in array, as per fox
    let eachGooseMoves;
    let allowedGooseMovesArr = [];
    for (let i = 0; i < geeseAt.size; i++) {
        eachGooseMoves = boardNeighbors
            .get(geeseAt.get(i))
            //@ts-ignore
            .filter(direction => !geeseAt.includes(direction))
            //@ts-ignore
            .filter(direction => direction !== startingState.foxAt)
            //@ts-ignore
            .map(neighbor => [geeseAt.get(i), neighbor]);
        for (let j = 0; j < eachGooseMoves.size; j++) {
            allowedGooseMovesArr.push(eachGooseMoves.get(j));
        }
    }
}
function allowFirstMove(startingState) {
    // figure this out later
    startingState.set('legalMoves', setInitialGeeseLegalMoves(
    //@ts-ignore
    startingState.get('geeseAt')));
    //This line is required to initialize the game under Immutable. Get rid of this by
    // changing the startingState to currentState.
    return startingState;
}
//This is so I can play Fox & Geese from the console
function foxMoves(movesFrom, movesTo) {
    let jumped = false;
    //implement logic to check whether a jump happened.
    let messageToUpdate = {
        foxMoved: true,
        jumped: jumped,
        moveFrom: movesFrom,
        moveTo: movesTo,
    };
    currentState = update(messageToUpdate, currentState);
    viewUpdate(currentState);
}
function gooseMoves(movesFrom, movesTo) {
    let messageToUpdate = {
        foxMoved: false,
        jumped: false,
        moveFrom: movesFrom,
        moveTo: movesTo,
    };
    currentState = update(messageToUpdate, currentState);
    viewUpdate(currentState);
}
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
// // Implement cheater state:
// function cheaterState() {
//   currentState = fromJS({
//     foxWon: false,
//     geeseWon: false,
//     foxTurn: false,
//     foxJumped: false,
//     foxAt: 17, // Fox placed here.
//     geeseAt: [],
//     legalMoves: [], // calculate legal moves
//     legalJumps: [], // calculate legal jumps
//   });
// }
