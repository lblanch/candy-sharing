const WORLD_W = 40;
const WORLD_H = 40;
const WORLD_GAP = 2;
const WORLD_COLS = 17;
const WORLD_ROWS = 12;

const WORLD_ROAD = 0;
const WORLD_WALL = 1;
const WORLD_PLAYERSTART = 2;
const WORLD_KEY = 3;
const WORLD_DOOR = 4;
const WORLD_PRIZE = 5;

var levelOne = [    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 1, 1, 1, 1, 1,
                    1, 0, 3, 0, 3, 0, 1, 0, 0, 0, 1, 0, 1, 0, 3, 3, 1,
                    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 4, 1, 4, 1, 1, 1,
                    1, 1, 1, 4, 1, 1, 1, 0, 3, 0, 1, 0, 0, 0, 1, 1, 1,
                    1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 3, 0, 1, 1, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1,
                    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0, 1, 1, 1,
                    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1,
                    1, 0, 4, 0, 4, 0, 4, 0, 5, 0, 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var worldGrid = [];

function rowColToArrayIndex(col, row) {
    return col + WORLD_COLS * row;
}

function returnTileTypeAtRowCol(col, row) {
    if (col >= 0 && col < WORLD_COLS && row >= 0 && row < WORLD_ROWS) {
        var worldIndexUnderCoord = rowColToArrayIndex(col, row);
        return worldGrid[worldIndexUnderCoord];
    } else {
        return WORLD_WALL;
    }
}

function warriorWorldHandling(whichWarrior) {
    var warriorWorldCol = Math.floor((whichWarrior.x + (whichWarrior.myWarriorPic.width/2)) / WORLD_W);
    var warriorWorldRow = Math.floor((whichWarrior.y + (whichWarrior.myWarriorPic.height/2)) / WORLD_H);

    if(warriorWorldCol >=0 && warriorWorldCol < WORLD_COLS && warriorWorldRow >=0 && warriorWorldRow < WORLD_ROWS) {
        var tileHere = returnTileTypeAtRowCol(warriorWorldCol, warriorWorldRow);
        switch(tileHere) {
            case WORLD_PRIZE:
                console.log(whichWarrior.name+" wins!");
                loadLevel(levelOne);
                break;
            case WORLD_DOOR:
                if(whichWarrior.amountKeys != 0) {
                    worldGrid[rowColToArrayIndex(warriorWorldCol, warriorWorldRow)] = 0;
                    whichWarrior.amountKeys--;
                    break;
                }
            case WORLD_WALL:
                //take step back so we don't get stuck in a wall or something
                whichWarrior.x -= whichWarrior.speedX;
                whichWarrior.y -= whichWarrior.speedY;
                whichWarrior.speedX = 0;
                whichWarrior.speedY = 0;
                break;
            case WORLD_KEY:
                worldGrid[rowColToArrayIndex(warriorWorldCol, warriorWorldRow)] = 0;
                whichWarrior.amountKeys++;
                break;
        }
    }
}

function drawWorlds() {
    var arrayIndex = 0;
    var drawTileX = 0;
    var drawTileY = 0;
    for (var j = 0; j < WORLD_ROWS; j++) {
        for (var i = 0; i < WORLD_COLS; i++) {
            var tileKindHere = worldGrid[arrayIndex];
            var useImg = worldPics[tileKindHere];
            
            if (tileKindHere != WORLD_WALL && tileKindHere != WORLD_ROAD) {
                //draw road tile under tiles with transparency
                canvasContext.drawImage(worldPics[WORLD_ROAD], drawTileX, drawTileY);    
            }

            canvasContext.drawImage(useImg, drawTileX, drawTileY);
            drawTileX += WORLD_H;
            arrayIndex++;
        }
        drawTileX = 0;
        drawTileY += WORLD_W;
    }
    
}