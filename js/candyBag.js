import Candy from "./Candy.js";
import { getRandomInt } from "./main.js";
import { TILE_SIZE_W, TILE_SIZE_H } from "./Painter.js";

const BAG_LEFT_CORNER_X = 25;
const BAG_LEFT_CORNER_Y = 25;
const CANDY_BAG_ROWS = 12;
const CANDY_BAG_COLS = 5;
const CANDY_BAG_PREFILLED_ROWS = 6;

const GENERATE_CANDIES_AMOUNT = 3; //less than CANDY_BAG_COLS!

class CandyBag {

    constructor(painter) {
        this.candyBag = new Array(CANDY_BAG_ROWS * CANDY_BAG_COLS);
        this.closeCandies = new Array();
        this.explodingCandies = new Array();
        //this.fallingCandiesAfterEx = new Array(CANDY_BAG_COLS);
        this.lowestFreeSpace = new Array(CANDY_BAG_COLS);
        this.painter = painter;
        this.remainingCandies = 0;
    }

    reset() {
        this.candyBag.fill(null);
        this.lowestFreeSpace = [0 + (CANDY_BAG_COLS*(CANDY_BAG_ROWS-1)), 1 + (CANDY_BAG_COLS*(CANDY_BAG_ROWS-1)), 
                                2 + (CANDY_BAG_COLS*(CANDY_BAG_ROWS-1)), 3 + (CANDY_BAG_COLS*(CANDY_BAG_ROWS-1)), 
                                4 + (CANDY_BAG_COLS*(CANDY_BAG_ROWS-1))];
    }
    
    prefillCandybag() {
        let bagIndex;
        
        for (let col = 0; col < CANDY_BAG_COLS; col++) {
            for(let row=CANDY_BAG_ROWS-1; row > CANDY_BAG_PREFILLED_ROWS; row--) {
                bagIndex = row*CANDY_BAG_COLS+col;
                this.candyBag[bagIndex] = new Candy();
                this.candyBag[bagIndex].isFalling = false;
                this.remainingCandies++;
            }
        }
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
            this.remainingCandies += GENERATE_CANDIES_AMOUNT;
        }
    }
    
    processClickedBagPosition(mouseX, mouseY) {
        let eatenCandies = 0;
        let eatenColor = null;
        if ((mouseX > BAG_LEFT_CORNER_X && mouseX <= ((CANDY_BAG_COLS * TILE_SIZE_W) + BAG_LEFT_CORNER_X)) && 
            (mouseY > BAG_LEFT_CORNER_Y && mouseY <= ((CANDY_BAG_ROWS * TILE_SIZE_H) + BAG_LEFT_CORNER_Y))) {
                let clickedX = Math.floor((mouseX - BAG_LEFT_CORNER_X)/TILE_SIZE_W);
                let clickedY = Math.floor((mouseY - BAG_LEFT_CORNER_Y)/TILE_SIZE_H);
                let clickedIndex = clickedY * CANDY_BAG_COLS + clickedX;
                if (this.candyBag[clickedIndex] != null) {
                    if(!this.candyBag[clickedIndex].isFalling) {
                        this.closeCandies.push(clickedIndex);
                        
                        let auxCandy = this.candyBag[clickedIndex];
                        eatenColor = auxCandy.candyColor;
                        auxCandy.isEaten++;
                        auxCandy.indexExplosion = clickedIndex;
                        this.explodingCandies.push(auxCandy);
                        this.candyBag[clickedIndex] = null;
                        this.updateLowestFreeSpace(clickedIndex);
                        eatenCandies++;
                        while (this.closeCandies.length > 0) {
                            eatenCandies += this.checkCloseByCandies(this.closeCandies.length - 1, auxCandy.candyColor);
                        }
                    }
                }
        }

        return { eatenCount: eatenCandies, eatenColor: eatenColor };
    }

    checkCloseByCandies(positionToBeChecked, colorToBeChecked) {
        let currentPosition = this.closeCandies[positionToBeChecked];
        let eatenCandies = 0;
    
        this.closeCandies.splice(positionToBeChecked, 1);
    
        //if it's not in the first row, we check the candy above
        if(currentPosition >= CANDY_BAG_COLS) {
            eatenCandies += this.addToCloseCandies(currentPosition - CANDY_BAG_COLS, colorToBeChecked, true);
        }
        //if it's not against the left wall, we check the candy to the left
        if(currentPosition % CANDY_BAG_COLS != 0) {
            eatenCandies += this.addToCloseCandies(currentPosition - 1, colorToBeChecked, false);
        }
        //if it's not in the last row, we check the candy below
        if(currentPosition < (CANDY_BAG_COLS*(CANDY_BAG_ROWS - 1))) {
            eatenCandies += this.addToCloseCandies(currentPosition + CANDY_BAG_COLS, colorToBeChecked, false);
        }
        //if it's not against the right wall, we check the candy to the right
        if((currentPosition + 1) % (CANDY_BAG_COLS) != 0) {
            eatenCandies += this.addToCloseCandies(currentPosition + 1, colorToBeChecked, false);
        }
        return eatenCandies;
    }
    
    updateLowestFreeSpace(index) {
        let col = index % CANDY_BAG_COLS;
        if(this.lowestFreeSpace[col] < index) {
            this.lowestFreeSpace[col] = index;
        }
    }

    addToCloseCandies(position, colorToBeChecked, direction) {
        let eaten = 0;
        if (this.candyBag[position] != null) {
            if (this.candyBag[position].isFalling == false && this.candyBag[position].isEaten == 0) {
                if (this.candyBag[position].candyColor == colorToBeChecked) {
                    eaten++;
                    let auxCandy = this.candyBag[position];
                    auxCandy.isEaten++;
                    auxCandy.indexExplosion = position;
                    this.explodingCandies.push(auxCandy); 
                    this.candyBag[position] = null;
                    this.updateLowestFreeSpace(position);
                    //this.candyBag[position].isEaten++;
                    this.closeCandies.push(position);
                } else if(direction) {
                    for (let i=(position % CANDY_BAG_COLS); i <= position; i = i+CANDY_BAG_COLS) {
                        if (this.candyBag[i] != null) {
                            this.candyBag[i].isMoved = false;
                            this.candyBag[i].isFalling = true;
                            
                        }
                    } 
                }
            }
        }
        return eaten;
    }
    
    drawCandyBag() {
        let bagIndex = 0;
        let auxCandy;
        let drawAtX;
        let drawAtY;

        for (let row = 0; row < CANDY_BAG_ROWS; row++) {
            for (let col = 0; col < CANDY_BAG_COLS; col++) {
                bagIndex = row*CANDY_BAG_COLS+col;
                auxCandy = this.candyBag[bagIndex]; 
                drawAtX = BAG_LEFT_CORNER_X + (col*TILE_SIZE_W);
                drawAtY = BAG_LEFT_CORNER_Y + (row*TILE_SIZE_H);
                this.painter.drawTile(bagIndex % 2, drawAtX, drawAtY);
                if (auxCandy != null) {
                    this.drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex);
                }
                this.painter.colorText(row + "-" + col, drawAtX+ 10, drawAtY + 10, undefined, "10px");
            }
        }
        this.drawExplosions();
    }

    moveFallingCandies() {
        let bagIndex = 0;
        let auxCandy;
        let calculatingLowestFreeSpace = Array(CANDY_BAG_COLS);
        let pendingCandies = Array(CANDY_BAG_COLS);
        
        calculatingLowestFreeSpace.fill(-1);
        pendingCandies.fill(null);
        for (let row = 0; row < CANDY_BAG_ROWS; row++) {
            for (let col = 0; col < CANDY_BAG_COLS; col++) {
                bagIndex = row*CANDY_BAG_COLS+col;
                auxCandy = this.candyBag[bagIndex]; 
                if (auxCandy != null) {
                    if(auxCandy.isFalling) {
                        if (this.lowestFreeSpace[col] <= bagIndex) {
                            auxCandy.isMoved = true;
                            auxCandy.isFalling = false;
                            let auxIndex = bagIndex - CANDY_BAG_COLS;
                            while (this.candyBag[auxIndex] != null) {
                                this.candyBag[auxIndex].isFalling = false;
                                this.candyBag[auxIndex].isMoved = true;
                                auxIndex -= CANDY_BAG_COLS;
                            }
                        } else {
                            if (auxCandy.isMoved) {
                                auxCandy.isMoved = false;
                            } else {
                                if (pendingCandies[col] != null) {
                                    this.candyBag[bagIndex] = pendingCandies[col];
                                    pendingCandies[col] = null;
                                } else {
                                    this.candyBag[bagIndex] = null;
                                    if(calculatingLowestFreeSpace[col] < bagIndex) {
                                        calculatingLowestFreeSpace[col] = bagIndex;
                                    }
                                }
                                if (this.candyBag[bagIndex+CANDY_BAG_COLS] == null) {
                                    //if position under is empty, move the falling candy
                                    auxCandy.isMoved = true;
                                    this.candyBag[bagIndex+CANDY_BAG_COLS] = auxCandy;   
                                } else if(this.candyBag[bagIndex+CANDY_BAG_COLS].isFalling) {
                                    //candy under is also falling
                                    pendingCandies[col] = auxCandy;
                                } else { //MAYBE NOT NECESSARY
                                    //if position under is NOT empty, and the candy is not falling either
                                    auxCandy.isMoved = true;
                                    auxCandy.isFalling = false;
                                    this.candyBag[bagIndex] = auxCandy;
                                }
                            }
                        }
                    }
                } else {
                    calculatingLowestFreeSpace[col] = bagIndex;
                }
            }
        }
        this.lowestFreeSpace = calculatingLowestFreeSpace.slice();
    }
    
    drawStaticCandy(auxCandy, drawAtX, drawAtY, bagIndex) {
        this.painter.drawCandy(auxCandy, drawAtX, drawAtY);
    }
    
    drawExplosions() {
        for (let i=0; i < this.explodingCandies.length; i++) {
            let auxCandy = this.explodingCandies[i]; 
            let drawAtX = BAG_LEFT_CORNER_X + ((auxCandy.indexExplosion % CANDY_BAG_COLS)*TILE_SIZE_W);
            let drawAtY = BAG_LEFT_CORNER_Y + (Math.floor(auxCandy.indexExplosion/CANDY_BAG_COLS)*TILE_SIZE_H);
            this.painter.drawExplosion(auxCandy, drawAtX, drawAtY);
            if (auxCandy.isEaten == 0) {
                this.explodingCandies.splice(i, 1);
                this.remainingCandies--;            
            }
        }
    }

}

export default CandyBag;

