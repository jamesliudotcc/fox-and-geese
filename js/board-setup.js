/*

This file is really a special instance of the view-update
function. The board is only drawn once at the beginning,
and does not change at any time later in the game, so it
lives in its own file.

*/
function createBoardDOMElement(boardList) {
    let boardMain = document.getElementById('main');
    function newSvgLine(x2, y2) {
        // SVG Line always starts at center: 50, 50; goes to outside
        let svgLine = document.createElementNS(XMLNS, 'line');
        svgLine.setAttributeNS(null, 'x1', '50');
        svgLine.setAttributeNS(null, 'x2', x2.toString());
        svgLine.setAttributeNS(null, 'y1', '50');
        svgLine.setAttributeNS(null, 'y2', y2.toString());
        svgLine.setAttributeNS(null, 'stroke', 'black');
        svgLine.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke');
        return svgLine;
    }
    //Main loop for generating each tile element
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        // All tiles 0 -> 48 are drawn on the DOM`
        let boardTile = document.createElement('div');
        boardTile.className = 'tile';
        boardTile.id = i.toString();
        // Check if tile has any connections to neighbors, if so, set SVG box to draw lines
        if (boardList.get(i)) {
            let svgTag = document.createElementNS(XMLNS, 'svg');
            svgTag.setAttributeNS(null, 'viewBox', '0 0 100 100');
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
        // Active tiles should call ondrop function when dropped onto
        if (boardList.get(i)) {
            boardTile.classList.add('active-tile');
            boardTile.setAttribute('ondrop', 'drop(event)');
            boardTile.setAttribute('ondragover', 'allowDrop(event)');
            //Development scafolding: write numbers on tiles
            // let tileLabel = document.createElement('p');
            // tileLabel.innerText = i.toString();
            // boardTile.appendChild(tileLabel);
        }
        /*
    I am trying to get rid of this code, replace with viewUpdate function instead
    */
        // //@ts-ignore
        // if (i === startingState.get('foxAt')) {
        //   // boardTile.classList.add(FOX);
        //   boardTile.appendChild(makeFoxImg());
        // }
        //@ts-ignore
        // if (startingState.get('geeseAt').includes(i)) {
        //   // boardTile.classList.add(GOOSE);
        //   boardTile.appendChild(makeGooseImg());
        // }
        boardMain.appendChild(boardTile);
    } // for
}
// Global scope so that view-update can use
function makeGooseImg() {
    let gooseImg = document.createElement('img');
    gooseImg.setAttribute('src', './assets/goose.svg');
    gooseImg.setAttribute('alt', 'Goose icon');
    gooseImg.setAttribute('class', 'goose');
    gooseImg.setAttribute('draggable', 'true');
    gooseImg.setAttribute('ondragstart', 'drag(event)');
    return gooseImg;
}
function makeFoxImg() {
    let foxImg = document.createElement('img');
    foxImg.setAttribute('src', './assets/fox.svg');
    foxImg.setAttribute('alt', 'Fox icon');
    foxImg.setAttribute('class', 'fox');
    foxImg.setAttribute('draggable', 'true');
    foxImg.setAttribute('ondragstart', 'drag(event)');
    return foxImg;
}
