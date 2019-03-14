import ImageLoader from "./ImageLoader.js";
import Candy from "./Candy.js";
import Friend from "./Friend.js";

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
        this.friendOffset = this.imageLoader.addArrayToQueue(Friend.generateFriendFilenames())
        this.imageLoader.loadImagesFromQueue();
    }

    drawBackground() {
        this.canvasContext.drawImage(this.imageLoader.pics[this.backgroundIndex], 0, 0);
    }

    drawTile(tile, drawAtX, drawAtY) {
        this.canvasContext.drawImage(this.imageLoader.pics[this.tileOffset + tile], drawAtX, drawAtY);
    }
    
    drawCandy(auxCandy, x, y, w, h) {
        let exImg = this.imageLoader.pics[auxCandy.candyPicIndex + this.candiesOffset];
        this.canvasContext.drawImage(exImg, x-((exImg.width-w)/2), y-((exImg.height-h)/2));
    }

    drawExplosion(auxCandy, x, y, w, h) {
        let exImg = this.imageLoader.pics[auxCandy.explosionPicIndex + auxCandy.isEaten + this.candiesOffset];
        this.canvasContext.drawImage(exImg, x-((exImg.width-w)/2), y-((exImg.height-h)/2));
        auxCandy.nextEaten();
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
    colorText(showWords, textX, textY, fillColor) {
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.fillText(showWords, textX, textY);
    }
}

export default Painter;
