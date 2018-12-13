function update(message, previousState) {
    // Any until I get Immutable working with TS
    // Initialize newState with some sensible defaults, the update function
    // updates them, returns it as an immutable object. The main function will then
    // pass the newly created state to updateView, which will update the view.
    let newState = {
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
    // convenience aliases
    let previousGeeseAt = previousState.get('geeseAt');
    if (message.foxMoved) {
        console.log('Message passed is foxmoves');
        // Check if it is Fox's turn to move
        if (!newState.foxTurn) {
            newState.messageToView = NOT_FOX_TURN;
            return fromJS(newState);
        }
        // Check if the prevTurnJumped, if so, only check jump logic.
        // Implement this.
        if (foxJumpIsLegal(previousState.get('legalJumps').toJS())) {
            foxJumpsAGoose(newState, message, previousGeeseAt);
        }
        else {
            // console.log('rus newState.foxTurn = true at 60 ????');
            // newState.foxTurn = true; // What does this do?
        }
        function foxMoveIsLegal(legalMovesList) {
            const legalMovesArr = legalMovesList.toJS();
            // Check in each direction move is legal.
            for (let i = 0; i < legalMovesArr.length; i++) {
                if (legalMovesArr[i][0] === message.moveFrom &&
                    legalMovesArr[i][1] === message.moveTo) {
                    return true;
                }
            }
            return false;
        }
        if (foxMoveIsLegal(previousState.get('legalMoves'))) {
            //Move logic
            newState.foxAt = message.moveTo;
            newState.geeseAt = previousGeeseAt;
            newState.foxTurn = false;
        }
        else {
            // No need to reset any state, it only matters to send a message
            // for viewUpdate to display
            newState.messageToView = ILLEGAL_MOVE;
            return fromJS(newState);
        } // foxMoveIsLegal
    }
    else {
        //This else block is from checking if the message passed Fox moved,
        //else implemens Goose moved
        // Check if it is Geese tried to move when it was Fox's turn
        if (newState.foxTurn) {
            newState.messageToView = NOT_GEESE_TURN;
            return fromJS(newState);
        }
        // Check if Geese's move is legal
        const legalMovesArr = previousState.get('legalMoves').toJS();
        let gooseMoveIsLegal = false;
        for (let i = 0; i < legalMovesArr.length; i++) {
            if (legalMovesArr[i][0] === message.moveFrom &&
                legalMovesArr[i][1] === message.moveTo) {
                gooseMoveIsLegal = true;
                break;
            }
        }
        if (gooseMoveIsLegal) {
            let newGeeseAt = previousGeeseAt
                .filter(goose => goose !== message.moveFrom)
                //@ts-ignore
                .push(message.moveTo);
            // 3. place piece on new tile
            newState.geeseAt = newGeeseAt;
            newState.foxTurn = true;
            newState.messageToView = FOX_GOES;
        }
        else {
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
    }
    else {
        newState.messageToView = GEESE_GO;
        newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
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
    /*
    These repopulate the legal moves lists at the close of each turn
    */
    function setFoxLegalMoves(foxAt) {
        return (boardNeighbors
            .get(foxAt)
            //@ts-ignore
            .filter(direction => !newState.geeseAt.includes(direction))
            //@ts-ignore
            .map(neighbor => [foxAt, neighbor]));
    }
    function setFoxLegalJumps(foxAt) {
        // The board knows where fox can go in one move, so use that to
        // figure out what directions the fox can go.
        let directions = boardNeighbors
            .get(foxAt)
            // @ts-ignore
            .map(neighbor => neighbor - foxAt);
        console.log('Fox is in a square allowing: ', directions);
        // @ts-ignore
        let checkGoose = directions.filter(dir => newState.geeseAt.includes(foxAt + dir));
        console.log('Check if there is a goose next to fox at that direction', checkGoose);
        let canJumpTo = checkGoose
            .filter(
        //@ts-ignore
        // No goose 2 away
        dir => !newState.geeseAt.includes(foxAt + dir * 2))
            // @ts-ignore
            // Check neighbor that it has a valid neighbor in that direction
            .filter(dir => boardNeighbors.get(foxAt + dir).includes(foxAt + dir * 2))
            //@ts-ignore
            // create array of current position, next position
            .map(dir => [foxAt, foxAt + dir * 2]);
        console.log('can jump to:', canJumpTo);
        return canJumpTo;
    }
    function setGeeseLegalMoves(geeseAt) {
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
    function foxJumpIsLegal(legalJumpsArr) {
        for (let i = 0; i < legalJumpsArr.length; i++) {
            if (legalJumpsArr[i][0] === message.moveFrom &&
                legalJumpsArr[i][1] === message.moveTo) {
                return true;
            }
        }
        return false;
    }
    function foxJumpsAGoose(newState, message, previousGeeseAt) {
        newState.foxTurn = true;
        newState.foxAt = message.moveTo;
        newState.geeseAt = previousGeeseAt;
        newState.foxJumped = true;
        // Remove the jumped goose
        console.log('Fox caught a gooose! Implement removing it!');
    }
    return fromJS(newState);
}
