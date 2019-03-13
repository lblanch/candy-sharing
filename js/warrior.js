const WALKING_SPEED = 0.2;

function warriorClass() {
    this.x = 0;
    this.y = 0;

    this.speedX = WORLD_W;
    this.speedY = WORLD_H;
    this.myWarriorPic;
    this.name = "Untitled warrior";
    this.amountKeys = 0;

    this.keyHeld_Up = false;
    this.keyHeld_Down = false;
    this.keyHeld_Left = false;
    this.keyHeld_Right = false;

    this.controlKeyUp;
    this.controlKeyRight;
    this.controlKeyDown;
    this.controlKeyLeft;

    this.setupInput = function(upKey, rightKey, downKey, leftKey) {
        this.controlKeyUp = upKey;
        this.controlKeyRight = rightKey;
        this.controlKeyDown = downKey;
        this.controlKeyLeft = leftKey;
    }
    this.draw = function() {
        canvasContext.drawImage(this.myWarriorPic, this.x, this.y);
    }

    this.reset = function(whichImage, warriorName) {
        this.speedX = 0;
        this.speedY = 0;

        this.name = warriorName;
        this.myWarriorPic = whichImage;
        for (var j = 0; j < WORLD_ROWS; j++) {
            for (var i = 0; i < WORLD_COLS; i++) {
                var arrayIndex = rowColToArrayIndex(i, j);
                if(worldGrid[arrayIndex] == WORLD_PLAYERSTART) {
                    worldGrid[arrayIndex] = 0;

                    this.x = i * WORLD_W;
                    this.y = j * WORLD_H;
                    return;
                }
            }
        }
        console.log ("NO PLAYER START FOUND!");
    }

    this.move = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        warriorWorldHandling(this);
    }
}
