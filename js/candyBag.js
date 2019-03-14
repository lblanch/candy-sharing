const BAG_LEFT_CORNER_X = 50;
const BAG_LEFT_CORNER_Y =25;

const CANDY_BAG_ROWS = 12;
const CANDY_BAG_COLS = 5;

const CANDY_SIZE_W = 45;
const CANDY_SIZE_H = 45;

const GENERATE_CANDIES_AMOUNT = 3; //less than CANDY_BAG_COLS!

var candyBag = new Array(CANDY_BAG_ROWS * CANDY_BAG_COLS);
var closeCandies = new Array();
var explodingCandies = new Array();
var fallingCandiesAfterEx = new Array(CANDY_BAG_COLS);
var lowestFreeSpace = new Array(CANDY_BAG_COLS);

function reset() {
    //fallingCandiesAfterEx.fill(null);
    candyBag.fill(null);
    lowestFreeSpace.fill(CANDY_BAG_ROWS-1);
}

function generateCandies() {
    var generatedPosition;
    var indexInGeneratedPosition;
    var stopGenerating = false;

    var auxArray = new Array(CANDY_BAG_COLS);
    for (var i = 0; i < CANDY_BAG_COLS; i++) {
        auxArray[i] = i;
        if (candyBag[i] != null) {
            stopGenerating = true;
            break;
        }
    }
    if (!stopGenerating) {
        for (var j = 0; j < GENERATE_CANDIES_AMOUNT; j++) {
            generatedPosition = getRandomInt(auxArray.length);
            indexInGeneratedPosition = auxArray[generatedPosition];
            auxArray.splice(generatedPosition,1);
            candyBag[indexInGeneratedPosition] = new candyClass(CANDY_TYPES_ROWS[getRandomInt(CANDY_TYPES_ROWS.length)], CANDY_COLORS_COLS[getRandomInt(CANDY_COLORS_COLS.length)], true);
        }
    }
}

function checkCloseByCandies(positionToBeChecked, colorToBeChecked) {
    var currentPosition = closeCandies[positionToBeChecked];

    closeCandies.splice(positionToBeChecked, 1);
    currentColor = candyBag[currentPosition].candyColor;

    //if it's not in the first row, we check the candy above
    if(currentPosition >= CANDY_BAG_COLS) {
        //fallingCandiesAfterEx[currentPosition % CANDY_BAG_COLS] = currentPosition - CANDY_BAG_COLS;
        addToCloseCandies(currentPosition - CANDY_BAG_COLS, colorToBeChecked, true);
    }
    //if it's not against the left wall, we check the candy to the left
    if(currentPosition % CANDY_BAG_COLS != 0) {
        addToCloseCandies(currentPosition - 1, colorToBeChecked, false);
    }
    //if it's not in the last row, we check the candy below
    if(currentPosition < (CANDY_BAG_COLS*(CANDY_BAG_ROWS - 1))) {
        addToCloseCandies(currentPosition + CANDY_BAG_COLS, colorToBeChecked, false);
    }
    //if it's not against the right wall, we check the candy to the right
    if((currentPosition + 1) % (CANDY_BAG_COLS) != 0) {
        addToCloseCandies(currentPosition + 1, colorToBeChecked, false);
    }
     
}

function addToCloseCandies(position, colorToBeChecked, direction) {
    if (candyBag[position] != null) {
        if (candyBag[position].isFalling == false && candyBag[position].isEaten == 0) {
            if (candyBag[position].candyColor == colorToBeChecked) {    
                candyBag[position].isEaten++;
                closeCandies.push(position);
            } else if(direction) {
                //console.log(candyBag[position].candyType + "_" + candyBag[position].candyColor + " starts falling " + position + " at col " + position % CANDY_BAG_COLS);
                for (var i=(position % CANDY_BAG_COLS); i <= position; i = i+CANDY_BAG_COLS) {
                    if (candyBag[i] != null) {
                        candyBag[i].isMoved = false;
                        candyBag[i].isFalling = true;
                        
                    }
                } 
            }
        }
    }
}

function drawCandyBag(fallingTime) {
    var bagIndex = 0;
    var auxCandy;
    var drawAtX;
    var drawAtY;
    var calculatingLowestFreeSpace = Array(CANDY_BAG_COLS);
    var pendingCandies = Array(CANDY_BAG_COLS);

    for (var row = 0; row < CANDY_BAG_ROWS; row++) {
        for (var col = 0; col < CANDY_BAG_COLS; col++) {
            bagIndex = row*CANDY_BAG_COLS+col;
            auxCandy = candyBag[bagIndex]; 
            drawAtX = BAG_LEFT_CORNER_X + (col*CANDY_SIZE_W);
            drawAtY = BAG_LEFT_CORNER_Y + (row*CANDY_SIZE_H);
            canvasContext.drawImage(tilePics[bagIndex % 2], drawAtX, drawAtY);
            if (auxCandy != null) {
                if(fallingTime) {
                    if(auxCandy.isFalling) {
                        //console.log("checking falling candy " + auxCandy.candyType + "_" + auxCandy.candyColor + " at " +bagIndex);
                        //console.log(lowestFreeSpace[col] + " is the lowest free space in col " +col);
                        if (lowestFreeSpace[col] <= bagIndex) {
                            //console.log("No more free spaces under current candy! STOP!");
                            auxCandy.isMoved = true;
                            auxCandy.isFalling = false;
                        } else {
                            if (auxCandy.isMoved) {
                                //console.log("I was moved, so we draw it");
                                auxCandy.draw(drawAtX, drawAtY);
                                auxCandy.isMoved = false;
                            } else {
                                if (pendingCandies[col] != null) {
                                    //console.log("there's a pending candy in this col " + pendingCandies[col].candyType + "_" + pendingCandies[col].candyColor);
                                    candyBag[bagIndex] = pendingCandies[col];
                                    pendingCandies[col] = null;
                                } else {
                                    candyBag[bagIndex] = null;
                                }
                                if (candyBag[bagIndex+CANDY_BAG_COLS] == null) {
                                    //if position under is empty, move the falling candy
                                    //console.log("if position under is empty, move the falling candy");
                                    auxCandy.isMoved = true;
                                    candyBag[bagIndex+CANDY_BAG_COLS] = auxCandy;   
                                } else if(candyBag[bagIndex+CANDY_BAG_COLS].isFalling) {
                                    //candy under is also falling
                                    //console.log("candy under is also falling");
                                    auxCandy.isMoved = true;
                                    pendingCandies[col] = auxCandy;
                                }    
                            }
                        }
                    } else {
                        drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex);
                    }
                } else { //we paint everything in the position it is
                    drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex);
                }
            } else {
                calculatingLowestFreeSpace[col] = bagIndex;
            }
        }
    }
    drawExplosions();
    //fallingCandiesAfterEx.fill(null);
    lowestFreeSpace = calculatingLowestFreeSpace.slice();
}

function drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex) {
    if (auxCandy.isEaten == 0) {
        auxCandy.draw(drawAtX, drawAtY);
    } else {
        explodingCandies.push(bagIndex);
    }
}

function drawExplosions() {
    for (let bagIndex of explodingCandies) {
        auxCandy = candyBag[bagIndex]; 
        drawAtX = BAG_LEFT_CORNER_X + ((bagIndex % CANDY_BAG_COLS)*CANDY_SIZE_W);
        drawAtY = BAG_LEFT_CORNER_Y + (Math.floor(bagIndex/CANDY_BAG_COLS)*CANDY_SIZE_H);
        if (auxCandy != null) {
            auxCandy.drawExplosion(drawAtX, drawAtY);
            if (auxCandy.isEaten == 0) {
                candyBag[bagIndex] = null;
            }
        }
    }
    explodingCandies = new Array();
}