import {createEvents, preventDefaults} from './visualEvents.js'

let image = document.createElement('img');

let forms = document.querySelectorAll('.effectForm > form');

let dropArea = document.getElementById("drop-area");
/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas')

const context = CANVAS.getContext('2d');

createEvents(dropArea);

/**
 * @type {ImageData}
 */
let imageData;

let effect = {
    brightness: function(value){
        //TODO: вызов Module.... 
        console.log(value);
    }
    /* все эффекты, которые могут быть, будут перечислены тут */
}

/* Slider Events */
/**
 * @param {NodeListOf<Element>} forms 
 */
let createFormEvents = function createFormsEvents(forms){
    /**
     * @type {HTMLInputElement}
     */
    let slider;
    /**
     * @type {HTMLInputElement}
     */
    let valueText;

    forms.forEach((element) => {

        slider = element.firstElementChild.nextElementSibling.firstElementChild;
        valueText = element.firstElementChild;
        console.log(slider)
        console.log(valueText)

        slider.addEventListener('input', changeValue, false);
        valueText.addEventListener('input', changeValue, false);
        element.addEventListener('submit', confirmEffect, false);
    });

    /**
     * @param {Event} event 
     */
    function changeValue(event){
        preventDefaults(event);
        event.target === slider ? valueText.value = slider.value : slider.value = valueText.value;
        if(valueText.value > 100) {
            valueText.value = 100
        }
        if(valueText.value < 0) {
            valueText.value = 0;
        }
    }

}(forms);

/**
 * @param {Event} event 
 */
function confirmEffect(event){
    preventDefaults(event);
    effect[`${event.target.parentElement.id}`](event.target.firstElementChild.value);
}

/* Drag n Drop */

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
        imageData = context.getImageData(0, 0, CANVAS.width, CANVAS.height);
        imageData.data
    }
}

dropArea.addEventListener('drop', handleFiles, false);



/*--------- */


