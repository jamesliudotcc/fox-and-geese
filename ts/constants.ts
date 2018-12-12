const { fromJS, List } = require('immutable');

// In JS file, instead of import, use:
// const List = Immutable.List, fromJS = Immutable.fromJS, Map = Immutable.Map;

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

let startingState: {
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
  foxWon: false,
  geeseWon: false,
  foxTurn: false,
  foxJumped: false,
  foxAt: 17, // Fox placed here.
  geeseAt: [],
  legalMoves: [],
  legalJumps: [],
  messageToView: "Game begins with goose's move",
};

const onBoardTilesList: any = setBoardLimits([
  0,
  1,
  5,
  6,
  7,
  8,
  12,
  13,
  35,
  36,
  40,
  41,
  42,
  43,
  47,
  48,
]);

function setBoardLimits(offBoard: number[]) {
  // Pass in an array of off-board numbers, which are excluded from the return List

  let boardTiles = [];
  for (let i = 0; i < HEIGHT * WIDTH; i++) {
    if (!offBoard.includes(i)) {
      boardTiles.push(i);
    }
  }
  return List(boardTiles);
}

// Messages to display

const NOT_FOX_TURN = "Not fox's turn, geese go",
  NOT_GEESE_TURN = "Not geese's turn, fox goes",
  FOX_GOES = 'Fox Goes',
  GEESE_GO = 'Geese Go';
