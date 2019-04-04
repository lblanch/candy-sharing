import { TILE_SIZE_W, TILE_SIZE_H } from "./Painter.js";
import Candy from "./Candy.js";

//const FRIEND_STATUS = ["neutral", "happy", "joy", "surprise", "unhappy", "disgusted"];
const FRIEND_STATUS = ["neutral"];
const FOLDER_FRIEND = "friend/";
//UI sizes in tiles
const UI_FRIEND_H = 6;
const UI_PLAYER_H = 5;
const UI_W = 5;
const UI_SEPARATION = 2;
const SAME_CANDY_POINTS = 15;
const SAME_COLOR_POINTS = 15;
const OTHER_CANDY_POINTS = 5;

class GameHandling {

    constructor(painter) {
        this.friendFavCandy = null;
        this.playerFavCandy = new Candy();
        this.friendFavCandyCount = 0;
        this.playerFavCandyCount = 0;
        //this.playerFavCandy = null;
        this.friendMoodPoints = 50;
        this.playerPoints = 0;
        this.painter = painter;
    }

    generateRandomFriend() {
        //chose random candy/color for friend, make sure it's different from player's
        this.friendFavCandy = new Candy();
        if (this.friendFavCandy.candyColor == this.playerFavCandy.candyColor) {
            this.friendFavCandy.randomizeColor(this.playerFavCandy.candyColor);
        }
        if (this.friendFavCandy.candyType == this.playerFavCandy.candyType) {
            this.friendFavCandy.randomizeCandy(this.playerFavCandy.candyType);
        }
        this.friendFavCandy.isFalling = false;
    }
    
    drawFriendUI(x, y) {
        for (let col = 0; col < UI_W; col++) {
            for (let row = 0; row < Math.max(UI_FRIEND_H, UI_PLAYER_H); row++) {
                this.painter.drawTile(1, x + (col*TILE_SIZE_W), y + (row*TILE_SIZE_H));
                if (row < UI_PLAYER_H) {
                    this.painter.drawTile(0, x + (col*TILE_SIZE_W), y + ((UI_PLAYER_H + UI_SEPARATION + row)*TILE_SIZE_H));
                }
            }
        }

        this.painter.drawFriend(0, x+37, y+15);
        this.painter.drawCandy(this.friendFavCandy, x+37, y+15+183+10);
        this.painter.colorText(" x " + this.friendFavCandyCount, x+37+45, y+15+183+10+32)
    }

    calculatePoints(eatenCount, eatenColor) {

        if (eatenColor == this.playerFavCandy.candyColor) {
            this.playerFavCandyCount += eatenCount;
            this.playerPoints += eatenCount * SAME_COLOR_POINTS;
        }
        else { 
            this.playerPoints += eatenCount * OTHER_CANDY_POINTS;
            if (eatenColor == this.friendFavCandy.candyColor) {
                this.friendFavCandyCount += eatenCount;
            } 
        }
    }

    static generateFriendFilenames() {
        let fileNames = [];

        for(let i = 0; i < FRIEND_STATUS.length; i++) {
            fileNames.push(FOLDER_FRIEND + FRIEND_STATUS[i]);
        }

        return fileNames;
    }
}

export default GameHandling;

