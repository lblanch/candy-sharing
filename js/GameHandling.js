import { TILE_SIZE_W, TILE_SIZE_H } from "./Painter.js";
import {CANDY_TYPES_ROWS, CANDY_COLORS_COLS} from "./Candy.js";
import Candy from "./Candy.js";
import Button from "./Button.js";
import { _ } from "./main.js";

//const FRIEND_STATUS = ["neutral", "happy", "joy", "surprise", "unhappy", "disgusted"];
const FRIEND_STATUS = ["neutral"];
const FOLDER_FRIEND = "friend/";

//When adding new languages or modifying the order, do it in BOTH arrays!
const SUPPORTED_LANGUAGES_CODES = ['ca_ES', 'es_ES', 'en'];
const SUPPORTED_LANGUAGES_NAMES = ['Català', 'Castellano', 'English'];

//UI sizes in tiles
const UI_FRIEND_H = 6;
const UI_PLAYER_H = 4;
const UI_W = 5;
const UI_SEPARATION = 0.5;
const SAME_CANDY_POINTS = 15;
const SAME_COLOR_POINTS = 15;
const OTHER_CANDY_POINTS = 5;

class GameHandling {

    constructor(painter) {
        this.friendFavCandy = null;
        this.playerFavCandy = new Candy(undefined, undefined, false);
        this.friendFavCandyCount = 0;
        this.playerFavCandyCount = 0;
        this.friendMoodPoints = 50;
        this.playerPoints = 0;
        this.painter = painter;
        this.currentLanguage = null;
        this.currentFlavour = null;
        this.supportedLanguages = Array();
        this.flavorButtons = Array();
        this.startButton = null;
    }

    generateRandomFriend() {
        //chose random candy/color for friend, make sure it's different from player's
        this.friendFavCandy = new Candy();
        if (this.friendFavCandy.candyColor == this.playerFavCandy.candyColor) {
            this.friendFavCandy.randomizeColor(this.playerFavCandy.candyColor);
        }
        
        this.friendFavCandy.isFalling = false;
    }
    
    updatePlayerFavoriteCandy() {
        console.log("prev " + this.playerFavCandy.candyColor + " current " + CANDY_COLORS_COLS[this.currentFlavour]);
        this.playerFavCandy.candyColor = CANDY_COLORS_COLS[this.currentFlavour];
        console.log("prev " + this.playerFavCandy.candyColor + " current " + CANDY_COLORS_COLS[this.currentFlavour]);
        this.currentFlavour = null;
    }

    drawFriendUI(x, y) {
        for (let col = 0; col < UI_W; col++) {
            for (let row = 0; row < Math.max(UI_FRIEND_H, UI_PLAYER_H); row++) {
                this.painter.drawTile(1, x + (col*TILE_SIZE_W), y + (row*TILE_SIZE_H));
                if (row < UI_PLAYER_H) {
                    this.painter.drawTile(0, x + (col*TILE_SIZE_W), y + ((UI_FRIEND_H + UI_SEPARATION + row)*TILE_SIZE_H));
                }
            }
        }
        let separation = (UI_FRIEND_H + UI_SEPARATION) * TILE_SIZE_H;
        this.painter.drawFriend(0, x+37, y+15);
        this.painter.drawCandy(this.friendFavCandy, x+37, y+208);
        this.painter.colorText(" x " + this.friendFavCandyCount, x+130, y+240);
        this.painter.drawCandy(this.playerFavCandy, x+37, y+separation+15);
        this.painter.colorText(" x " + this.playerFavCandyCount, x+130, y+separation+50);
        this.painter.colorText(this.playerPoints, x+((TILE_SIZE_W*UI_W)/2), y+separation+120);
        this.painter.colorText(_("points"), x+((TILE_SIZE_W*UI_W)/2), y+separation+160);
    }

    initializeTasteSelector(x = 100, y = 100) {
        let auxButton;

        for (let flavors = 0; flavors < CANDY_COLORS_COLS.length; flavors++) {
            auxButton = new Button(x + (2*TILE_SIZE_W*(flavors)), y, TILE_SIZE_W*2, TILE_SIZE_H*3);
            this.flavorButtons.push(auxButton);
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
                this.currentLanguage = lang;
            } else {
                auxButton.current = false;
            }
            this.supportedLanguages.push(auxButton);
        }
    }

    initializeStartGameButton(x, y) {
        this.startButton = new Button(x, y, TILE_SIZE_W*3, TILE_SIZE_H);
    }

    processClickedFlavors(mouseX, mouseY) {
        if(this.flavorButtons[0].posX <= mouseX && (this.flavorButtons[this.flavorButtons.length-1].posX + this.flavorButtons[this.flavorButtons.length-1].width) > mouseX) {
            if(this.flavorButtons[0].posY <= mouseY && (this.flavorButtons[0].posY + this.flavorButtons[0].height) > mouseY) {
                for(let lang = 0; lang < this.flavorButtons.length; lang++) {
                    if(this.flavorButtons[lang].isWithin(mouseX, mouseY)) {
                        if(this.flavorButtons[lang].selected) {
                            this.flavorButtons[lang].selected = false;
                            this.currentFlavour = null;
                        } else {
                            if(this.currentFlavour != null) {
                                this.flavorButtons[this.currentFlavour].selected = false;
                            }
                            this.flavorButtons[lang].selected = true;
                            this.currentFlavour = lang;
                        }
                        return;
                    }
                }
            }
        }
    }

    processClickedLanguages(mouseX, mouseY) {
        let selectedLang = null;
        if(this.supportedLanguages[0].posX <= mouseX && (this.supportedLanguages[this.supportedLanguages.length-1].posX + this.supportedLanguages[this.supportedLanguages.length-1].width) > mouseX) {
            if(this.supportedLanguages[0].posY <= mouseY && (this.supportedLanguages[0].posY + this.supportedLanguages[0].height) > mouseY) {
                this.supportedLanguages[this.currentLanguage].current = false;
                for(let lang = 0; lang < this.supportedLanguages.length; lang++) {
                    if(this.supportedLanguages[lang].isWithin(mouseX, mouseY)) {
                        this.supportedLanguages[lang].current = true;
                        this.currentLanguage = lang;
                        selectedLang = this.supportedLanguages[lang].langCode;
                        return selectedLang;
                    }
                }
            }
        }
        return selectedLang;
    }

    drawStartGameButton(startText) {
        this.painter.drawTile(0, this.startButton.posX, this.startButton.posY);
        this.painter.drawTile(0, this.startButton.posX + TILE_SIZE_W, this.startButton.posY);
        this.painter.drawTile(0, this.startButton.posX + 2*TILE_SIZE_W, this.startButton.posY);
        
        this.painter.colorText(startText, this.startButton.posX + (1.5*TILE_SIZE_W), this.startButton.posY + (0.5*TILE_SIZE_H)+2, undefined, "15px");   
    }

    drawLanguageSelector() {
        let underline = false;
        let tileType = 0;

        for (let lang = 0; lang < this.supportedLanguages.length; lang++) {
            if (this.supportedLanguages[lang].current) {
                underline = true;
                tileType = 1;
            } else {
                underline = false;
                tileType = 0;
            }
            this.painter.drawTile(tileType, this.supportedLanguages[lang].posX, this.supportedLanguages[lang].posY);
            this.painter.drawTile(tileType, this.supportedLanguages[lang].posX + TILE_SIZE_W, this.supportedLanguages[lang].posY);
            this.painter.colorText(SUPPORTED_LANGUAGES_NAMES[lang], this.supportedLanguages[lang].posX + TILE_SIZE_W, this.supportedLanguages[lang].posY + (0.5*TILE_SIZE_H)+2, undefined, "15px", underline);
        }
    }

    drawColorSelector() {
        let auxCandy = null;
        let underline = false;
        let tileType = 0;

        for (let flavors = 0; flavors < this.flavorButtons.length; flavors++) {
            auxCandy = new Candy(CANDY_TYPES_ROWS[flavors], CANDY_COLORS_COLS[flavors], false);
            if (this.flavorButtons[flavors].selected) {
                tileType = 1;
                underline = true;
            } else {
                underline = false;
                tileType = 0;
            }
            this.painter.drawTile(tileType, this.flavorButtons[flavors].posX, this.flavorButtons[flavors].posY);
            this.painter.drawTile(tileType, this.flavorButtons[flavors].posX, this.flavorButtons[flavors].posY + TILE_SIZE_H);
            this.painter.drawTile(tileType, this.flavorButtons[flavors].posX, this.flavorButtons[flavors].posY + (2*TILE_SIZE_H));
            this.painter.drawTile(tileType, this.flavorButtons[flavors].posX + TILE_SIZE_W, this.flavorButtons[flavors].posY);
            this.painter.drawTile(tileType, this.flavorButtons[flavors].posX + TILE_SIZE_W, this.flavorButtons[flavors].posY + TILE_SIZE_H);
            this.painter.drawTile(tileType, this.flavorButtons[flavors].posX + TILE_SIZE_W, this.flavorButtons[flavors].posY + (2*TILE_SIZE_H));
            this.painter.drawCandy(auxCandy, this.flavorButtons[flavors].posX+(TILE_SIZE_W/2), this.flavorButtons[flavors].posY+(TILE_SIZE_H/2));
            this.painter.colorText(auxCandy.candyColorsTranslated[flavors], this.flavorButtons[flavors].posX + TILE_SIZE_W, this.flavorButtons[flavors].posY + (2.5*TILE_SIZE_H), undefined, "15px", underline);
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

