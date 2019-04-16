import ImageLoader from "./ImageLoader.js";
import Candy from "./Candy.js";
import GameHandling from "./GameHandling.js";
import { getRandomInt } from "./main.js";

export const TILE_SIZE_W = 45;
export const TILE_SIZE_H = 45;

class Painter {

    constructor(canvasContext, document) {
        this.canvasContext = canvasContext;
        this.docHTML = document;
        this.imageLoader = new ImageLoader(this.docHTML);
        this.tileOffset = 0;
        this.backgroundIndex = 0;
        this.candiesOffset = 0;
        this.friendOffset = 0;
    }

    loadGameImages() {
        this.tileOffset = this.imageLoader.addToQueue("background/tile4");
        this.imageLoader.addToQueue("background/tile3");
        this.backgroundIndex = this.imageLoader.addToQueue("background/background_pastel");
        this.candiesOffset = this.imageLoader.addArrayToQueue(Candy.generateCandyFilenames());
        this.friendOffset = this.imageLoader.addArrayToQueue(GameHandling.generateFriendFilenames())
        this.imageLoader.loadImagesFromQueue();
    }

    drawBackground() {
        this.canvasContext.drawImage(this.imageLoader.pics[this.backgroundIndex], 0, 0);
    }

    drawTile(tile, drawAtX, drawAtY) {
        this.canvasContext.drawImage(this.imageLoader.pics[this.tileOffset + tile], drawAtX, drawAtY);
    }
    
    drawCandy(auxCandy, x, y) {
        let exImg = this.imageLoader.pics[auxCandy.candyPicIndex + this.candiesOffset];
        if (auxCandy.isFalling) {
            x += getRandomInt(3);
            y += getRandomInt(3);
        }
        this.canvasContext.drawImage(exImg, x-((exImg.width-TILE_SIZE_W)/2), y-((exImg.height-TILE_SIZE_H)/2));
    }

    drawExplosion(auxCandy, x, y) {
        let exImg = this.imageLoader.pics[auxCandy.explosionPicIndex + auxCandy.isEaten + this.candiesOffset];
        this.canvasContext.drawImage(exImg, x-((exImg.width-TILE_SIZE_W)/2), y-((exImg.height-TILE_SIZE_H)/2));
        auxCandy.nextEaten();
    }

    drawFriend(friendIndex, x, y) {
        this.canvasContext.drawImage(this.imageLoader.pics[this.friendOffset + friendIndex], x, y);
    }

    colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    }
    
    colorCircle(centerX, centerY, radius, fillColor) {
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
        this.canvasContext.fill();
    }
    colorText(showWords, textX, textY, fillColor = '#64bcf9', size = "40px", underline = false) {
        this.canvasContext.font = size + ' courier';
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.textAlign = "center"; 
        this.canvasContext.fillText(showWords, textX, textY);
        if (underline) {
            let text = this.canvasContext.measureText(showWords);
            this.canvasContext.fillRect(textX-(text.width/2), textY + 3, text.width, 2);
        }    
    }
}

export default Painter;
