import Wizard from '/js/imageLoading';

let canvas, canvasContext;
let countingFramesFalling = 1;
let countingFramesGenerating = 1;
let totalPoints = 0;

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

    //show message while we wait to go image loading
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'black');

    loadImages((CANDY_TYPES_ROWS.length * CANDY_COLORS_COLS.length), FRIEND_STATUS.length, (CANDY_COLORS_COLS.length * CANDY_EXPLOSIONS_FRAMES));
}

function imageLoadingDoneSoStartGame() {
    //1000 = 1 sec in milisecs
    setInterval(updateAll, 1000/FRAMES_PER_SECOND);

    setupInput();

    //candyBag.reset() use this in future if there's more than
    candyBag.fill(null);

    //colorRect(0, 0, canvas.width, canvas.height, 'white');
    /*generateCandies();
    colorRect(0, 0, canvas.width, canvas.height, 'blue');
    drawCandyBag(false);
    drawFriend();*/
}

function updateAll() {
    var fallingTime = false;

    if (countingFramesFalling == FRAMES_MOVE_FALLING_CANDIES) {
        fallingTime = true;
        countingFramesFalling = 1;
        /*for (var col = 0; col < CANDY_BAG_COLS; col++) {
            console.log("col no: " + col + " empty space in index: " + lowestFreeSpace[col]);
        }*/
    } else {
        countingFramesFalling++;
    }
    if (countingFramesGenerating == FRAMES_GENERATE_CANDIES) {
        generateCandies();
        countingFramesGenerating = 1;
    } else {
        countingFramesGenerating++;
    }
    canvasContext.drawImage(backgroundPic, 0, 0);
    drawCandyBag(fallingTime);
    drawFriendUI(300, 25);
}

//will return int between 0 and max-1
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
