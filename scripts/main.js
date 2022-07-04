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
    brightness: async function(value){
        let module = await Module();
        console.log(imageData.data);
        let [ptr, ptr_] = allocateMemory(module, imageData.data.length);
        setMemory(module, imageData.data, ptr_);
        module._print(ptr_, CANVAS.height, CANVAS.width);
        freeMemory(module, ptr_);
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
    if(imageData){
        effect[`${event.target.parentElement.id}`](event.target.firstElementChild.value);
    }
    else{
        throw new Error('No Image!');
    }
    
}

/* Drag n Drop */

let imagePreview = function drawImageOnDisplay(image){
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    context.drawImage(image, 0, 0, CANVAS.width, CANVAS.height);
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
        image.onload = () => {
            imagePreview(image);
            imageData = context.getImageData(0, 0, CANVAS.width, CANVAS.height);
        }
    }
}

dropArea.addEventListener('drop', handleFiles, false);

// allocate memory for wasm, returns pointer
function allocateMemory(module, length)
{
    var ptr = module._malloc(length);
    return [new Uint8ClampedArray(module.HEAP8.buffer, ptr, length), ptr];
}

// free memory
function freeMemory(module, ptr)
{
    module._free(ptr);
}

// fill memory
function setMemory(module, data, ptr)
{
    module.HEAP8.set(data, ptr);
}
