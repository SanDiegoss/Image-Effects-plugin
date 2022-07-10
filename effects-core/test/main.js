/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable max-len */

const image = document.createElement('img');
const forms = document.querySelectorAll('.effectForm');
/**
 * @type {HTMLCanvasElement}
 */
const originCanvas = document.getElementById('previewImage');
const originContext = originCanvas.getContext('2d');
/**
 * @type {HTMLCanvasElement}
 */
const effectCanvas = document.getElementById('previewEffect');
const effectContext = effectCanvas.getContext('2d');
/**
 * @type {ImageData}
 */
let originImageData;
/**
 * @type {ImageData}
 */
let effectImageData;
/**
 * @type {ImageData}
 */
let middlewareImageData;
/* Global buttons Events*/

/* origin -> middleware -> effect */

/**
 * @param {Event} event
 */
function saveAllChanges(event) {
    preventDefaults(event);
    originImageData.data.set(middlewareImageData.data);
    originContext.putImageData(middlewareImageData, 0, 0);
}
/**
 * @param {Event} event
 */
function discardAllChanges(event) {
    preventDefaults(event);
    middlewareImageData.data.set(originImageData.data);
    effectContext.putImageData(originImageData, 0, 0);
}
/**
 * @param {HTMLElement} form
 * @return {[HTMLInputElement, HTMLInputElement]}
 */
 function getValuesFromForm(form) {
    const slider = document.querySelector(`#${form.id} > .sliderContainer`).firstElementChild;
    const valueText = form.firstElementChild.nextElementSibling;
    return [slider, valueText];
}
/**
 */
function setDefaults() {
    forms.forEach(function(item) {
        const [slider, valueText] = getValuesFromForm(item);
        slider.value = 0;
        valueText.value = 0;
    });
}
/**
 * @param {Event} event
 */
function confirmEffects(event) {
    preventDefaults(event);
    middlewareImageData.data.set(effectImageData.data);
    effectContext.putImageData(middlewareImageData, 0, 0);
    setDefaults();
}
const saveAllChangesButton = document.getElementById('saveAllChangesButton');
const discardAllChangesButton = document.getElementById('discardAllChangesButton');
const confirmEffectsButton = document.getElementById('confirmEffects');

saveAllChangesButton.addEventListener('click', saveAllChanges, false);
discardAllChangesButton.addEventListener('click', discardAllChanges, false);
confirmEffectsButton.addEventListener('click', confirmEffects, false);
/* Slider Events */

/**
 */
function setEffect() {
    if (effectImageData) {
        effectImageData.data.set(middlewareImageData.data);
        forms.forEach(function(element) {
            const [slider, valueText] = getValuesFromForm(element);
            window.ApplyEffect({
                type: valueText.parentElement.id,
                level: valueText.value},
                effectImageData);
            effectContext.putImageData(effectImageData, 0, 0);
        });
    } else {
        throw new Error('No Image!');
    }
}

/**
 * @param {Event} event
 */
function changeValue(event) {
    preventDefaults(event);
    /**
    * @type {HTMLInputElement}
    */
    let valueText;
    /**
    * @type {HTMLInputElement}
    */
    let slider;
    if (event.target.className === 'effectTextInput') {
        valueText = event.target;
        slider = event.target.nextElementSibling.firstElementChild;
        slider.value = valueText.value;
    } else if (event.target.parentElement.className === 'sliderContainer') {
        slider = event.target;
        valueText = event.target.parentElement.parentElement.firstElementChild.nextElementSibling;
        valueText.value = slider.value;
    }
    if (valueText.value > 100) {
        valueText.value = 100;
    }
    if (valueText.value < -100) {
        valueText.value = -100;
    }
    setEffect();
}

forms.forEach(function(element) {
    getValuesFromForm(element).forEach(function(item) {
        item.addEventListener('input', changeValue, false);
    });
});

/* Drag n Drop */
/**
 * @param {HTMLImageElement} preImage
 */
const imagePreview = function drawImageOnDisplay(preImage) {
    [originCanvas, effectCanvas].forEach(function(item) {
        item.width = preImage.width;
        item.height = preImage.height;
    });
    [originContext, effectContext].forEach(function(item) {
        item.clearRect(0, 0, originCanvas.width, originCanvas.height);
        item.drawImage(preImage, 0, 0, originCanvas.width, originCanvas.height);
    });
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
    reader.onload = function() {
        image.src = reader.result;
        image.onload = function() {
            imagePreview(image);
            originImageData = originContext.getImageData(0, 0, originCanvas.width, originCanvas.height);
            effectImageData = effectContext.getImageData(0, 0, originCanvas.width, originCanvas.height);

            middlewareImageData = originContext.createImageData(originImageData);
            middlewareImageData.data.set(originImageData.data);
        };
    };
};

dropArea.addEventListener('drop', handleFiles, false);

