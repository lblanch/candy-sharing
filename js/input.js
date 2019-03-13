var mouseX = 0; 
var mouseY = 0;

function setupInput() {
    canvas.addEventListener('mouseup', updateMousePos);
}

//event can be called anything it's the excepted argument for a event receiver
function updateMousePos(event) {
    var clickedIndex;
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = event.clientX - rect.left - root.scrollLeft;
    mouseY = event.clientY - rect.top - root.scrollTop;
    //check mouse is in candy bag
    if ((mouseX > BAG_LEFT_CORNER_X && mouseX <= ((CANDY_BAG_COLS * CANDY_SIZE_W) + BAG_LEFT_CORNER_X)) && 
        (mouseY > BAG_LEFT_CORNER_Y && mouseY <= ((CANDY_BAG_ROWS * CANDY_SIZE_H) + BAG_LEFT_CORNER_Y))) {
            var clickedX = Math.floor((mouseX - BAG_LEFT_CORNER_X)/CANDY_SIZE_W);
            var clickedY = Math.floor((mouseY - BAG_LEFT_CORNER_Y)/CANDY_SIZE_H);
            clickedIndex = clickedY * CANDY_BAG_COLS + clickedX;
            if (candyBag[clickedIndex] != null) {
                //console.log("clicked falling status " + candyBag[clickedIndex].isFalling);
                closeCandies.push(clickedIndex);
                candyBag[clickedIndex].isEaten++;
                while (closeCandies.length > 0) {
                    checkCloseByCandies(closeCandies.length - 1, candyBag[clickedIndex].candyColor);
                }
            }
    }
}