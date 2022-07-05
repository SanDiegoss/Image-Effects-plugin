/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable padded-blocks */
/* eslint-disable space-before-blocks */

import { createEvents, preventDefaults } from './visualEvents';

// allocate memory for wasm, returns pointer
function allocateMemory(module, length) {
    const ptr = module._malloc(length);
    return [new Uint8ClampedArray(module.HEAP8.buffer, ptr, length), ptr];
}

// free memory
function freeMemory(module, ptr) {
    module._free(ptr);
}

// fill memory
function setMemory(module, data, ptr) {
    module.HEAP8.set(data, ptr);
}

const image = document.createElement('img');
const forms = document.querySelectorAll('.effectForm > form');
const dropArea = document.getElementById('drop-area');
/**
 * @type {ImageData}
 */
let imageData;

/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas');

const context = CANVAS.getContext('2d');

createEvents(dropArea);

const effect = {
    async brightness(value){

        const module = await Module();

        const [ptr, ptr_] = allocateMemory(module, imageData.data.length);
        setMemory(module, imageData.data, ptr_);
        
        module._add_brightness(ptr_, CANVAS.height, CANVAS.width, value);

        for (let i = 0; i < imageData.data.length; i += 1){
            imageData.data[i] = ptr[i];
        }

        context.putImageData(imageData, 0, 0);
        freeMemory(module, ptr_);
    },
    /* все эффекты, которые могут быть, будут перечислены тут */
};

/* Slider Events */

/**
 * @param {Event} event 
 */
 function confirmEffect(event){
    preventDefaults(event);
    if (imageData){
        effect[`${event.target.parentElement.id}`](event.target.firstElementChild.value);
    } else {
        throw new Error('No Image!');
    }
}

/**
 * @param {NodeListOf<Element>} forms 
 */
const createFormEvents = (function createFormsEvents(inputForms){

    /**
    * @type {HTMLInputElement}
    */
    let slider;
    /**
    * @type {HTMLInputElement}
    */
    let valueText;

    /**
    * @param {Event} event 
    */
    function changeValue(event){
        preventDefaults(event);
        if (event.target === slider) {
            valueText.value = slider.value;
        } else if (event.target === valueText) {
            slider.value = valueText.value;
        }
        if (valueText.value > 100) {
            valueText.value = 100;
        }
        if (valueText.value < -100) {
            valueText.value = -100;
        }
    }
    inputForms.forEach((element) => {

        slider = element.firstElementChild.nextElementSibling.firstElementChild;
        valueText = element.firstElementChild;

        slider.addEventListener('input', changeValue, false);
        valueText.addEventListener('input', changeValue, false);
        element.addEventListener('submit', confirmEffect, false);
    });

}(forms));

/* Drag n Drop */

const imagePreview = function drawImageOnDisplay(preImage){
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    context.drawImage(preImage, 0, 0, CANVAS.width, CANVAS.height);
};

/**
 * @param {DragEvent} event 
 */
const handleFiles = function handleFilesFromForm(event){
    const { files } = event.dataTransfer;
    if (files.length > 1) {
        throw new Error('Only 1 file, please.');
    }
    const file = files.item(0);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        image.src = reader.result;
        image.onload = () => {
            imagePreview(image);
            imageData = context.getImageData(0, 0, CANVAS.width, CANVAS.height);
        };
    };
};

dropArea.addEventListener('drop', handleFiles, false);

const lulz = (async function lul(){
    const module = await Module();

    const h = 2;
    const w = 3;
    const size = h * w * 4;
    const data = new Uint8ClampedArray(size);
    for (let i = 0; i < size; i += 4){
        for (let j = 0; j < 4; j += 1){
            data[i + j] = j + 1;
        }
    }
    // ptr для JS, ptr_ для wasm
    const [ptr, ptr_] = allocateMemory(module, size);
    setMemory(module, data, ptr_);

    // console.log('JS print:')
    // for(let i = 0; i < size; i++) console.log(ptr[i]);

    // module._print(ptr_, h, w);

    freeMemory(module, ptr_);
    return 123;
}());
