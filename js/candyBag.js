import Candy from "./Candy.js";
import { getRandomInt } from "./main.js";

const BAG_LEFT_CORNER_X = 50;
const BAG_LEFT_CORNER_Y =25;
const CANDY_BAG_ROWS = 12;
const CANDY_BAG_COLS = 5;
const CANDY_SIZE_W = 45;
const CANDY_SIZE_H = 45;
const GENERATE_CANDIES_AMOUNT = 3; //less than CANDY_BAG_COLS!

class CandyBag {

    constructor(painter) {
        this.candyBag = new Array(CANDY_BAG_ROWS * CANDY_BAG_COLS);
        this.closeCandies = new Array();
        this.explodingCandies = new Array();
        this.fallingCandiesAfterEx = new Array(CANDY_BAG_COLS);
        this.lowestFreeSpace = new Array(CANDY_BAG_COLS);
        this.painter = painter;
    }

    reset() {
        this.candyBag.fill(null);
        this.lowestFreeSpace.fill(CANDY_BAG_ROWS-1);
    }
    
    generateCandies() {
        let generatedPosition;
        let indexInGeneratedPosition;
        let stopGenerating = false;
        let auxArray = new Array(CANDY_BAG_COLS);
        
        for (let i = 0; i < CANDY_BAG_COLS; i++) {
            auxArray[i] = i;
            if (this.candyBag[i] != null) {
                stopGenerating = true;
                break;
            }
        }

        if (!stopGenerating) {
            for (let j = 0; j < GENERATE_CANDIES_AMOUNT; j++) {
                generatedPosition = getRandomInt(auxArray.length);
                indexInGeneratedPosition = auxArray[generatedPosition];
                auxArray.splice(generatedPosition,1);
                this.candyBag[indexInGeneratedPosition] = new Candy();
            }
        }
    }
    
    checkCloseByCandies(positionToBeChecked, colorToBeChecked) {
        let currentPosition = this.closeCandies[positionToBeChecked];
    
        this.closeCandies.splice(positionToBeChecked, 1);
        currentColor = this.candyBag[currentPosition].candyColor;
    
        //if it's not in the first row, we check the candy above
        if(currentPosition >= CANDY_BAG_COLS) {
            this.addToCloseCandies(currentPosition - CANDY_BAG_COLS, colorToBeChecked, true);
        }
        //if it's not against the left wall, we check the candy to the left
        if(currentPosition % CANDY_BAG_COLS != 0) {
            this.addToCloseCandies(currentPosition - 1, colorToBeChecked, false);
        }
        //if it's not in the last row, we check the candy below
        if(currentPosition < (CANDY_BAG_COLS*(CANDY_BAG_ROWS - 1))) {
            this.addToCloseCandies(currentPosition + CANDY_BAG_COLS, colorToBeChecked, false);
        }
        //if it's not against the right wall, we check the candy to the right
        if((currentPosition + 1) % (CANDY_BAG_COLS) != 0) {
            this.addToCloseCandies(currentPosition + 1, colorToBeChecked, false);
        }
         
    }
    
    addToCloseCandies(position, colorToBeChecked, direction) {
        if (this.candyBag[position] != null) {
            if (this.candyBag[position].isFalling == false && this.candyBag[position].isEaten == 0) {
                if (this.candyBag[position].candyColor == colorToBeChecked) {    
                    this.candyBag[position].isEaten++;
                    this.closeCandies.push(position);
                } else if(direction) {
                    for (let i=(position % CANDY_BAG_COLS); i <= position; i = i+CANDY_BAG_COLS) {
                        if (this.candyBag[i] != null) {
                            this.candyBag[i].isMoved = false;
                            this.andyBag[i].isFalling = true;
                            
                        }
                    } 
                }
            }
        }
    }
    
    drawCandyBag(fallingTime) {
        let bagIndex = 0;
        let auxCandy;
        let drawAtX;
        let drawAtY;
        let calculatingLowestFreeSpace = Array(CANDY_BAG_COLS);
        let pendingCandies = Array(CANDY_BAG_COLS);
    
        for (let row = 0; row < CANDY_BAG_ROWS; row++) {
            for (let col = 0; col < CANDY_BAG_COLS; col++) {
                bagIndex = row*CANDY_BAG_COLS+col;
                auxCandy = this.candyBag[bagIndex]; 
                drawAtX = BAG_LEFT_CORNER_X + (col*CANDY_SIZE_W);
                drawAtY = BAG_LEFT_CORNER_Y + (row*CANDY_SIZE_H);
                this.painter.drawTile(bagIndex % 2, drawAtX, drawAtY);
                if (auxCandy != null) {
                    if(fallingTime) {
                        if(auxCandy.isFalling) {
                            if (this.lowestFreeSpace[col] <= bagIndex) {
                                auxCandy.isMoved = true;
                                auxCandy.isFalling = false;
                            } else {
                                if (auxCandy.isMoved) {
                                    this.painter.drawCandy(auxCandy, drawAtX, drawAtY, CANDY_SIZE_W, CANDY_SIZE_H);
                                    //auxCandy.draw(drawAtX, drawAtY);
                                    auxCandy.isMoved = false;
                                } else {
                                    if (pendingCandies[col] != null) {
                                        this.candyBag[bagIndex] = pendingCandies[col];
                                        pendingCandies[col] = null;
                                    } else {
                                        this.candyBag[bagIndex] = null;
                                    }
                                    if (this.candyBag[bagIndex+CANDY_BAG_COLS] == null) {
                                        //if position under is empty, move the falling candy
                                        auxCandy.isMoved = true;
                                        this.candyBag[bagIndex+CANDY_BAG_COLS] = auxCandy;   
                                    } else if(this.candyBag[bagIndex+CANDY_BAG_COLS].isFalling) {
                                        //candy under is also falling
                                        auxCandy.isMoved = true;
                                        pendingCandies[col] = auxCandy;
                                    }    
                                }
                            }
                        } else {
                            this.drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex);
                        }
                    } else { //we paint everything in the position it is
                        this.drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex);
                    }
                } else {
                    calculatingLowestFreeSpace[col] = bagIndex;
                }
            }
        }
        this.drawExplosions();
        this.lowestFreeSpace = calculatingLowestFreeSpace.slice();
    }
    
    drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex) {
        if (auxCandy.isEaten == 0) {
            this.painter.drawCandy(auxCandy, drawAtX, drawAtY, CANDY_SIZE_W, CANDY_SIZE_H);
        } else {
            this.explodingCandies.push(bagIndex);
        }
    }
    
    drawExplosions() {
        for (let bagIndex of this.explodingCandies) {
            auxCandy = this.candyBag[bagIndex]; 
            drawAtX = BAG_LEFT_CORNER_X + ((bagIndex % CANDY_BAG_COLS)*CANDY_SIZE_W);
            drawAtY = BAG_LEFT_CORNER_Y + (Math.floor(bagIndex/CANDY_BAG_COLS)*CANDY_SIZE_H);
            if (auxCandy != null) {
                this.painter.drawExplosion(auxCandy, drawAtX, drawAtY, CANDY_SIZE_W, CANDY_SIZE_H);
                if (auxCandy.isEaten == 0) {
                    this.candyBag[bagIndex] = null;
                }
            }
        }
        this.explodingCandies = new Array();
    }

}

export default CandyBag;

