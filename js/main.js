import Painter from './Painter.js';
import CandyBag from './CandyBag.js';
import GameHandling from './GameHandling.js';

let canvas, canvasContext;
let countingFramesFalling = 1;
let countingFramesGenerating = 1;
let painter = null;
let candyBag = null;
let gameHandler = null;
let pauseVar = false;
let gameState = null;
let translator = null

//FRAMES_GENERATE_CANDIES needs to be bigger than FRAMES_MOVE_FALLING_CANDIES,
//so the candies fall faster than are being generated
const FRAMES_GENERATE_CANDIES = 140; 
const FRAMES_MOVE_FALLING_CANDIES = 70;
const FRAMES_PER_SECOND = 30;

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

    canvas.addEventListener('mouseup', updateMousePos);
    document.addEventListener('keyup', pauseGame);
    gameState = startScreen;
}

function startGame() {
    candyBag = new CandyBag(painter);
    candyBag.reset();

    gameHandler = new GameHandling(painter);
    gameHandler.generateRandomFriend();

    //1000 = 1 sec in milisecs
    setInterval(tick, 1000/FRAMES_PER_SECOND);
}

function tick() {
    gameState();
}

function startScreen() {
    painter.drawBackground();
    gameHandler.drawColorSelector(100, 100);
    //console.log(translator.domain);
    gameHandler.drawLanguageSelector(translator.domain, 500, 30);
}

function endScreen() {
        
}

function gameScreen() {
    if(!pauseVar) {
        if (countingFramesFalling == FRAMES_MOVE_FALLING_CANDIES) {
            candyBag.moveFallingCandies();
            countingFramesFalling = 1;
        } else {
            countingFramesFalling++;
        }
    
        if (countingFramesGenerating == FRAMES_GENERATE_CANDIES) {
            candyBag.generateCandies();
            countingFramesGenerating = 1;
        } else {
            countingFramesGenerating++;
        }
        painter.drawBackground();
        candyBag.drawCandyBag();
        gameHandler.drawFriendUI(300, 25);
    }
}

function updateMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    let {eatenCount, eatenColor} = candyBag.processClickedBagPosition(mouseX, mouseY, gameHandler.friendFavCandy.candyColor);
    gameHandler.calculatePoints(eatenCount, eatenColor);
}

function pauseGame(event) {
    if(event.keyCode == 32) {
        pauseVar = !pauseVar;
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
