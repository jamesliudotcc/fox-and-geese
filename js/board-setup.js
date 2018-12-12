function createBoard() {
    let drawBoard = [];
    // Some functions to calculate commonly seen board patterns
    // These functions are created for 3 or more of the same pattern
    let allNeighbors = function (tile) {
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
    const crossNeighbors = function (tile) {
        return List([tile + N, tile + W, tile + E, tile + S]);
    };
    const leftCenter = function (tile) {
        return List([tile + N, tile + E, tile + S]);
    };
    const rightCenter = function (tile) {
        return List([tile + N, tile + W, tile + S]);
    };
    const topCenter = function (tile) {
        return List([tile + W, tile + E, tile + S]);
    };
    const bottomCenter = function (tile) {
        return List([tile + N, tile + W, tile + E]);
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
    // Iniside function, nonmutable is OK.
    return List(drawBoard);
}
function createBoardDOMElement(boardList) {
    let boardMain = document.getElementById('main');
    function newSvgLine(x2, y2) {
        // SVG Line always starts at center: 50, 50; goes to outside
        let svgLine = document.createElementNS(xmlns, 'line');
        svgLine.setAttributeNS(null, 'x1', '50');
        svgLine.setAttributeNS(null, 'x2', x2.toString());
        svgLine.setAttributeNS(null, 'y1', '50');
        svgLine.setAttributeNS(null, 'y2', y2.toString());
        svgLine.setAttributeNS(null, 'stroke', 'black');
        svgLine.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke');
        return svgLine;
    }
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        // All tiles 0 -> 48 are drawn on the DOM`
        let boardTile = document.createElement('div');
        boardTile.className = 'tile';
        boardTile.id = i.toString();
        // Check if tile has any connections to neighbors, if so, set SVG box to draw lines
        if (boardList.get(i)) {
            let svgTag = document.createElementNS(xmlns, 'svg');
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
        // Active tiles should have a html different class
        if (boardList.get(i)) {
            boardTile.classList.add('active-tile');
            //Development scafolding: write numbers on tiles
            let tileLabel = document.createElement('p');
            tileLabel.innerText = i.toString();
            boardTile.appendChild(tileLabel);
        }
        // Fox is an HTML class
        //@ts-ignore
        if (i === startingState.get('foxAt')) {
            boardTile.classList.add(FOX);
        }
        // Geese are a class
        //@ts-ignore
        if (startingState.get('geeseAt').includes(i)) {
            boardTile.classList.add(GOOSE);
        }
        boardMain.appendChild(boardTile);
    } // for
}
