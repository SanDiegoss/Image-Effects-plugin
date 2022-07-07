/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable max-len */

import {createEvents, preventDefaults} from './visualEvents.js';

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

/* Slider Events */

/**
 * @param {Event} event
 */
function confirmEffect(event) {
    preventDefaults(event);
    if (imageData) {
        window.ApplyEffect({
            type: event.target.parentElement.id,
            level: event.target.firstElementChild.value},
            imageData);
        context.putImageData(imageData, 0, 0);
    } else {
        throw new Error('No Image!');
    }
}

/**
 * @param {NodeListOf<Element>} forms
 */
const createFormEvents = (function createFormsEvents(inputForms) {
    /**
    * @param {Event} event
    */
    function changeValue(event) {
        preventDefaults(event);
        let valueText;
        let slider;
        if (event.target.className === 'effectTextInput') {
            valueText = event.target;
            slider = event.target.nextElementSibling.firstElementChild;
            slider.value = valueText.value;
        } else if (event.target.parentElement.className === 'sliderContainer') {
            slider = event.target;
            valueText = event.target.parentElement.parentElement.firstElementChild;
            valueText.value = slider.value;
        }
        if (valueText.value > 100) {
            valueText.value = 100;
        }
        if (valueText.value < -100) {
            valueText.value = -100;
        }
    }
    inputForms.forEach((element) => {
        /**
        * @type {HTMLInputElement}
        */
        const slider = element.firstElementChild.nextElementSibling.firstElementChild;
        /**
        * @type {HTMLInputElement}
        */
        const valueText = element.firstElementChild;

        slider.addEventListener('input', changeValue, false);
        valueText.addEventListener('input', changeValue, false);
        element.addEventListener('submit', confirmEffect, false);
    });
}(forms));

/* Drag n Drop */
/**
 * @param {HTMLImageElement} preImage
 */
const imagePreview = function drawImageOnDisplay(preImage) {
    CANVAS.width = preImage.width;
    CANVAS.height = preImage.height;
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    context.drawImage(preImage, 0, 0, CANVAS.width, CANVAS.height);
};

/**
 * @param {DragEvent} event
 */
const handleFiles = function handleFilesFromForm(event) {
    const {files} = event.dataTransfer;
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

