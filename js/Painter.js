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

    drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {
        this.canvasContext.save();
        this.canvasContext.translate(atX, atY);
        this.canvasContext.rotate(withAng);
        this.canvasContext.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
        this.canvasContext.restore();
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
