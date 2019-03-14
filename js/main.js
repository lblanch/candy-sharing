import Painter from './Painter.js';
import CandyBag from './CandyBag.js';

let canvas, canvasContext;
let countingFramesFalling = 1;
let countingFramesGenerating = 1;
let totalPoints = 0;
let painter = null;
let candyBag = null;

const SAME_CANDY_POINTS = 15;
const SAME_COLOR_POINTS = 15;
const OTHER_CANDY_POINTS = 5;
const FRAMES_PER_SECOND = 30;
//FRAMES_GENERATE_CANDIES needs to be bigger than FRAMES_MOVE_FALLING_CANDIES,
//so the candies fall faster than are being generated
const FRAMES_GENERATE_CANDIES = 140; 
const FRAMES_MOVE_FALLING_CANDIES = 70;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    //this is the graphics buffer, where we can draw stuff
    canvasContext = canvas.getContext('2d');

    painter = new Painter(canvasContext, document);

    //show message while we wait to go image loading
    painter.colorRect(0, 0, canvas.width, canvas.height, 'black');
    painter.colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'red');
    
    //define function to be called after loading the images, the one that starts de game
    painter.imageLoader.onDoneLoading(startGame);
    painter.loadGameImages();
}

function startGame() {
    //1000 = 1 sec in milisecs
    setInterval(tick, 1000/FRAMES_PER_SECOND);

    //setupInput();

    candyBag = new CandyBag(painter);
    candyBag.reset();
    //candyBag.generateCandies();
    //candyBag.fill(null);

    //colorRect(0, 0, canvas.width, canvas.height, 'white');
    //generateCandies();
    //colorRect(0, 0, canvas.width, canvas.height, 'blue');
    //drawCandyBag(false);
    //drawFriend();
}

function tick() {
    let fallingTime = false;

    if (countingFramesFalling == FRAMES_MOVE_FALLING_CANDIES) {
        fallingTime = true;
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
    candyBag.drawCandyBag(fallingTime);
    //painter.drawFriendUI(300, 25);
}

//will return int between 0 and max-1
export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

