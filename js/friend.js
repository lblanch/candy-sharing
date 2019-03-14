//const FRIEND_STATUS = ["neutral", "happy", "joy", "surprise", "unhappy", "disgusted"];
const FRIEND_STATUS = ["neutral"];
const FOLDER_FRIEND = "friend/";

const UI_W = 5;

class Friend {

    constructor(candy, color) {
        //this.friendFavCandy = "bean";
        //this.friendFavColor = "red";
        //this.playerFavCandy = "mm";
        //this.playerFavColor = "green";
        this.favoriteCandy = candy;
        this.favoriteColor = color;
    }
    
    drawFriendUI(x, y) {
        for (var col = 0; col < UI_W; col++) {
            for (var row = 0; row < 6; row++) {
                canvasContext.drawImage(tilePics[1], x + (col*CANDY_SIZE_W), y + (row*CANDY_SIZE_H));
            }
        }
        canvasContext.drawImage(friendPics[0], x+37, y+15);
        var auxIndex = CANDY_TYPES_ROWS.indexOf(friendFavCandy) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(friendFavColor);
        canvasContext.drawImage(candyPics[auxIndex], x+37, y+15+183+10);
    }

    drawPlayerUI(x, y) {
        for (var col = 0; col < UI_W; col++) {
            for (var row = 0; row < 6; row++) {
                canvasContext.drawImage(tilePics[1], x + (col*CANDY_SIZE_W), y + (row*CANDY_SIZE_H));
            }
        }
        canvasContext.drawImage(friendPics[0], x+37, y+15);
        var auxIndex = CANDY_TYPES_ROWS.indexOf(friendFavCandy) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(friendFavColor);
        canvasContext.drawImage(candyPics[auxIndex], x+37, y+15+183+10);
    }

    static generateFriendFilenames() {
        let fileNames = [];

        for(let i = 0; i < FRIEND_STATUS.length; i++) {
            fileNames.push(FOLDER_FRIEND + FRIEND_STATUS[i]);
        }

        return fileNames;
    }
}

export default Friend;

