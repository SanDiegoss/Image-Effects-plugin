import {createEvents} from './visualEvents.js'

let image = document.createElement('img');

/* Drag n Drop */

let dropArea = document.getElementById("drop-area");
/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas')

const context = CANVAS.getContext('2d');

createEvents(dropArea);
/**
 * @param {HTMLImageElement} image 
 */
let imagePreview = function drawImageOnDisplay(){
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    context.drawImage(this, 0, 0, CANVAS.width, CANVAS.height);
};

/**
 * @param {DragEvent} event 
 */
let handleFiles = function handleFilesFromForm(event){
    let files = event.dataTransfer.files;
    if(files.length > 1) {
        console.error("Too many files!");
        throw new Error('Only 1 file, please.');
    }
    let file = files.item(0);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        image.src = reader.result;
        image.onload = imagePreview;
    }
}

dropArea.addEventListener('drop', handleFiles, false);



/*--------- */


