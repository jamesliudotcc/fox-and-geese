const { fromJS, List } = require('immutable');
// In JS file, instead of import, use:
// const List = Immutable.List, fromJS = Immutable.fromJS, Map = Immutable.Map;

let NO_OF_GEESE = 13;

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

//Directions start at N and go clockwise. For convenience.
const DIRECTIONS = [N, NE, E, SE, S, SW, W, NW];

const XMLNS = 'http://www.w3.org/2000/svg';

const NOT_FOX_TURN = "Not fox's turn, geese go",
  NOT_GEESE_TURN = "Not geese's turn, fox goes",
  FOX_GOES = 'Fox Goes',
  GEESE_GO = 'Geese Go',
  ILLEGAL_MOVE = 'Try again',
  JUMP = 'Fox jumped over a goose!',
  FOX_WON = 'Fox wins!',
  GEESE_WON = 'Geese win!';

let boardNeighbors = setBoardNeighbors();

let startingState: {
  gameBegin: boolean;
  foxWon: boolean;
  geeseWon: boolean;
  foxTurn: boolean;
  foxJumped: boolean;
  foxAt: number;
  geeseAt: number[];
  legalMoves: number[][];
  legalJumps: number[][];
  messageToView: string;
} = {
  gameBegin: true,
  foxWon: false,
  geeseWon: false,
  foxTurn: false,
  foxJumped: false,
  foxAt: NO_OF_GEESE === 23 ? 9 : 17, // Fox placed here.
  geeseAt: geeseLocations(13),
  legalMoves: [],
  legalJumps: [],
  messageToView: "Game begins with goose's move",
};
function geeseLocations(numGeese: number): number[] {
  let gooseLocations = [];
  if (numGeese === 13) {
    for (let i = 28; i < HEIGHT * WIDTH; i++) {
      if (boardNeighbors.get(i)) {
        gooseLocations.push(i);
      }
    } // for
  }
  return gooseLocations;
}

function setBoardNeighbors() {
  let drawBoard: any[] = [];
  // Some functions to calculate commonly seen board patterns
  // These functions are created for 3 or more of the same pattern
  let allNeighbors = function(tile: number) {
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
  const crossNeighbors = function(tile: number) {
    return List([tile + N, tile + W, tile + E, tile + S]);
  };
  const leftCenter = function(tile: number) {
    return List([tile + N, tile + E, tile + S]);
  };
  const rightCenter = function(tile: number) {
    return List([tile + N, tile + W, tile + S]);
  };
  const topCenter = function(tile: number) {
    return List([tile + W, tile + E, tile + S]);
  };
  const bottomCenter = function(tile: number) {
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

  return List(drawBoard);
}
