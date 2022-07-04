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
    }
}

dropArea.addEventListener('drop', handleFiles, false);

let lulz = async function lul(){
    let module = await Module();

    var h = 2;
    var w = 3;
    var size = h * w * 4;
    var data = new Uint8ClampedArray(size);
    for(let i = 0; i < size; i += 4)
        for(let j = 0; j < 4; j++)
            data[i + j] = j + 1;

    // ptr для JS, ptr_ для wasm
    let [ptr, ptr_] = allocateMemory(module, size);
    setMemory(module, data, ptr_)

    console.log('JS print:')
    for(let i = 0; i < size; i++) console.log(ptr[i]);

    module._print(ptr_, h, w);

    freeMemory(module, ptr_);
    return 123;
}();

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
