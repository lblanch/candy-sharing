import { TILE_SIZE_W, TILE_SIZE_H } from "./Painter.js";
import {CANDY_TYPES_ROWS, CANDY_COLORS_COLS} from "./Candy.js";
import Candy from "./Candy.js";
import Button from "./Button.js";

//const FRIEND_STATUS = ["neutral", "happy", "joy", "surprise", "unhappy", "disgusted"];
const FRIEND_STATUS = ["neutral"];
const FOLDER_FRIEND = "friend/";

const SUPPORTED_LANGUAGES_CODES = ['ca_ES', 'en', 'es_ES'];
const SUPPORTED_LANGUAGES_NAMES = ['Català', 'English', 'Castellano'];
let SUPPORTED_LANGUAGES = Array();


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

    drawColorSelector(x, y) {
        let auxCandy = null;

        for (let flavors = 0; flavors < CANDY_COLORS_COLS.length; flavors++) {
            auxCandy = new Candy(CANDY_TYPES_ROWS[flavors], CANDY_COLORS_COLS[flavors], false);
            this.painter.drawTile(0, x + (2*TILE_SIZE_W*(flavors)), y);
            this.painter.drawTile(0, x + (2*TILE_SIZE_W*(flavors)), y + TILE_SIZE_H);
            this.painter.drawTile(0, x + (2*TILE_SIZE_W*(flavors)), y + (2*TILE_SIZE_H));
            this.painter.drawTile(0, x + (2*TILE_SIZE_W*(flavors)) + TILE_SIZE_W, y);
            this.painter.drawTile(0, x + (2*TILE_SIZE_W*(flavors)) + TILE_SIZE_W, y + TILE_SIZE_H);
            this.painter.drawTile(0, x + (2*TILE_SIZE_W*(flavors)) + TILE_SIZE_W, y + (2*TILE_SIZE_H));
            this.painter.drawCandy(auxCandy, (x+(TILE_SIZE_W/2)+(2*TILE_SIZE_W * flavors)), y+(TILE_SIZE_H/2));
            this.painter.colorText(auxCandy.candyColorsTranslated[flavors], x + (2*TILE_SIZE_W*flavors) + TILE_SIZE_W, y + (2.5*TILE_SIZE_H), undefined, "15px");
        }
    }

    initializeLanguageSelector(currentLang, x = 100, y = 100) {
        let auxButton;

        for (let lang = 0; lang < SUPPORTED_LANGUAGES_NAMES.length; lang++) {
            auxButton = new Button(x + (2*TILE_SIZE_W*lang), y, TILE_SIZE_W*2, TILE_SIZE_H);
            auxButton.langCode = SUPPORTED_LANGUAGES_CODES[lang];
            auxButton.langName = SUPPORTED_LANGUAGES_NAMES[lang];
            
            if (auxButton.langCode == currentLang) {
                auxButton.current = true;
            } else {
                auxButton.current = false;
            }
            SUPPORTED_LANGUAGES.push(auxButton);
        }
    }

    processClickedLanguages(mouseX, mouseY) {
        let selectedLang = null;
        if(SUPPORTED_LANGUAGES[0].posX <= mouseX && (SUPPORTED_LANGUAGES[SUPPORTED_LANGUAGES.length-1].posX + SUPPORTED_LANGUAGES[SUPPORTED_LANGUAGES.length-1].width) > mouseX) {
            if(SUPPORTED_LANGUAGES[0].posY <= mouseY && (SUPPORTED_LANGUAGES[0].posY + SUPPORTED_LANGUAGES[0].height) > mouseY) {
                console.log("hola");
                for(let lang = 0; lang < SUPPORTED_LANGUAGES.length; lang++) {
                    SUPPORTED_LANGUAGES[lang].current = false;
                    if(SUPPORTED_LANGUAGES[lang].isWithin(mouseX, mouseY)) {
                        SUPPORTED_LANGUAGES[lang].current = true;
                        selectedLang = SUPPORTED_LANGUAGES[lang].langCode;
                    }
                }
            }
        }
        return selectedLang;
    }

    drawLanguageSelector() {
        let underline = false;

        for (let lang = 0; lang < SUPPORTED_LANGUAGES.length; lang++) {

            this.painter.drawTile(0, SUPPORTED_LANGUAGES[lang].posX, SUPPORTED_LANGUAGES[lang].posY);
            this.painter.drawTile(0, SUPPORTED_LANGUAGES[lang].posX + TILE_SIZE_W, SUPPORTED_LANGUAGES[lang].posY);
            
            if (SUPPORTED_LANGUAGES[lang].current) {
                underline = true;
            } else {
                underline = false;
            }
            this.painter.colorText(SUPPORTED_LANGUAGES_NAMES[lang], SUPPORTED_LANGUAGES[lang].posX + TILE_SIZE_W, SUPPORTED_LANGUAGES[lang].posY + (0.5*TILE_SIZE_H)+2, undefined, "15px", underline);
        }
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

