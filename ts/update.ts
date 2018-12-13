function update(
  message: {
    foxMoved: boolean;
    jumped: boolean;
    moveFrom: number;
    moveTo: number;
  },
  previousState: any
): any {
  // Any until I get Immutable working with TS
  let newState: {
    foxWon: boolean;
    geeseWon: boolean;
    foxTurn: boolean;
    foxJumped: boolean;
    foxAt: number;
    geeseAt: number[];
    legalMoves: any;
    legalJumps: number[][];
    messageToView: string;
  } = {
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
  // Make updates to newState and return it as immutable

  //read previous geese state
  let previousGeeseAt: [] = previousState.get('geeseAt');

  if (message.foxMoved) {
    // Check if it is Fox's turn to move
    if (!newState.foxTurn) {
      newState.messageToView = NOT_FOX_TURN;
      return fromJS(newState);
    }

    const legalJumpsArr = previousState.get('legalJumps').toJS();
    // Check if jump is made?
    let foxJumpIsLegal = false;
    for (let i = 0; i < legalJumpsArr.length; i++) {
      if (
        legalJumpsArr[i][0] === message.moveFrom &&
        legalJumpsArr[i][1] === message.moveTo
      ) {
        foxJumpIsLegal = true;
        break;
      }
    }

    if (foxJumpIsLegal) {
      newState.foxTurn = true;
      newState.foxAt = message.moveTo;
      newState.geeseAt = previousGeeseAt;
      // Remove the jumped goose
      console.log('Fox caught a gooose! Implement removing it!');
    } else {
      newState.foxTurn = true;
      newState.foxTurn = !message.foxMoved;
    }

    const legalMovesArr = previousState.get('legalMoves').toJS();
    // Check if move is legal.
    let foxMoveIsLegal = false;
    for (let i = 0; i < legalMovesArr.length; i++) {
      if (
        legalMovesArr[i][0] === message.moveFrom &&
        legalMovesArr[i][1] === message.moveTo
      ) {
        foxMoveIsLegal = true;
        break;
      }
    }

    if (foxMoveIsLegal) {
      //Move logic
      newState.foxAt = message.moveTo;
      newState.geeseAt = previousGeeseAt;
    } else {
      // No need to reset any state, it only matters to send a message
      // for viewUpdate to display
      newState.messageToView = ILLEGAL_MOVE;
      return fromJS(newState);
    } // foxMoveIsLegal
  } else {
    //This else block is from checking if Fox or Goose move

    // Check if it is Geese tried to move when it was Fox's turn
    if (newState.foxTurn) {
      newState.messageToView = NOT_GEESE_TURN;
      return fromJS(newState);
    }
    // Check if Geese's move is legal
    const legalMovesArr = previousState.get('legalMoves').toJS();
    let gooseMoveIsLegal = false;
    for (let i = 0; i < legalMovesArr.length; i++) {
      if (
        legalMovesArr[i][0] === message.moveFrom &&
        legalMovesArr[i][1] === message.moveTo
      ) {
        gooseMoveIsLegal = true;
        break;
      }
    }
    if (gooseMoveIsLegal) {
      let newGeeseAt: any = previousGeeseAt
        .filter(goose => goose !== message.moveFrom)
        //@ts-ignore
        .push(message.moveTo);
      // 3. place piece on new tile

      newState.geeseAt = newGeeseAt;
      newState.foxTurn = true;
      newState.messageToView = FOX_GOES;
    } else {
      // No need to reset any state, it only matters to send a message
      // for viewUpdate to display
      newState.messageToView = ILLEGAL_MOVE;
      return fromJS(newState);
    }
  }

  if (newState.foxTurn) {
    newState.messageToView = FOX_GOES;
    newState.legalMoves = setFoxLegalMoves(newState.foxAt);
    newState.legalJumps = setFoxLegalJumps(newState.foxAt);
    console.log(newState.legalJumps);
  } else {
    newState.messageToView = GEESE_GO;
    newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
  }

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
    console.log('Fox is in a square allowing: ', directions);
    // @ts-ignore
    let checkGoose = directions.filter(dir =>
      newState.geeseAt.includes(foxAt + dir)
    );
    console.log(
      'Check if there is a goose next to fox at that direction',
      checkGoose
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
    console.log('can jump to:', canJumpTo);
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

  // check if fox won
  if (newState.geeseAt.length <= 4) {
    console.log('Fox won!');
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
