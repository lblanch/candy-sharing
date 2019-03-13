//const FRIEND_STATUS = ["neutral", "happy", "joy", "surprise", "unhappy", "disgusted"];
const FRIEND_STATUS = ["neutral"];
const FOLDER_FRIEND = "friend/";

const UI_W = 5;

var friendFavCandy = "bean";
var friendFavColor = "red";

var playerFavCandy = "mm";
var playerFavColor = "green";

function drawFriendUI(x, y) {
    for (var col = 0; col < UI_W; col++) {
        for (var row = 0; row < 6; row++) {
            canvasContext.drawImage(tilePics[1], x + (col*CANDY_SIZE_W), y + (row*CANDY_SIZE_H));
        }
    }
    canvasContext.drawImage(friendPics[0], x+37, y+15);
    var auxIndex = CANDY_TYPES_ROWS.indexOf(friendFavCandy) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(friendFavColor);
    canvasContext.drawImage(candyPics[auxIndex], x+37, y+15+183+10);
}

function drawPlayerUI(x, y) {
    for (var col = 0; col < UI_W; col++) {
        for (var row = 0; row < 6; row++) {
            canvasContext.drawImage(tilePics[1], x + (col*CANDY_SIZE_W), y + (row*CANDY_SIZE_H));
        }
    }
    canvasContext.drawImage(friendPics[0], x+37, y+15);
    var auxIndex = CANDY_TYPES_ROWS.indexOf(friendFavCandy) * CANDY_COLORS_COLS.length + CANDY_COLORS_COLS.indexOf(friendFavColor);
    canvasContext.drawImage(candyPics[auxIndex], x+37, y+15+183+10);
}
