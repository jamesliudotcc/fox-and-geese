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

let startingState: {
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
  foxAt: 17, // Fox placed here.
  geeseAt: [],
  legalMoves: [],
  legalJumps: [],
};
