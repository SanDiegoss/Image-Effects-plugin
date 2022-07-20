/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable max-len */
/**
 * @return {Boolean}
 */
function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}
/**
 * @return {Boolean}
 */
function isChrome() {
    return window.navigator.userAgent.indexOf('Chrome') > -1;
};
// eslint-disable-next-line no-unused-vars
const isWorker = true;
const image = document.createElement('img');
const forms = document.querySelectorAll('.effect-form');
const dropArea = document.getElementById('drop-area');

/**
 * @type {HTMLCanvasElement}
 */
const originCanvas = document.createElement('canvas');
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
function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
/**
 * @param {HTMLElement} form
 * @return {[HTMLInputElement, HTMLParagraphElement, HTMLInputElement]}
 */
 function getValuesFromForm(form) {
    const slider = document.querySelector('#' + form.id + '> .sliderContainer').firstElementChild;
    const valueText = document.querySelector('#' + form.id + '> .value-text');
    const checkbox = document.querySelector('#' + form.id).firstElementChild;
    return [slider, valueText, checkbox];
}
/**
 */
function setEffect() {
    if (effectImageData) {
        effectImageData.data.set(middlewareImageData.data);
    // Формируем пачку эффектов и отдаем ее
        const effects = [];
        Array.prototype.forEach.call(forms, function(element) {
            const values = getValuesFromForm(element);
            const slider = values[0];
            const valueText = values[1];
            const checkbox = values[2];
            if (checkbox.checked) {
                effects.push({type: valueText.parentElement.id, level: slider.value});
            }
        });
        window.ImageEffects.Apply(effects, effectImageData);
        if (!isWorker) {
            effectContext.putImageData(effectImageData, 0, 0);
        }
    } else {
        throw new Error('No Image!');
    }
}
/**
 * @param {HTMLInputElement} slider
 * @desciption Google polyfill for progress bar
 */
function chromeProgressBar(slider) {
    const color = slider.disabled ? '#a0a0a0' : '#444444';
    const del = ((+slider.max - +slider.min)/100);
    let value = slider.value / del;
    if (+slider.min < 0) {
        value += +slider.max / 2;
    }
    slider.style.background =
    'linear-gradient(to right, ' + color + ' 0%, ' + color +' '+
    value +
    '%, #c0c0c0 ' +
    value +
    '%, #c0c0c0 100%)';
}
/**
 * @param {Event} event
 */
function changeValue(event) {
    preventDefaults(event);
    /**
    * @type {HTMLInputElement}
    */
    const slider = event.target;
    /**
    * @type {HTMLParagraphElement}
    */
    const valueText = slider.parentElement.nextElementSibling;
    valueText.textContent = slider.value;
    if (isChrome()) {
        chromeProgressBar(slider);
    }
    setEffect();
}
/**
 * @param {Event} event
 */
function changeCheckbox(event) {
    const slider = event
        .target
        .nextElementSibling
        .nextElementSibling
        .firstElementChild;
    if (event.target.checked) {
       slider.removeAttribute('disabled');
    } else {
       slider.setAttribute('disabled', '');
    }
    if (isChrome()) {
        chromeProgressBar(slider);
    }
    setEffect();
}

Array.prototype.forEach.call(forms, (function(element) {
    const values = getValuesFromForm(element);
    values[0].addEventListener((isInternetExplorer() ? 'change' : 'input'), changeValue, false);
    if (isInternetExplorer()) {
        values[0].parentElement.classList.add('ie-support');
    }
    if (isChrome()) {
        chromeProgressBar(values[0]);
    }
    values[2].addEventListener('click', changeCheckbox, false);
}));

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
 */
function enableCheckbox() {
    const checkboxes = document.querySelectorAll('.checkbox');
    Array.prototype.forEach.call(checkboxes, (function(checkbox) {
        checkbox.removeAttribute('disabled');
    }));
}
/**
 * @param {DragEvent} event
 */
const handleFiles = function handleFilesFromForm(event) {
    document.getElementById('no-image-text').parentElement.style.display = 'none';
    effectCanvas.style.display = 'block';
    /**
     * @param {ArrayBuffer} typedArray
     * @param {String} mimeType
     * @return {String}
     */
    function typedArrayToURL(typedArray, mimeType) {
        return URL.createObjectURL(new Blob([typedArray], {type: mimeType}));
    }
    const files = event.dataTransfer.files;
    if (files.length > 1) {
        throw new Error('Only 1 file, please.');
    }
    const file = files.item(0);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function() {
        const url = typedArrayToURL(reader.result, file.type);
        image.src = url;
        image.onload = function() {
            imagePreview(image);
            originImageData = originContext.getImageData(0, 0, originCanvas.width, originCanvas.height);
            effectImageData = effectContext.getImageData(0, 0, originCanvas.width, originCanvas.height);

            middlewareImageData = originContext.createImageData(originImageData);
            middlewareImageData.data.set(originImageData.data);
            enableCheckbox();
        };
    };
};

dropArea.addEventListener('drop', handleFiles, false);
window.ImageEffects.loadModule({enginePath: './effects-core/deploy/engine/'});

