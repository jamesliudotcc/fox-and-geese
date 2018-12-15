//ImmutabeJS types are declared as any for now.
let currentState;
// let boardNeighbors: any; // Directory of legal moves
document.addEventListener('DOMContentLoaded', function () {
    createBoardDOMElement(boardNeighbors);
});
/*
Drag Handlers. This calls the foxMoves and geeseMoves functions to allow
gameplay using drag and drop interface.
*/
let newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', beginGame);
// dragOver, dragLeave, and drop handle the tile targets
function dragOver(ev) {
    ev.preventDefault();
    let messageToUpdate = {
        dropTargetOn: ev.target.id,
    };
    currentState = update(messageToUpdate, currentState);
    viewUpdate(currentState);
}
function dragLeave(ev) {
    console.log('Someone left from:', ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    const animalMoved = ev.dataTransfer.getData('text').split(' ')[0];
    const dragFrom = ev.dataTransfer.getData('text').split(' ')[1];
    const dragTo = ev.target.id;
    console.log('Something dropped', [animalMoved, dragFrom, dragTo]);
    if (animalMoved === 'goose') {
        gooseMoves(Number(dragFrom), Number(dragTo));
    }
    if (animalMoved === 'fox') {
        foxMoves(Number(dragFrom), Number(dragTo));
    }
}
// dragStart, and dragEnd handle the animal being picked up.
function dragStart(ev) {
    const dataFromDrag = ev.target.className + ' ' + ev.target.parentNode.id;
    ev.dataTransfer.setData('text', dataFromDrag);
    console.log('I was picked up', dataFromDrag);
}
// dragEnd is different from drop because only active tiles listen for drops.
function dragEnd(ev) {
    console.log('I was dropped');
}
// The drop handlers call these functions. One sets up the initial
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
