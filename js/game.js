//ImmutabeJS types are declared as any for now.
let currentState;
// let boardNeighbors: any; // Directory of legal moves
document.addEventListener('DOMContentLoaded', main);
function main() {
    // startingState = createBoardState();
    createBoardDOMElement(boardNeighbors);
    // currentState = allowFirstMove(startingState);
}
//I am targetting removal of this function.
function allowFirstMove(startingState) {
    // figure this out later
    // startingState.set(
    //   'legalMoves',
    //   setInitialGeeseLegalMoves(
    //     //@ts-ignore
    //     startingState.get('geeseAt')
    //   )
    // );
    //This line is required to initialize the game under Immutable. Get rid of this by
    // changing the startingState to currentState.
    return startingState;
}
/*
Drag Handlers. This calls the foxMoves and geeseMoves functions to allow
gameplay using drag and drop interface.
*/
let newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', beginGame);
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    const dataFromDrag = ev.target.className + ' ' + ev.target.parentNode.id;
    ev.dataTransfer.setData('text', dataFromDrag);
    console.log('I was dragged', dataFromDrag);
    //getAttribute
}
function drop(ev) {
    ev.preventDefault();
    const animalMoved = ev.dataTransfer.getData('text').split(' ')[0];
    const dragFrom = ev.dataTransfer.getData('text').split(' ')[1];
    const dragTo = ev.target.parentNode.id;
    console.log('Something dropped', [animalMoved, dragFrom, dragTo]);
    if (animalMoved === 'goose') {
        gooseMoves(Number(dragFrom), Number(dragTo));
    }
    if (animalMoved === 'fox') {
        foxMoves(Number(dragFrom), Number(dragTo));
    }
}
// The event handlers call these functions. One sets up the initial
// board when the begin gaem button is pressed.
// These functions allow play the console. The drag interface uses
// these functions.
function beginGame(ev) {
    let messageToUpdate = {
        gameBegin: true,
        foxMoved: false,
        jumped: false,
        moveFrom: 0,
        moveTo: 0,
    };
    currentState = update(messageToUpdate, fromJS(startingState));
    viewUpdate(currentState);
}
function foxMoves(movesFrom, movesTo) {
    let jumped = false;
    //implement logic to check whether a jump happened.
    let messageToUpdate = {
        gameBegin: false,
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
        gameBegin: false,
        foxMoved: false,
        jumped: false,
        moveFrom: movesFrom,
        moveTo: movesTo,
    };
    currentState = update(messageToUpdate, currentState);
    viewUpdate(currentState);
}
// // Implement cheater state?
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
