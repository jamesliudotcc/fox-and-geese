let List = Immutable.List;
var FOX = 'fox',
  GOOSE = 'goose';
var WIDTH = 7,
  HEIGHT = 7;
var NW = 0 - WIDTH - 1,
  N = 0 - WIDTH,
  NE = 0 - WIDTH + 1,
  W = -1,
  E = 1,
  SW = WIDTH - 1,
  S = WIDTH,
  SE = WIDTH + 1;
var xmlns = 'http://www.w3.org/2000/svg';
document.addEventListener('DOMContentLoaded', main);
function main() {
  var boardArray = createBoard();
  //@ts-ignore
  var boardList = List(boardArray);
  function createBoard() {
    boardArray;
    var drawBoard = [];
    // Some functions to calculate commonly seen board patterns
    // These functions are created for 3 or more of the same pattern
    var allNeighbors = function(tile) {
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
    var crossNeighbors = function(tile) {
      return List([tile + N, tile + W, tile + E, tile + S]);
    };
    var leftCenter = function(tile) {
      return List([tile + N, tile + E, tile + S]);
    };
    var rightCenter = function(tile) {
      return List([tile + N, tile + W, tile + S]);
    };
    var topCenter = function(tile) {
      return List([tile + W, tile + E, tile + S]);
    };
    var bottomCenter = function(tile) {
      return List([tile + N, tile + W, tile + E]);
    };
    // 10, 22, 24, 26, and 38 are allNeighbors
    [10, 22, 24, 26, 38].forEach(function(tile) {
      drawBoard[tile] = allNeighbors(tile);
    });
    //17, 23, 25, and 31 are crossNeighbors
    [17, 23, 25, 31].forEach(function(tile) {
      drawBoard[tile] = crossNeighbors(tile);
    });
    //3, 15, 19 are topCenters
    [3, 15, 19].forEach(function(tile) {
      drawBoard[tile] = topCenter(tile);
    });
    //9, 21, 37 are leftCenter
    [9, 21, 37].forEach(function(tile) {
      drawBoard[tile] = leftCenter(tile);
    });
    // 11, 27, 39 are rightCenter
    [11, 27, 39].forEach(function(tile) {
      drawBoard[tile] = rightCenter(tile);
    });
    // 29, 33, 45 are bottomCenter
    [29, 33, 45].forEach(function(tile) {
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
    // Using immutable JS
    return drawBoard;
  }
  function createBoardDOMElement(boardList) {
    var boardMain = document.getElementById('main');
    function newSvgLine(x2, y2) {
      // SVG Line always starts at center: 50, 50; goes to outside
      var svgLine = document.createElementNS(xmlns, 'line');
      svgLine.setAttributeNS(null, 'x1', '50');
      svgLine.setAttributeNS(null, 'x2', x2.toString());
      svgLine.setAttributeNS(null, 'y1', '50');
      svgLine.setAttributeNS(null, 'y2', y2.toString());
      svgLine.setAttributeNS(null, 'stroke', 'black');
      svgLine.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke');
      return svgLine;
    }
    for (var i = 0; i < WIDTH * HEIGHT; i++) {
      // All tiles 0 -> 48 are drawn on the DOM`
      var boardTile = document.createElement('div');
      boardTile.className = 'tile';
      boardTile.id = i.toString();
      // Check if tile has any connections to neighbors, if so, set SVG box to draw lines
      if (boardList.get(i)) {
        var svgTag = document.createElementNS(xmlns, 'svg');
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
      boardMain.appendChild(boardTile);
    } // for
  }
  function createBoardState(boardArray) {
    var startingState = {
      board: [
        {
          active: false,
          neighbors: undefined,
          occupied: '',
          possibleMoves: [],
        },
      ],
      foxTurn: true,
      jumped: false,
      foxWon: false,
      geeseWon: false,
    };
    for (var i = 0; i < HEIGHT * WIDTH; i++) {
      startingState.board[i] = {
        active: false,
        neighbors: null,
        occupied: '',
        possibleMoves: [],
      };
      startingState.board[i].neighbors = boardArray[i];
      if (startingState.board[i].neighbors) {
        startingState.board[i].active = true;
      }
    } // for
    // Place fox
    startingState.board[17].occupied = FOX;
    // Place geese
    for (var i = 28; i < HEIGHT * WIDTH; i++) {
      if (startingState.board[i].active) {
        startingState.board[i].occupied = GOOSE;
      }
    }
    console.log(startingState.board);
  }
  console.log(createBoardState(boardArray));
  createBoardState(boardArray);
  createBoardDOMElement(boardList);
}
