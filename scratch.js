const { Range, fromJS, List, remove } = require('immutable');

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
const DIRECTIONS = [N, NE, E, SE, S, SW, W, NW];
const XMLNS = 'http://www.w3.org/2000/svg';
let startingState = {
  foxWon: false,
  geeseWon: false,
  foxTurn: false,
  foxJumped: false,
  foxAt: 17,
  geeseAt: [],
  legalMoves: [],
  legalJumps: [],
};
const onBoardTilesList = setBoardLimits([
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
function setBoardLimits(offBoard) {
  // Pass in an array of off-board numbers, which are excluded from the return List
  let boardTiles = [];
  for (let i = 0; i < HEIGHT * WIDTH; i++) {
    if (!offBoard.includes(i)) {
      boardTiles.push(i);
    }
  }
  return List(boardTiles);
}

console.log(onBoardTilesList.get(5));

let here = 46;

let legalMoves = DIRECTIONS.map(direction => direction + here)
  .filter(neighbor => onBoardTilesList.includes(neighbor))
  .map(neighbor => {
    return [here, neighbor];
  });

console.log(legalMoves);


boardList.get(25).filter(a => (currentState.get('geeseAt').includes(a)))