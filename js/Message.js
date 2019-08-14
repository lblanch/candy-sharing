class Message {

    constructor(message, posX, posY, incrementX, incrementY, points) {
        this.frameCounter = 0;
        this.message = message;
        this.posX = posX;
        this.posY = posY;
        //increments for moving the message towards the points area
        this.incrementX = incrementX;
        this.incrementY = incrementY;
        this.points = points;
    }

    incrementPosition() {
        this.posX += this.incrementX;
        this.posY += this.incrementY;
    }
}

export default Message;