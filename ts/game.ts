const { fromJS, List } = require('immutable');

// In JS file, instead of import, use:
//let List = Immutable.List, fromJS = Immutable.fromJS, Map = Immutable.Map;

//ImmutabeJS types are declared as any for now.
let currentState: any;

document.addEventListener('DOMContentLoaded', main);

function main() {
  const boardList = createBoard();

  // TODO refactor create geese out of main.
  function createBoardState() {
    // Place geese
    for (let i = 28; i < HEIGHT * WIDTH; i++) {
      if (boardList.get(i)) {
        startingState.geeseAt.push(i);
      }
    } // for

    return fromJS(startingState);
  }

  startingState = createBoardState();

  createBoardDOMElement(boardList);

  currentState = allowFirstMove(startingState);
}

function allowFirstMove(startingState: any): any {
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
  console.log(messageToUpdate);
  currentState = updater(messageToUpdate, currentState);
  viewUpdate(currentState);
}

function gooseMoves(movesFrom: number, movesTo: number): void {
  let messageToUpdate = {
    foxMoved: false,
    jumped: false,
    moveFrom: movesFrom,
    moveTo: movesTo,
  };
  console.log(messageToUpdate);
  currentState = updater(messageToUpdate, currentState);
  viewUpdate(currentState);
}

function foxMoveCheck(
  movesFrom: number,
  movesTo: number
): { foxMoved: boolean; jumped: boolean; moveFrom: number; moveTo: number } {
  //None of this function works, redo.
  let jumped = false; // assume that the fox does not jump a goose
  if (/*move is legal*/ null) {
    let jumped = false;
  }
  if (/*jump is legal*/ null) {
    jumped = true;
  } else {
    // call error handler
    return null;
  }
  //
  let message = {
    foxMoved: true,
    jumped: jumped,
    moveFrom: movesFrom,
    moveTo: movesTo,
  };
  console.log(message);
  return message;
}

function gooseMoveCheck(
  movesFrom: number,
  movesTo: number
): { foxMoved: boolean; jumped: boolean; moveFrom: number; moveTo: number } {
  //check if move legal

  //return
  return {
    foxMoved: false,
    jumped: false,
    moveFrom: movesFrom,
    moveTo: movesTo,
  };
}

function updater(
  message: {
    foxMoved: boolean;
    jumped: boolean;
    moveFrom: number;
    moveTo: number;
  },
  previousState: any
): any {
  // Any until I get Immutable working with TS
  let newState: {
    foxWon: boolean;
    geeseWon: boolean;
    foxTurn: boolean;
    foxJumped: boolean;
    foxAt: number;
    geeseAt: number[];
    legalMoves: number[][];
    legalJumps: number[][];
  } = {
    foxWon: false,
    geeseWon: false,
    foxTurn: false,
    foxJumped: false,
    foxAt: 0,
    geeseAt: [],
    legalMoves: [],
    legalJumps: [],
  }; // Make updates to newState and return it as immutable
  // set new position for moved piece
  console.log('From Updater, Foxmoved:', message.foxMoved);
  //read previous geese state
  let previousGeeseAt: [] = previousState.get('geeseAt');

  if (message.foxMoved) {
    //Check if Fox's move, move is legal, before going on to move logic.

    //Move logic
    newState.foxAt = message.moveTo;
    newState.geeseAt = previousGeeseAt;
  } else {
    // 2. remove piece from old tile
    newState.foxAt = currentState.get('foxAt');
    let newGeeseAt: any = previousGeeseAt
      .filter(goose => goose !== message.moveFrom)
      //@ts-ignore
      .push(message.moveTo);
    // 3. place piece on new tile

    newState.geeseAt = newGeeseAt;
  }

  if (message.jumped) {
    newState.foxTurn = true;
    // remove the jumped goose
    console.log();
    console.log('Fox caught a gooose!');
  } else {
    newState.foxTurn = false;
    newState.foxTurn = !message.foxMoved;
  }

  // Create the new legal moves
  //   if (newState.currentState.getfoxTurn) {
  //     // create legal single space moves
  //   } else {
  //   }

  // check if fox won
  if (newState.geeseAt.length <= 4) {
    console.log(newState.geeseAt);
    //newState.foxWon = true;
  }

  // check if geese won
  /* This happens after the turn is toggled so that fox's legal moves can 
    be checked. Geese only win at the close of their turn and do not jump 
    the fox, so it is OK to do this after toggling the turn to fox. */

  if (newState.foxTurn && newState.legalMoves.length === 0) {
    //   check fox legal moves. If there are none, geese won.
    newState.geeseWon = true;
  }

  return fromJS(newState);
}

function viewUpdate(currentState: any) {
  let gameMessages = document.getElementById('game-messages');
  // Only reflect the current game state on the view in this function
  let boardTiles = document.getElementsByClassName('active-tile');
  for (let i = 0; i < HEIGHT * WIDTH; i++) {
    // remove the fox and goose classes from all of the tiles
    if (boardTiles[i] !== undefined) {
      boardTiles[i].classList.remove('fox');
      boardTiles[i].classList.remove('goose');
    }
  } // for

  //   put goose classes tiles based on currentState
  console.log('Geese at:', currentState.get('geeseAt'));
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
