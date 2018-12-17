let currentState;
document.addEventListener('DOMContentLoaded', function () {
    createBoardDOMElement(boardNeighbors);
});
/*
Drag Handlers. This calls the foxMoves and geeseMoves functions to allow
gameplay using drag and drop interface. They are called from the HTML file.
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
    let messageToUpdate = {
        dropTargetOn: ev.target.id,
        clearDragShadow: true,
    };
    currentState = update(messageToUpdate, currentState);
    viewUpdate(currentState);
}
function drop(ev) {
    ev.preventDefault();
    const animalMoved = ev.dataTransfer.getData('text').split(' ')[0];
    const dragFrom = ev.dataTransfer.getData('text').split(' ')[1];
    const dragTo = ev.target.id;
    if (animalMoved === 'goose') {
        gooseMoves(Number(dragFrom), Number(dragTo));
    }
    if (animalMoved === 'fox') {
        foxMoves(Number(dragFrom), Number(dragTo));
    }
}
// dragStart handles the animal being picked up.
function dragStart(ev) {
    const dataFromDrag = ev.target.className + ' ' + ev.target.parentNode.id;
    ev.dataTransfer.setData('text', dataFromDrag);
}
// The drop handlers call these functions. One sets up the initial
// board when the begin gaem button is pressed. They also enable
// gameplay from the console, or a program to play, in case I malke
// an AI in the future.
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
        dropTargetOn: String(movesTo),
        clearDragShadow: true,
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
        dropTargetOn: String(movesTo),
        clearDragShadow: true,
    };
    currentState = update(messageToUpdate, currentState);
    viewUpdate(currentState);
}
function cheaterState(animal) {
    if (animal === 'fox') {
        currentState = fromJS({
            foxWon: false,
            geeseWon: false,
            foxTurn: false,
            foxJumped: false,
            foxAt: 18,
            geeseAt: [24, 22, 15, 23, 37, 38, 39, 34, 46],
            legalMoves: [],
            legalJumps: [],
        });
    }
    else {
        currentState = fromJS({
            foxWon: false,
            geeseWon: false,
            foxTurn: false,
            foxJumped: false,
            foxAt: 3,
            geeseAt: [4, 9, 10, 11, 17, 18],
            legalMoves: [],
            legalJumps: [],
        });
    }
    let messageToUpdate = {
        gameBegin: true,
        foxMoved: false,
        jumped: false,
        moveFrom: 0,
        moveTo: 0,
    };
    currentState = update(messageToUpdate, fromJS(currentState));
    viewUpdate(currentState);
}
