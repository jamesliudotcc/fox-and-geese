interface messageToUpdate {
  gameBegin?: boolean;
  foxMoved?: boolean;
  jumped?: boolean;
  tileMouseOver?: string;
  tileMouseOut?: boolean;
  dropTargetOn?: string;
  clearDragShadow?: boolean;
  moveFrom?: number;
  moveTo?: number;
}
interface stateDiagram {
  gameBegin: boolean;
  foxWon: boolean;
  geeseWon: boolean;
  foxTurn: boolean;
  foxJumped: boolean;
  foxAt: number;
  geeseAt: any;
  legalMoves: any;
  legalJumps: any;
  messageToView: string;
  dropTargetOn?: string;
  dropTargetOff?: string;
  // moveSuggest?: any;
  // clearSuggestions?: boolean;
}

function update(message: messageToUpdate, previousState: any): any {
  /* Initialize newState with some sensible defaults, the update function
     updates them, returns it as an immutable object. The main function will then
     pass the newly created state to updateView, which will update the view.
  */

  // Pass along old state unless there is a reason to change it.
  let newState: stateDiagram = {
    gameBegin: false,
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

  // convenience alias
  let previousGeeseAt: [] = previousState.get('geeseAt');

  if (message.gameBegin) {
    // Build newstate
    atStartNoMoves();
    // Ready to send newState to viewUpdate
    return fromJS(newState);
  }

  if (previousState.get('foxWon') || previousState.get('geeseWon')) {
    // In a game-won state, the controls should not work.
    newState.legalMoves = [];
    newState.legalJumps = [];
    newState.messageToView == previousState.get('foxWon') ? FOX_WON : GEESE_WON;
    return fromJS(newState);
  }

  if (message.dropTargetOn) {
    if (message.clearDragShadow) {
      newState.dropTargetOff = message.dropTargetOn;
    } else {
      newState.dropTargetOn = message.dropTargetOn;

      // Do I need this?
      return fromJS(newState);
    }
  }

  if (message.foxMoved) {
    if (!newState.foxTurn) {
      newState.messageToView = NOT_FOX_TURN;
      return fromJS(newState);
    }
    // Check if the prevTurnJumped, if so, only check jump logic.
    // Implement this.

    if (foxJumpIsLegal(previousState.get('legalJumps').toJS())) {
      foxJumpsAGoose();
    } else if (foxMoveIsLegal(previousState.get('legalMoves'))) {
      foxMoves();
    } else {
      // No need to reset any state, it only matters to send a message
      // for viewUpdate to display
      newState.messageToView = ILLEGAL_MOVE;
      return fromJS(newState);
    } // foxMoveIsLegal
  } else {
    //This else block is from checking if the message passed Fox moved,
    //else implements Goose moved

    // Check if it is Geese tried to move when it was Fox's turn
    if (newState.foxTurn) {
      newState.messageToView = NOT_GEESE_TURN;
      return fromJS(newState);
    }

    if (gooseMoveIsLegal(previousState.get('legalMoves'))) {
      gooseMoves();
    } else {
      // No need to reset any state, it only matters to send a message
      // for viewUpdate to display
      newState.messageToView = ILLEGAL_MOVE;
      return fromJS(newState);
    }
  }

  // check if fox won
  if (newState.geeseAt.size <= 4) {
    newState.foxWon = true;
    newState.messageToView = FOX_WON;
  }

  // check if geese won
  /* This happens after the turn is toggled so that fox's legal moves can 
    be checked. Geese only win at the close of their turn and do not jump 
    the fox, so it is OK to do this after toggling the turn to fox. */

  if (
    newState.foxTurn &&
    newState.legalMoves.size === 0 &&
    newState.legalJumps.size === 0
  ) {
    //   check fox legal moves. If there are none, geese won.
    newState.geeseWon = true;
    newState.messageToView = GEESE_WON;
  }

  /* 
  These repopulate the legal moves lists at the close of each turn
  */

  function setFoxLegalMoves(foxAt: number) {
    return (
      boardNeighbors
        .get(foxAt)
        //@ts-ignore
        .filter(direction => !newState.geeseAt.includes(direction))
        //@ts-ignore
        .map(neighbor => [foxAt, neighbor])
    );
  }
  function setFoxLegalJumps(foxAt: number) {
    // The board knows where fox can go in one move, so use that to
    // figure out what directions the fox can go.
    let directions = boardNeighbors
      .get(foxAt)
      // @ts-ignore
      .map(neighbor => neighbor - foxAt);
    // @ts-ignore
    let checkGoose = directions.filter(dir =>
      newState.geeseAt.includes(foxAt + dir)
    );
    let canJumpTo = checkGoose
      .filter(
        //@ts-ignore
        // No goose 2 away
        dir => !newState.geeseAt.includes(foxAt + dir * 2)
      )
      // @ts-ignore
      // Check neighbor that it has a valid neighbor in that direction
      .filter(dir => boardNeighbors.get(foxAt + dir).includes(foxAt + dir * 2))
      //@ts-ignore
      // create array of current position, next position
      .map(dir => [foxAt, foxAt + dir * 2]);
    return canJumpTo;
  }
  function setGeeseLegalMoves(geeseAt: any) {
    // for each goose in array, as per fox
    let eachGooseMoves;
    let allowedGooseMovesArr = [];
    for (let i = 0; i < geeseAt.size; i++) {
      eachGooseMoves = boardNeighbors
        .get(geeseAt.get(i))
        //@ts-ignore
        .filter(direction => !geeseAt.includes(direction))
        //@ts-ignore
        .filter(direction => direction !== newState.foxAt)
        //@ts-ignore
        .map(neighbor => [geeseAt.get(i), neighbor]);

      for (let j = 0; j < eachGooseMoves.size; j++) {
        allowedGooseMovesArr.push(eachGooseMoves.get(j));
      }
    }
    return List(allowedGooseMovesArr);
  }

  /*
  Legal move checker functions
  */

  function foxJumpIsLegal(legalJumpsArr: []) {
    for (let i = 0; i < legalJumpsArr.length; i++) {
      if (
        legalJumpsArr[i][0] === message.moveFrom &&
        legalJumpsArr[i][1] === message.moveTo
      ) {
        return true;
      }
    }
    return false;
  }

  function foxMoveIsLegal(legalMovesList: any) {
    const legalMovesArr = legalMovesList.toJS();
    // Check in each direction move is legal.
    for (let i = 0; i < legalMovesArr.length; i++) {
      if (
        legalMovesArr[i][0] === message.moveFrom &&
        legalMovesArr[i][1] === message.moveTo
      ) {
        return true;
      }
    }
    return false;
  }

  function gooseMoveIsLegal(legalMovesList: any) {
    const legalMovesArr = legalMovesList.toJS();
    for (let i = 0; i < legalMovesArr.length; i++) {
      if (
        legalMovesArr[i][0] === message.moveFrom &&
        legalMovesArr[i][1] === message.moveTo
      ) {
        return true;
      }
    }
    return false;
  }

  /*
  Animal mover functions
  */
  // These would be really nice as object destructuring spread operator syntax
  function atStartNoMoves() {
    newState.geeseAt = previousGeeseAt;
    newState.messageToView = GEESE_GO;
    newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
  }

  function foxMoves() {
    newState.foxAt = message.moveTo;
    newState.geeseAt = previousGeeseAt;
    newState.foxTurn = false;
    newState.messageToView = GEESE_GO;
    newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
  }
  function gooseMoves() {
    let newGeeseAt: any = previousGeeseAt
      .filter(goose => goose !== message.moveFrom)
      //@ts-ignore
      .push(message.moveTo);
    // 3. place piece on new tile
    newState.geeseAt = newGeeseAt;
    newState.foxTurn = true;

    newState.legalMoves = setFoxLegalMoves(newState.foxAt);
    newState.legalJumps = setFoxLegalJumps(newState.foxAt);

    newState.messageToView = FOX_GOES;
  }

  function foxJumpsAGoose() {
    newState.geeseAt = geeseLocations(NO_OF_GEESE);
    newState.foxAt = message.moveTo;
    newState.foxJumped = true;
    newState.legalMoves = [];

    const jumpedTile = (message.moveFrom + message.moveTo) / 2;
    newState.geeseAt = previousGeeseAt.filter(tile => tile !== jumpedTile);

    const jumps = setFoxLegalJumps(newState.foxAt);

    if (jumps.size > 0) {
      // check for legal jump moves. If so, set legal jumps,
      newState.foxTurn = true;
      newState.legalJumps = jumps;
      newState.messageToView = FOX_GOES;
    } else {
      // otherwise, relinquishes turn to geese.
      newState.foxTurn = false;
      newState.messageToView = GEESE_GO;
      newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
    }
  }
  return fromJS(newState);
}
