import Painter from './Painter.js';
import CandyBag from './CandyBag.js';
import GameHandling from './GameHandling.js';

let canvas, canvasContext;
let countingFramesFalling = 1;
let countingCandyWaves = 0;
let countingFramesGenerating = 1;
let painter = null;
let candyBag = null;
let gameHandler = null;
let translator = null;

//functions that change according to game state
let gameState = null;
let gameStateMouseUpdate = null;

//FRAMES_GENERATE_CANDIES needs to be bigger than FRAMES_MOVE_FALLING_CANDIES,
//so the candies fall faster than are being generated
const FRAMES_GENERATE_CANDIES = 140; 
const FRAMES_MOVE_FALLING_CANDIES = 70;
const FRAMES_PER_SECOND = 30;
const CANDY_WAVES = 6;

window.onload = function () {
    
    translator = new Gettext({"domain" : "en"});

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    painter = new Painter(canvasContext, document);

    //show message while we do image loading
    painter.colorRect(0, 0, canvas.width, canvas.height, 'black');
    painter.colorText(_("LOADING IMAGES"), canvas.width/2, canvas.height/2, 'red');
    
    //define function to be called after loading the images, the one that starts de game
    painter.imageLoader.onDoneLoading(startGame);
    painter.loadGameImages();

    candyBag = new CandyBag(painter);
    gameHandler = new GameHandling(painter);
    gameHandler.initializeLanguageSelector(translator.domain, 265, 25);
    gameHandler.initializeTasteSelector(50, 260);
    gameHandler.initializeStartGameButton(205, 450);
    gameHandler.initializeResetGameButton(53, 180);

    canvas.addEventListener('mouseup', mouseEvent);
    //document.addEventListener('keyup', pauseGame);
    gameState = startScreen;
    gameStateMouseUpdate = mouseEventStartGame;
}

function startGame() {
    //1000 = 1 sec in milisecs
    setInterval(tick, 1000/FRAMES_PER_SECOND);
}
function tick() {
    gameState();
}

function startScreen() {
    painter.drawBackground();
    gameHandler.drawTutorial(50, 100);
    gameHandler.drawColorSelector();
    gameHandler.drawLanguageSelector();
    if (gameHandler.currentFlavour != null) {
        gameHandler.drawStartGameButton();
    }
}

function endScreen() {
    painter.colorText(_("game"),137,100);
    painter.colorText(_("over"),137,140);
    gameHandler.drawResetGameButton();
}

function gameScreen() {
    if (countingFramesFalling == FRAMES_MOVE_FALLING_CANDIES) {
        candyBag.moveFallingCandies();
        countingFramesFalling = 1;
    } else {
        countingFramesFalling++;
    }

    if(countingCandyWaves < CANDY_WAVES) {
        if (countingFramesGenerating == FRAMES_GENERATE_CANDIES) {
            countingCandyWaves++;
            candyBag.generateCandies();
            countingFramesGenerating = 1;
        } else {
            countingFramesGenerating++;
        }
    }
    
    painter.drawBackground();
    gameHandler.drawLanguageSelector(260, 25);
    candyBag.drawCandyBag();
    gameHandler.drawFriendUI(290, 90);
}

function mouseEvent(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;

    gameStateMouseUpdate(mouseX, mouseY);
    
}

function mouseEventDuringGame(mouseX, mouseY) {
    let {eatenCount, eatenColor} = candyBag.processClickedBagPosition(mouseX, mouseY, gameHandler.friendFavCandy.candyColor);
    if ( eatenCount == 0) {
        let newLang = gameHandler.processClickedLanguages(mouseX, mouseY);
        if(newLang != null) {
            translator.domain = newLang;
        }
    } else {
        gameHandler.calculatePoints(eatenCount, eatenColor);
    }

    if(candyBag.remainingCandies == 0) {
        gameStateMouseUpdate = mouseEventEndGame;
        gameState = endScreen;
    }
}

function mouseEventEndGame(mouseX, mouseY) {
    if(gameHandler.resetButton.isWithin(mouseX, mouseY)) {
        countingFramesFalling = 1;
        countingCandyWaves = 0;
        countingFramesGenerating = 1;
        candyBag.reset();
        gameHandler.reset();
        gameStateMouseUpdate = mouseEventStartGame;
        gameState = startScreen;
    } else {
        let newLang = gameHandler.processClickedLanguages(mouseX, mouseY);
        if(newLang != null) {
            translator.domain = newLang;
        }
    }
}

function mouseEventStartGame(mouseX, mouseY) {
    let newLang = gameHandler.processClickedLanguages(mouseX, mouseY);
    if(newLang != null) {
        translator.domain = newLang;
    } else if (gameHandler.startButton.isWithin(mouseX, mouseY)) {
        candyBag.prefillCandybag();
        gameHandler.updatePlayerFavoriteCandy();
        gameHandler.generateRandomFriend();
        gameStateMouseUpdate = mouseEventDuringGame;
        gameState = gameScreen;
    } else {
        gameHandler.processClickedFlavors(mouseX, mouseY);
    }
}

//will return int between 0 and max-1
export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//shortcut function for translating
export function _(msgid) { 
    return translator.gettext(msgid); 
}
