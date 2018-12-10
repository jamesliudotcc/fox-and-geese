declare var require: any;
const { fromJS, List } = require('immutable');

const boardList = createBoard();

console.log(boardList);

function createBoard() {
  const WIDTH = 7;
  const HEIGHT = 7;
  let drawBoard: number[][] = [];
  // Some functions to calculate commonly seen board patterns
  // These functions are created for 3 or more of the same pattern
  let allNeighbors = function(tile: number) {
    return [
      tile - WIDTH - 1,
      tile - WIDTH,
      tile - WIDTH + 1,
      tile - 1,
      tile + 1,
      tile + WIDTH - 1,
      tile + WIDTH,
      tile + WIDTH + 1,
    ];
  };
  const crossNeighbors = function(tile: number) {
    return [tile - WIDTH, tile - 1, tile + 2, tile + WIDTH];
  };
  const leftCenter = function(tile: number) {
    return [tile - WIDTH, tile + 1, tile + WIDTH];
  };
  const rightCenter = function(tile: number) {
    return [tile - WIDTH, tile - 1, tile + WIDTH];
  };
  const topCenter = function(tile: number) {
    return [tile - 1, tile + 1, tile + WIDTH];
  };
  const bottomCenter = function(tile: number) {
    return [tile - WIDTH, tile - 1, tile + 1];
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
  drawBoard[2] = [3, 9, 10];
  drawBoard[4] = [3, 10, 11];
  drawBoard[14] = [15, 21, 22];
  drawBoard[16] = [9, 10, 16, 17, 22, 23, 24];
  drawBoard[18] = [10, 11, 17, 19, 24, 25, 26];
  drawBoard[20] = [19, 26, 27];
  drawBoard[28] = [21, 22, 29];
  drawBoard[30] = [22, 23, 24, 29, 31, 37, 38];
  drawBoard[32] = [24, 25, 26, 31, 33, 38, 39];
  drawBoard[34] = [26, 27, 33];
  drawBoard[44] = [37, 38, 45];
  drawBoard[46] = [38, 39, 45];
  // Future refactoring: odds are crossNeighbors, evens are allNeighbors
  // Edge cases can be taken care of by detecting board edges and removing those nodes

  // Using immutable JS
  return fromJS(drawBoard);
}
