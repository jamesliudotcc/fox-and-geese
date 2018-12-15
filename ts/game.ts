//ImmutabeJS types are declared as any for now.
let currentState: any;
let boardNeighbors: any; // Directory of legal moves

document.addEventListener('DOMContentLoaded', main);

let newGameButton = document.getElementById('new-game');

newGameButton.addEventListener('click', beginGame);

function main() {
  boardNeighbors = setBoardNeighbors();

  startingState = createBoardState();

  createBoardDOMElement(boardNeighbors);

  currentState = allowFirstMove(startingState);
}
//Figure this out later

function beginGame(e: any): void {}

function setInitialGeeseLegalMoves(geeseAt: any) {
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
  return allowedGooseMovesArr;
}
function allowFirstMove(startingState: any): any {
  // figure this out later
  startingState.set(
    'legalMoves',
    setInitialGeeseLegalMoves(
      //@ts-ignore
      startingState.get('geeseAt')
    )
  );
  //This line is required to initialize the game under Immutable. Get rid of this by
  // changing the startingState to currentState.
  return startingState;
}

/*
Drag Handlers. This calls the foxMoves and geeseMoves functions to allow
gameplay using drag and drop interface.
*/

function allowDrop(ev: any) {
  ev.preventDefault();
}

function drag(ev: any) {
  const dataFromDrag = ev.target.className + ' ' + ev.target.parentNode.id;
  ev.dataTransfer.setData('text', dataFromDrag);
  console.log('I was dragged', dataFromDrag);
  //getAttribute
}

function drop(ev: any) {
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

// These functions allow play the console. The drag interface uses
// these functions.
function foxMoves(movesFrom: number, movesTo: number): void {
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

function gooseMoves(movesFrom: number, movesTo: number): void {
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
