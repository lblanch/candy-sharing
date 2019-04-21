import { getRandomInt, _ } from "./main.js";

export const CANDY_TYPES_ROWS = ["bean", "jelly", "lollipop", "mm", "swirl", "wrappedsolid"];
export const CANDY_COLORS_COLS = ["red", "yellow", "purple", "green", "blue"];
const CANDY_EXPLOSIONS_FRAMES = 4;
const FOLDER_CANDY = "candy/";
const FOLDER_EXPLOSIONS = "explosions/explosion_";

class Candy {

    //defaults create a random candy that is falling
    constructor(type = CANDY_TYPES_ROWS[getRandomInt(CANDY_TYPES_ROWS.length)], color = CANDY_COLORS_COLS[getRandomInt(CANDY_COLORS_COLS.length)], falling = true) {
        this.isMoved = false;
        this.candyType = type;
        this._candyColor = color;
        this.isFalling = falling;
        this.isEaten = 0;
        this.indexExplosion = -1;
        this.candyPicIndex = CANDY_TYPES_ROWS.indexOf(this.candyType) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(this.candyColor);
        this.explosionPicIndex = (CANDY_COLORS_COLS.indexOf(this.candyColor)*CANDY_EXPLOSIONS_FRAMES) + (CANDY_COLORS_COLS.length * CANDY_TYPES_ROWS.length) - 1;
    }

    randomizeColor(toBeAvoided = null) {
        //update candyPicIndex AND explosionPicIndex
    }

    randomizeCandy(toBeAvoided = null) {
        //update candyPicIndex
    }

    set candyColor(value) {
        if (value < 0 || value >= CANDY_COLORS_COLS.length) {
            throw new Error("Color out of bounds");
        }
        this._candyColor = value;
        this.candyPicIndex = CANDY_TYPES_ROWS.indexOf(this.candyType) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(this.candyColor);
    }

    get candyColor() {
        return this._candyColor;
    }

    static generateCandyFilenames() {
        let fileNames = [];
        let fileName = "";
        let auxIndex = 0;

        for(let j = 0; j < CANDY_COLORS_COLS.length; j++) {
            for(let i = 0; i < CANDY_TYPES_ROWS.length; i++) {
                auxIndex = i*CANDY_COLORS_COLS.length + j; 
                fileName = FOLDER_CANDY + CANDY_TYPES_ROWS[i] + "_" + CANDY_COLORS_COLS[j];
                fileNames[auxIndex] = fileName;
            }
            for (let k = 1; k <= CANDY_EXPLOSIONS_FRAMES; k++) {
                auxIndex = (j*CANDY_EXPLOSIONS_FRAMES + k) + (CANDY_COLORS_COLS.length * CANDY_TYPES_ROWS.length) - 1;
                fileName = FOLDER_EXPLOSIONS + CANDY_COLORS_COLS[j] + "_" + k;
                fileNames[auxIndex] = fileName;
            }
        }
        return fileNames;
    }

    nextEaten() {
        this.isEaten = (this.isEaten + 1) % (CANDY_EXPLOSIONS_FRAMES + 1);
    }
}

export default Candy;