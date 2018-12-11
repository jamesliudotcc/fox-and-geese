var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var directions = [N, NE, E, SE, S, SW, W, NW];
var previousState; //Using?
var currentState = Object.assign({}, startingState);
var gameMessages = document.getElementById('game-messages');
// Create fox event listener, once triggered:
//This is so I can play Fox & Geese from the console
function foxMoves(movesFrom, movesTo) {
    currentState = updater(__assign({}, foxMoveCheck(movesFrom, movesTo)), currentState);
    viewUpdate(currentState);
}
function gooseMoves(movesFrom, movesTo) {
    currentState = updater(__assign({}, gooseMoveCheck(movesFrom, movesTo)), currentState);
    viewUpdate(currentState);
}
function foxMoveCheck(movesFrom, movesTo) {
    var jumped = false; // assume that the fox does not jump a goose
    if ( /*move is legal*/null) {
        var jumped_1 = false;
    }
    if ( /*jump is legal*/null) {
        jumped = true;
    }
    else {
        // call error handler
        return null;
    }
    //
    return {
        foxMoved: true,
        jumped: jumped,
        moveFrom: movesFrom,
        moveTo: movesTo
    };
}
// Create goose event listener, once triggered:
function gooseMoveCheck(movesFrom, movesTo) {
    //check if move legal
    //return
    return {
        foxMoved: false,
        jumped: false,
        moveFrom: movesFrom,
        moveTo: movesTo
    };
}
function updater(message, previousState) {
    // Any until I get Immutable working with TS
    var newState = {
        foxWon: false,
        geeseWon: false,
        foxTurn: false,
        foxJumped: false,
        foxAt: 0,
        geeseAt: [],
        legalMoves: [],
        legalJumps: []
    }; // Make updates to newState and return it as immutable
    // set new position for moved piece
    if (message.foxMoved) {
        newState.foxAt = message.moveTo;
    }
    else {
        // 1. read positions from the old state
        var previousGeeseAt = previousState.get('geeseAt');
        // 2. remove piece from old tile
        var newGeeseAt = previousGeeseAt.filter(function (goose) { return goose !== message.moveFrom; });
        // 3. place piece on new tile
        newGeeseAt.push(message.moveTo);
        newState.geeseAt = newGeeseAt;
    }
    if ((message.jumped = true)) {
        newState.foxJumped = true;
        newState.foxTurn = true;
        // remove the goose
        console.log('Fox caught a gooose!');
    }
    else {
        newState.foxTurn = false;
        newState.foxTurn = !message.foxMoved;
    }
    // Create the new legal moves
    //   if (newState.foxTurn) {
    //     // create legal single space moves
    //   } else {
    //   }
    // check if fox won
    if (newState.geeseAt.length <= 4) {
        newState.foxWon = true;
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
    // Only reflect the current game state on the view in this function
    var boardTiles = document.getElementsByClassName('active-tile');
    for (var i = 0; i < HEIGHT * WIDTH; i++) {
        // remove the fox and goose classes from all of the tiles
        boardTiles[i].classList.remove('fox');
        boardTiles[i].classList.remove('goose');
        // put goose classes tiles based on currentState
        if (currentState.get('GeeseAt').includes(i)) {
            boardTiles[i].classList.add(GOOSE);
        }
    } // for
    // Only one place where the fox might be:
    boardTiles[currentState.get('FoxAt')].classList.add(FOX);
    // Declare victory for fox or geese if appropriate
    if (currentState.get('foxWon')) {
        gameMessages.textContent = 'Fox Won!';
        // Turn off board.
    }
    if (currentState.get('geeseWon')) {
        gameMessages.textContent = 'Geeeese Won!';
        // Turn off board.
        // number of ee's == number of geese
    }
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
