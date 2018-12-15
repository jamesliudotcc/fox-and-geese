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
  gameBegin: false,
  foxWon: false,
  geeseWon: false,
  foxTurn: false,
  foxJumped: false,
  foxAt: 17, // Fox placed here.
  geeseAt: [],
  legalMoves: [
    [28, 21],
    [28, 22],
    [29, 22],
    [30, 22],
    [30, 23],
    [30, 24],
    [31, 24],
    [32, 24],
    [32, 25],
    [32, 26],
    [33, 26],
    [34, 26],
    [34, 27],
  ],
  legalJumps: [],
  messageToView: "Game begins with goose's move",
};

// Messages to display

const NOT_FOX_TURN = "Not fox's turn, geese go",
  NOT_GEESE_TURN = "Not geese's turn, fox goes",
  FOX_GOES = 'Fox Goes',
  GEESE_GO = 'Geese Go',
  ILLEGAL_MOVE = 'Try again',
  JUMP = 'Fox jumped over a goose!',
  FOX_WON = 'Fox win!',
  GEESE_WON = 'Geese win!';
