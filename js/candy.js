const CANDY_TYPES_ROWS = ["bean", "jelly", "lollipop", "mm", "swirl", "wrappedsolid"];
const CANDY_COLORS_COLS = ["red", "yellow", "purple", "green", "blue"];
const CANDY_EXPLOSIONS_FRAMES = 4;
const FOLDER_CANDY = "candy/";
const FOLDER_EXPLOSIONS = "explosions/explosion_";

class Candy {
    constructor(type, color, falling) {
        this.isMoved = false;
        this.candyType = type;
        this.candyColor = color;
        this.isFalling = falling;
        this.isEaten = 0;
        this.candyPicIndex = CANDY_TYPES_ROWS.indexOf(this.candyType) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(this.candyColor);
    }

    draw(x, y) {
        var exImg = candyPics[this.candyPicIndex]
        canvasContext.drawImage(exImg, x-((exImg.width-CANDY_SIZE_W)/2), y-((exImg.height-CANDY_SIZE_H)/2));
    }

    drawExplosion(x, y) {
        var exImg = explosionPics[CANDY_COLORS_COLS.indexOf(this.candyColor)*CANDY_EXPLOSIONS_FRAMES + this.isEaten];
        canvasContext.drawImage(exImg, x-((exImg.width-CANDY_SIZE_W)/2), y-((exImg.height-CANDY_SIZE_H)/2));
        this.isEaten = (this.isEaten + 1) % (CANDY_EXPLOSIONS_FRAMES + 1);
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
                //console.log("added CANDY: " + fileName + " at position " + auxIndex);
            }
            for (let k = 1; k <= CANDY_EXPLOSIONS_FRAMES; k++) {
                auxIndex = (j*CANDY_EXPLOSIONS_FRAMES + k) + (CANDY_COLORS_COLS.length * CANDY_TYPES_ROWS.length) - 1;
                fileName = FOLDER_EXPLOSIONS + CANDY_COLORS_COLS[j] + "_" + k;
                fileNames[auxIndex] = fileName;
                //console.log("added EXPLOSION: " + fileName + " at position " + auxIndex);
            }
        }
        return fileNames;
    }
}

export default Candy;