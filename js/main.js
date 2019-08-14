import Painter from './Painter.js';
import CandyBag from './CandyBag.js';
import GameHandling from './GameHandling.js';
import i18n from '../lib/gettext.esm.js';

let canvas, canvasContext;
let countingFramesFalling = 1;
let countingFramesGenerating = 1;
let countingSeconds = 1;
let painter = null;
let candyBag = null;
let gameHandler = null;
let translator = null;
let timer = 0;


//functions that change according to game state
let gameState = null;
let gameStateMouseUpdate = null;

//FRAMES_GENERATE_CANDIES needs to be bigger than FRAMES_MOVE_FALLING_CANDIES,
//so the candies fall faster than are being generated
const FRAMES_GENERATE_CANDIES = 70; 
const FRAMES_MOVE_FALLING_CANDIES = 35;
const FRAMES_PER_SECOND = 30;

//5 min = 300 sec
const TIMER_SEC = 60;

window.onload = function () {
    
    translator = new i18n();
    //translator.setLocale('es_ES');
    
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    painter = new Painter(canvasContext, document);

    //show message while we do image and language loading
    painter.colorRect(0, 0, canvas.width, canvas.height, 'black');
    painter.colorText(_("LOADING"), canvas.width/2, canvas.height/2, 'red');
    
    //load default language's JSON
    loadJSON('lang/' + translator.getLocale() + '.json', function(response) {
        translator.loadJSON(response);
    });

    //define function to be called after loading the images, the one that starts de game
    painter.imageLoader.onDoneLoading(startGame);
    painter.loadGameImages();

    candyBag = new CandyBag(painter);
    gameHandler = new GameHandling(painter);
    gameHandler.initializeLanguageSelector(translator.getLocale(), 265, 25);
    gameHandler.initializeTasteSelector(50, 260);
    gameHandler.initializeStartGameButton(205, 450);
    gameHandler.initializeResetGameButton(53, 180);

    //listen for mouse clicks
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
    //time is over, there's no candies left in the cady bag and no point messages to be shown => end game
    if(timer == 0) {
        if (candyBag.remainingCandies == 0 && gameHandler.inGameMessages.length == 0) {
            gameStateMouseUpdate = mouseEventEndGame;
            gameState = endScreen;
        }
    } else {
        //only generate candies when there is still time on the timer
        if (countingFramesGenerating == FRAMES_GENERATE_CANDIES) {
            candyBag.generateCandies();
            countingFramesGenerating = 1;
        } else {
            countingFramesGenerating++;
        }
    }

    if(countingSeconds == FRAMES_PER_SECOND) {
        if (timer > 0) {
            countingSeconds = 0;
            timer--;
        }
    }

    if (countingFramesFalling == FRAMES_MOVE_FALLING_CANDIES) {
        candyBag.moveFallingCandies();
        countingFramesFalling = 1;
    } else {
        countingFramesFalling++;
    }

    countingSeconds++;
    painter.drawBackground();
    gameHandler.drawLanguageSelector();
    candyBag.drawCandyBag();
    gameHandler.drawTimer(timer, 138, 20);
    gameHandler.drawFriendUI();
    gameHandler.drawInGameMessages();
}

function mouseEvent(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;

    gameStateMouseUpdate(mouseX, mouseY);
    
}

function mouseEventDuringGame(mouseX, mouseY) {
    let {eatenCount, eatenColor} = candyBag.processClickedBagPosition(mouseX, mouseY);
    let points = 0;
    let pointsMessage = "+";

    if (eatenCount == 0) {
        processLanguageChange(gameHandler.processClickedLanguages(mouseX, mouseY));
    } else {
        points = gameHandler.calculatePoints(eatenCount, eatenColor);
        pointsMessage += points + "!";
        gameHandler.addInGameMessage(pointsMessage, mouseX, mouseY, points);
        if (eatenCount > 3) {
            pointsMessage = eatenCount+"x COMBO!";
            gameHandler.addInGameMessage(pointsMessage, mouseX, mouseY+30, points);
        }
    }
}

function mouseEventEndGame(mouseX, mouseY) {
    if(gameHandler.resetButton.isWithin(mouseX, mouseY)) {
        //reset the game and get back to start screen
        countingSeconds = 0;
        countingFramesFalling = 1;
        countingFramesGenerating = 1;
        candyBag.reset();
        gameHandler.reset();
        gameStateMouseUpdate = mouseEventStartGame;
        gameState = startScreen;
    } else {
        processLanguageChange(gameHandler.processClickedLanguages(mouseX, mouseY));
    }
}

function mouseEventStartGame(mouseX, mouseY) {
    if (!processLanguageChange(gameHandler.processClickedLanguages(mouseX, mouseY))) {
        if (gameHandler.startButton.isWithin(mouseX, mouseY)) {
            candyBag.prefillCandybag();
            gameHandler.updatePlayerFavoriteCandy();
            gameHandler.generateRandomFriend();
            gameStateMouseUpdate = mouseEventDuringGame;
            gameState = gameScreen;
            timer = TIMER_SEC;
        } else {
            gameHandler.processClickedFlavors(mouseX, mouseY);
        }
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

//function to load a new language
function loadJSON(langJsonFile, callback) {   
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', langJsonFile, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && (xobj.status == "200" || xobj.status == "304")) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function processLanguageChange(newLang) {
    if(newLang != null) {
        if(!translator.isJSONLoaded(newLang)) {
            loadJSON('lang/' + newLang + '.json', function(response) {
                translator.loadJSON(response);
                translator.setLocale(newLang);
            });
        } else {
            translator.setLocale(newLang);
        }
        return true;
    } 
    return false;
}