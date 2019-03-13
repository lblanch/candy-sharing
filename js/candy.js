const CANDY_TYPES_ROWS = ["bean", "jelly", "lollipop", "mm", "swirl", "wrappedsolid"];
const CANDY_COLORS_COLS = ["red", "yellow", "purple", "green", "blue"];
const CANDY_EXPLOSIONS_FRAMES = 4;
const FOLDER_CANDY = "candy/";
const FOLDER_EXPLOSIONS = "explosions/explosion_";

class candyClass {
    
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
    
  }
