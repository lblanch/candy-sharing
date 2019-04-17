class Button {
    constructor(posX, posY, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
    }

    isWithin(x, y) {
        if(this.posX <= x && (this.posX + this.width) > x ) {
            if(this.posY <= y && (this.posY + this.height) > y ) {
                return true;
            }
        }
        return false;
    }
}

export default Button;