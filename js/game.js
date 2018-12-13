//ImmutabeJS types are declared as any for now.
let currentState;
let boardList; // Directory of legal moves
document.addEventListener('DOMContentLoaded', main);
function main() {
    boardList = createBoard();
    function createBoardState() {
        // TODO: Place geese should be in board-setup.ts
        // Place geese
        for (let i = 28; i < HEIGHT * WIDTH; i++) {
            if (boardList.get(i)) {
                startingState.geeseAt.push(i);
            }
        } // for
        return fromJS(startingState);
    }
    startingState = createBoardState();
    createBoardDOMElement(boardList);
    currentState = allowFirstMove(startingState);
}
function allowFirstMove(startingState) {
    return startingState;
}
//This is so I can play Fox & Geese from the console
function foxMoves(movesFrom, movesTo) {
    let jumped = false;
    //implement logic to check whether a jump happened.
    let messageToUpdate = {
        foxMoved: true,
        jumped: jumped,
        moveFrom: movesFrom,
        moveTo: movesTo,
    };
    currentState = updater(messageToUpdate, currentState);
    viewUpdate(currentState);
}
function gooseMoves(movesFrom, movesTo) {
    let messageToUpdate = {
        foxMoved: false,
        jumped: false,
        moveFrom: movesFrom,
        moveTo: movesTo,
    };
    currentState = updater(messageToUpdate, currentState);
    viewUpdate(currentState);
}
function updater(message, previousState) {
    // Any until I get Immutable working with TS
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
    //read previous geese state
    let previousGeeseAt = previousState.get('geeseAt');
    if (message.foxMoved) {
        // Check if it is Fox's turn to move
        if (!newState.foxTurn) {
            newState.messageToView = NOT_FOX_TURN;
            return fromJS(newState);
        }
        const legalMovesArr = previousState.get('legalMoves').toJS();
        // Check if move is legal.
        let foxMoveIsLegal = false;
        for (let i = 0; i < legalMovesArr.length; i++) {
            if (legalMovesArr[i][0] === message.moveFrom &&
                legalMovesArr[i][1] === message.moveTo) {
                foxMoveIsLegal = true;
                break;
            }
        }
        if (foxMoveIsLegal) {
            //Move logic
            newState.foxAt = message.moveTo;
            newState.geeseAt = previousGeeseAt;
        }
        else {
            // No need to reset any state, it only matters to send a message
            // for viewUpdate to display
            newState.messageToView = ILLEGAL_MOVE;
            return fromJS(newState);
        } // foxMoveIsLegal
    }
    else {
        // Check if it is Geese tried to move when it was Fox's turn
        if (newState.foxTurn) {
            newState.messageToView = NOT_GEESE_TURN;
            return fromJS(newState);
        }
        // Check if Geese's move is legal
        let newGeeseAt = previousGeeseAt
            .filter(goose => goose !== message.moveFrom)
            //@ts-ignore
            .push(message.moveTo);
        // 3. place piece on new tile
        newState.geeseAt = newGeeseAt;
        newState.foxTurn = true;
        newState.messageToView = FOX_GOES;
    }
    if (message.jumped) {
        newState.foxTurn = true;
        // remove the jumped goose
        console.log('Fox caught a gooose!');
    }
    else {
        newState.foxTurn = false;
        newState.foxTurn = !message.foxMoved;
    }
    if (newState.foxTurn) {
        newState.messageToView = FOX_GOES;
        newState.legalMoves = setFoxLegalMoves(newState.foxAt);
    }
    else {
        newState.messageToView = GEESE_GO;
        newState.legalMoves = setGeeseLegalMoves(newState.geeseAt);
    }
    function setFoxLegalMoves(foxAt) {
        return (boardList
            .get(foxAt)
            //@ts-ignore
            .filter(direction => !newState.geeseAt.includes(direction))
            //@ts-ignore
            .map(neighbor => [foxAt, neighbor]));
    }
    function setGeeseLegalMoves(geeseAt) {
        // for each goose in array, as per fox
        let eachGooseMoves;
        let allowedGooseMovesArr = [];
        for (let i = 0; i < geeseAt.size; i++) {
            eachGooseMoves = boardList
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
        return fromJS(allowedGooseMovesArr);
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
function viewUpdate(currentState) {
    const gameMessages = document.getElementById('game-messages');
    // Only reflect the current game state on the view in this function
    const boardTiles = document.getElementsByClassName('active-tile');
    const messagesToDisplay = currentState.get('messageToView');
    console.log(messagesToDisplay);
    for (let i = 0; i < HEIGHT * WIDTH; i++) {
        // remove the fox and goose classes from all of the tiles
        if (boardTiles[i] !== undefined) {
            boardTiles[i].classList.remove('fox');
            boardTiles[i].classList.remove('goose');
        }
    } // for
    //   put goose classes tiles based on currentState
    let newGooseLoc;
    for (let i = 0; i < currentState.get('geeseAt').size; i++) {
        newGooseLoc = document.getElementById(currentState.get('geeseAt').get(i));
        newGooseLoc.classList.add('goose');
    }
    // Only one place where the fox might be:
    let newFoxLoc = document.getElementById(currentState.get('foxAt').toString());
    newFoxLoc.classList.add('fox');
    boardTiles[currentState.get('foxAt')];
    // Declare victory for fox or geese if appropriate
    if (currentState.get('foxWon')) {
        gameMessages.textContent = 'Fox Won!';
        // Turn off board.
    }
    //   if (currentState.get('geeseWon')) {
    //     gameMessages.textContent = 'Geeeese Won!';
    //     // Turn off board.
    //     // number of ee's == number of geese
    //   }
}
// // Implement cheater state:
// function cheaterState() {
//   currentState = fromJS({
//     foxWon: false,
//     geeseWon: false,
//     foxTurn: false,
//     foxJumped: false,
//     foxAt: 17, // Fox placed here.
//     geeseAt: [],
//     legalMoves: [], // calculate legal moves
//     legalJumps: [], // calculate legal jumps
//   });
// }
