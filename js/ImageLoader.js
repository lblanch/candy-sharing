const FOLDER_IMAGES = "images/";
const IMAGE_EXTENSION = ".png";

class ImageLoader {
    
    constructor(document) {
        this.queue = [];
        this.pics = [];
        this.docHTML = document;
        this.picsToLoad = 0;
    }

    //Adds an array of filenames to the queue of images to be loaded
    //Returns the array index where the array will be merged into (offset value)
    addArrayToQueue(filesToAdd) {
        let offsetValue = this.queue.length;
        this.queue = [...this.queue, ...filesToAdd];
        
        return offsetValue;
    }

    //Adds a filenames to the queue of images to be loaded
    //Returns the array index
    addToQueue(fileName) {
        this.queue.push(fileName);
        return this.queue.length - 1;
    }
    
    loadImagesFromQueue() {
        let counter = this.queue.length - 1;
        this.picsToLoad = this.queue.length;

        //images will have same index in the pictures array as in the queue
        //we use pop instead of shift because it's faster
        while(this.queue.length > 0) {
            this.pics[counter] = this.docHTML.createElement("img");
            this.pics[counter].onload = this.countLoadedImagesAndLaunchIfReady.bind(this);
            this.pics[counter].src = FOLDER_IMAGES + this.queue.pop() + IMAGE_EXTENSION;
            counter--;
        }
    }

    onDoneLoading(callback) {
        this.callback = callback;
    }
    
    countLoadedImagesAndLaunchIfReady() {
        this.picsToLoad--;
        if (this.picsToLoad == 0) {
            this.callback();
        }
    }
}

export default ImageLoader;
