let startingState: {
  board: {
    active: boolean;
    neighbors: number[];
    occupied: string;
    possibleMoves: number[];
  }[];
  foxTurn: boolean;
  jumped: boolean;
  foxWon: boolean;
  geeseWon: boolean;
} = {
  board: [{ active: false, neighbors: [], occupied: '', possibleMoves: [] }],
  foxTurn: true,
  jumped: false,
  foxWon: false,
  geeseWon: false,
};
