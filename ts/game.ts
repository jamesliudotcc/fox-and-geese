//ImmutabeJS types are declared as any for now.
let currentState: any;
let boardList: any; // Directory of legal moves

document.addEventListener('DOMContentLoaded', main);

function main() {
  boardList = createBoard();

  function createBoardState() {
    // TODO: Place geese should be in board-setup.ts
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
  console.log('Message to Update from foxMoves:', messageToUpdate);
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
  console.log('Message to Update from gooseMoves:', messageToUpdate);
  currentState = updater(messageToUpdate, currentState);
  viewUpdate(currentState);
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
  console.log('previousState Object in Updater', previousState);
  let newState: {
    foxWon: boolean;
    geeseWon: boolean;
    foxTurn: boolean;
    foxJumped: boolean;
    foxAt: number;
    geeseAt: number[];
    legalMoves: any;
    legalJumps: number[][];
    messageToView: string;
  } = {
    foxWon: previousState.get('foxWon'),
    geeseWon: previousState.get('geeseWon'),
    foxTurn: previousState.get('foxTurn'),
    foxJumped: previousState.get('foxJumped'),
    foxAt: previousState.get('foxAt'),
    geeseAt: previousState.get('geeseAt'),
    legalMoves: previousState.get('legalMoves'),
    legalJumps: previousState.get('legalJumps'),
    messageToView: '',
  };
  // Make updates to newState and return it as immutable

  //read previous geese state
  let previousGeeseAt: [] = previousState.get('geeseAt');

  if (message.foxMoved) {
    //Check if Fox's move, move is legal, before going on to move logic.
    // Check if Fox's move
    if (!newState.foxTurn) {
      newState.messageToView = NOT_FOX_TURN;
      return fromJS(newState);
    }

    // Check if move is legal.

    //Move logic
    newState.foxAt = message.moveTo;
    newState.geeseAt = previousGeeseAt;
  } else {
    // Check if Geese's move
    if (newState.foxTurn) {
      newState.messageToView = NOT_GEESE_TURN;
      return fromJS(newState);
    }
    // Check if Geese's move is legal

    let newGeeseAt: any = previousGeeseAt
      .filter(goose => goose !== message.moveFrom)
      //@ts-ignore
      .push(message.moveTo);
    // 3. place piece on new tile

    newState.geeseAt = newGeeseAt;
    newState.foxTurn = true;
    newState.messageToView = FOX_GOES;
  }

  if (message.jumped) {
    newState.foxTurn = true;
    // remove the jumped goose
    newState.messageToView = FOX_GOES;
    console.log();
    console.log('Fox caught a gooose!');
  } else {
    newState.foxTurn = false;
    newState.foxTurn = !message.foxMoved;
    newState.messageToView = GEESE_GO;
  }

  if (newState.foxTurn) {
    newState.legalMoves = setFoxLegalMoves(newState.foxAt);
  } else {
    newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
  }

  function setFoxLegalMoves(foxAt: number) {
    return (
      boardList
        .get(foxAt)
        //@ts-ignore
        .filter(direction => !newState.geeseAt.includes(direction))
        //@ts-ignore
        .map(neighbor => [foxAt, neighbor])
    );
  }

  function setGeeseLegalMoves(geeseAt: number[]) {
    //create function
  }

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
console.log(onBoardTilesList);
