//ImmutabeJS types are declared as any for now.
let currentState: any;
// let boardNeighbors: any; // Directory of legal moves

document.addEventListener('DOMContentLoaded', function() {
  createBoardDOMElement(boardNeighbors);
});

/*
Drag Handlers. This calls the foxMoves and geeseMoves functions to allow
gameplay using drag and drop interface.
*/
let newGameButton = document.getElementById('new-game');

newGameButton.addEventListener('click', beginGame);

// dragOver, dragLeave, and drop handle the tile targets
function dragOver(ev: any) {
  ev.preventDefault();
  let messageToUpdate = {
    dropTargetOn: ev.target.id,
  };

  currentState = update(messageToUpdate, currentState);
  viewUpdate(currentState);
}

function dragLeave(ev: any) {
  let messageToUpdate = {
    dropTargetOn: ev.target.id,
    clearDragShadow: true,
  };

  currentState = update(messageToUpdate, currentState);
  viewUpdate(currentState);
}

function drop(ev: any) {
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

// dragStart handles the animal being picked up.
function dragStart(ev: any) {
  const dataFromDrag = ev.target.className + ' ' + ev.target.parentNode.id;
  ev.dataTransfer.setData('text', dataFromDrag);
  console.log('I was picked up', ev.target.parentNode.id);
}

// function mouseOver(ev: any) {
//   let messageToUpdate = { tileMouseOver: ev.target.parentNode.id };

//   currentState = update(messageToUpdate, currentState);
//   viewUpdate(currentState);
// }

// function mouseOut(ev: any) {
//   console.log('I was dropped');

//   let messageToUpdate = {
//     tileMouseOut: true,
//   };

//   currentState = update(messageToUpdate, currentState);
//   viewUpdate(currentState);
// }

// The drop handlers call these functions. One sets up the initial
// board when the begin gaem button is pressed.
// These functions allow play the console. The drag interface uses
// these functions.

function beginGame(ev: any): void {
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

function foxMoves(movesFrom: number, movesTo: number): void {
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

function gooseMoves(movesFrom: number, movesTo: number): void {
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

// // Implement cheater state?

function cheaterState() {
  currentState = fromJS({
    foxWon: false,
    geeseWon: false,
    foxTurn: false,
    foxJumped: false,
    foxAt: 18, // Fox placed here.
    geeseAt: [24, 22, 15, 23, 37, 38, 39, 34, 46],
    legalMoves: [], // calculate legal moves
    legalJumps: [], // calculate legal jumps
  });

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
