let List = Immutable.List,
  fromJS = Immutable.fromJS,
  Map = Immutable.Map;
//ImmutabeJS types are declared as any for now.
let startingState;
let currentState;
const FOX = 'fox',
  GOOSE = 'goose';
const WIDTH = 7,
  HEIGHT = 7;
const NW = 0 - WIDTH - 1,
  N = 0 - WIDTH,
  NE = 0 - WIDTH + 1,
  W = -1,
  E = 1,
  SW = WIDTH - 1,
  S = WIDTH,
  SE = WIDTH + 1;
const directions = [N, NE, E, SE, S, SW, W, NW];
const xmlns = 'http://www.w3.org/2000/svg';
document.addEventListener('DOMContentLoaded', main);
function main() {
  const boardList = createBoard();
  function createBoard() {
    let drawBoard = [];
    // Some functions to calculate commonly seen board patterns
    // These functions are created for 3 or more of the same pattern
    let allNeighbors = function(tile) {
      return List([
        tile + NW,
        tile + N,
        tile + NE,
        tile + W,
        tile + E,
        tile + SW,
        tile + S,
        tile + SE,
      ]);
    };
    const crossNeighbors = function(tile) {
      return List([tile + N, tile + W, tile + E, tile + S]);
    };
    const leftCenter = function(tile) {
      return List([tile + N, tile + E, tile + S]);
    };
    const rightCenter = function(tile) {
      return List([tile + N, tile + W, tile + S]);
    };
    const topCenter = function(tile) {
      return List([tile + W, tile + E, tile + S]);
    };
    const bottomCenter = function(tile) {
      return List([tile + N, tile + W, tile + E]);
    };
    // 10, 22, 24, 26, and 38 are allNeighbors
    [10, 22, 24, 26, 38].forEach(tile => {
      drawBoard[tile] = allNeighbors(tile);
    });
    //17, 23, 25, and 31 are crossNeighbors
    [17, 23, 25, 31].forEach(tile => {
      drawBoard[tile] = crossNeighbors(tile);
    });
    //3, 15, 19 are topCenters
    [3, 15, 19].forEach(tile => {
      drawBoard[tile] = topCenter(tile);
    });
    //9, 21, 37 are leftCenter
    [9, 21, 37].forEach(tile => {
      drawBoard[tile] = leftCenter(tile);
    });
    // 11, 27, 39 are rightCenter
    [11, 27, 39].forEach(tile => {
      drawBoard[tile] = rightCenter(tile);
    });
    // 29, 33, 45 are bottomCenter
    [29, 33, 45].forEach(tile => {
      drawBoard[tile] = bottomCenter(tile);
    });
    // These cases are literally on corners.
    drawBoard[2] = List([3, 9, 10]);
    drawBoard[4] = List([3, 10, 11]);
    drawBoard[14] = List([15, 21, 22]);
    drawBoard[16] = List([9, 10, 15, 17, 22, 23, 24]);
    drawBoard[18] = List([10, 11, 17, 19, 24, 25, 26]);
    drawBoard[20] = List([19, 26, 27]);
    drawBoard[28] = List([21, 22, 29]);
    drawBoard[30] = List([22, 23, 24, 29, 31, 37, 38]);
    drawBoard[32] = List([24, 25, 26, 31, 33, 38, 39]);
    drawBoard[34] = List([26, 27, 33]);
    drawBoard[44] = List([37, 38, 45]);
    drawBoard[46] = List([38, 39, 45]);
    // Future refactoring: odds are crossNeighbors, evens are allNeighbors
    // Edge cases can be taken care of by detecting board edges and removing those nodes
    // Iniside function, nonmutable is OK.
    return List(drawBoard);
  }
  function createBoardDOMElement(boardList) {
    let boardMain = document.getElementById('main');
    function newSvgLine(x2, y2) {
      // SVG Line always starts at center: 50, 50; goes to outside
      let svgLine = document.createElementNS(xmlns, 'line');
      svgLine.setAttributeNS(null, 'x1', '50');
      svgLine.setAttributeNS(null, 'x2', x2.toString());
      svgLine.setAttributeNS(null, 'y1', '50');
      svgLine.setAttributeNS(null, 'y2', y2.toString());
      svgLine.setAttributeNS(null, 'stroke', 'black');
      svgLine.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke');
      return svgLine;
    }
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
      // All tiles 0 -> 48 are drawn on the DOM`
      let boardTile = document.createElement('div');
      boardTile.className = 'tile';
      boardTile.id = i.toString();
      // Check if tile has any connections to neighbors, if so, set SVG box to draw lines
      if (boardList.get(i)) {
        let svgTag = document.createElementNS(xmlns, 'svg');
        svgTag.setAttributeNS(null, 'height', '100');
        svgTag.setAttributeNS(null, 'width', '100');
        // Check each direction and draw a line if appropriate
        if (boardList.get(i).includes(i + N)) {
          svgTag.appendChild(newSvgLine(50, 0));
        }
        if (boardList.get(i).includes(i + NE)) {
          svgTag.appendChild(newSvgLine(100, 0));
        }
        if (boardList.get(i).includes(i + E)) {
          svgTag.appendChild(newSvgLine(100, 50));
        }
        if (boardList.get(i).includes(i + SE)) {
          svgTag.appendChild(newSvgLine(100, 100));
        }
        if (boardList.get(i).includes(i + S)) {
          svgTag.appendChild(newSvgLine(50, 100));
        }
        if (boardList.get(i).includes(i + SW)) {
          svgTag.appendChild(newSvgLine(0, 100));
        }
        if (boardList.get(i).includes(i + W)) {
          svgTag.appendChild(newSvgLine(0, 50));
        }
        if (boardList.get(i).includes(i + NW)) {
          svgTag.appendChild(newSvgLine(0, 0));
        }
        boardTile.appendChild(svgTag);
      }
      // Active tiles should have a different class
      if (boardList.get(i)) {
        boardTile.classList.add('active-tile');
        //Development scafolding: write numbers on tiles
        let tileLabel = document.createElement('p');
        tileLabel.innerText = i.toString();
        boardTile.appendChild(tileLabel);
      }
      // Fox is an HTML class
      if (i === startingState.get('foxAt')) {
        boardTile.classList.add(FOX);
      }
      // Geese are a class
      if (startingState.get('geeseAt').includes(i)) {
        boardTile.classList.add(GOOSE);
      }
      boardMain.appendChild(boardTile);
    } // for
  }
  function createBoardState() {
    const startingState = {
      foxWon: false,
      geeseWon: false,
      foxTurn: false,
      foxJumped: false,
      foxAt: 17,
      geeseAt: [],
      legalMoves: [],
      legalJumps: [],
    };
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
function allowFirstMove(startingState) {
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
  console.log(messageToUpdate);
  currentState = updater(messageToUpdate, currentState);
  viewUpdate(currentState);
}
function gooseMoves(movesFrom, movesTo) {
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
function foxMoveCheck(movesFrom, movesTo) {
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
function gooseMoveCheck(movesFrom, movesTo) {
  //check if move legal
  //return
  return {
    foxMoved: false,
    jumped: false,
    moveFrom: movesFrom,
    moveTo: movesTo,
  };
}
function updater(message, previousState) {
  // Any until I get Immutable working with TS
  let newState = {
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
  let previousGeeseAt = previousState.get('geeseAt');
  if (message.foxMoved) {
    //Check if Fox's move, move is legal, before going on to move logic.
    //Move logic
    newState.foxAt = message.moveTo;
    newState.geeseAt = previousGeeseAt;
  } else {
    // 2. remove piece from old tile
    newState.foxAt = currentState.get('foxAt');
    let newGeeseAt = previousGeeseAt
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
function viewUpdate(currentState) {
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
