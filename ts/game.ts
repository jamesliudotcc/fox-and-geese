//ImmutabeJS types are declared as any for now.
let currentState: any;
let boardNeighbors: any; // Directory of legal moves

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

//This is so I can play Fox & Geese from the console
function foxMoves(movesFrom: number, movesTo: number): void {
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

function gooseMoves(movesFrom: number, movesTo: number): void {
  let messageToUpdate = {
    foxMoved: false,
    jumped: false,
    moveFrom: movesFrom,
    moveTo: movesTo,
  };
  currentState = update(messageToUpdate, currentState);
  viewUpdate(currentState);
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
