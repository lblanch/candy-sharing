const FOLDER_IMAGES = "images/";
const IMAGE_EXTENSION = ".png";

class ImageLoader {
    
    constructor(document) {
        this.candyPics = []; 
        this.friendPics = [];
        this.tilePics = new Array(2);
        this.explosionPics = [];
        this.backgroundPic = document.createElement("img");
        this.picsToLoad = 0;
    }

    loadImages(candyAmount, friendAmount, explosionAmount) {
        let auxIndex = 0;
        let fileName = "";
        //last 3 = 2 tiles and 1 background image
        this.picsToLoad = candyAmount + friendAmount + explosionAmount + 3;
    
        this.tilePics[0] = document.createElement("img");
        beginLoadingImage(tilePics[0], FOLDER_IMAGES + "background/tile3.png");
        tilePics[1] = document.createElement("img");
        beginLoadingImage(tilePics[1], FOLDER_IMAGES + "background/tile4.png");
        beginLoadingImage(backgroundPic, FOLDER_IMAGES + "background/background_pastel.png");
    
        for(var i = 0; i < FRIEND_STATUS.length; i++) {
            fileName = FOLDER_IMAGES + FOLDER_FRIEND + FRIEND_STATUS[i] + IMAGE_EXTENSION;
            friendPics[i] = document.createElement("img");
            beginLoadingImage(friendPics[i], fileName);
        }
        for(var j = 0; j < CANDY_COLORS_COLS.length; j++) {
            for(var i = 0; i < CANDY_TYPES_ROWS.length; i++) {
                auxIndex = i*CANDY_COLORS_COLS.length + j; 
                fileName = FOLDER_IMAGES + FOLDER_CANDY + CANDY_TYPES_ROWS[i] + "_" + CANDY_COLORS_COLS[j] + IMAGE_EXTENSION;
                candyPics[auxIndex] = document.createElement("img");
                beginLoadingImage(candyPics[auxIndex], fileName);
            }
            for (var k = 1; k <= CANDY_EXPLOSIONS_FRAMES; k++) {
                auxIndex = j*CANDY_EXPLOSIONS_FRAMES + k;
                fileName = FOLDER_IMAGES + FOLDER_EXPLOSIONS + CANDY_COLORS_COLS[j] + "_" + k + IMAGE_EXTENSION;
                explosionPics[auxIndex] = document.createElement("img");
                beginLoadingImage(explosionPics[auxIndex], fileName);
            }
        }
    }
    
    countLoadedImagesAndLaunchIfReady() {
        this.picsToLoad--;
        if (this.picsToLoad == 0) {
            imageLoadingDoneSoStartGame();
        }
    }
    
    beginLoadingImage(imgVar, fileName) {
        imgVar.onload = countLoadedImagesAndLaunchIfReady();
        imgVar.src = fileName;
    }
}

export default ImageLoader;
