/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const format = {
    horizontal: {
        width: 663,
        height: 373,
    },
    vertical: {
        width: 218,
        height: 373,
    },
};
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
// eslint-disable-next-line no-unused-vars
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
 * @typedef {Object} values
 * @property {HTMLInputElement} slider
 * @property {HTMLParagraphElement} valueText
 * @property {HTMLInputElement} checkbox
 * @return {values}
 */
 function getValuesFromForm(form) {
    const values = {
        slider: null,
        valueText: null,
        checkbox: document.querySelector('#' + form.id).firstElementChild,
    };
    if (document.querySelector('#' + form.id + '> .sliderContainer')) {
        values.slider = document.querySelector('#' + form.id + '> .sliderContainer').firstElementChild;
        values.valueText = document.querySelector('#' + form.id + '> .value-text');
    }
    return values;
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
            if (!values.slider) {
                effects.push({
                    type: element.id,
                    level: values.checkbox.checked ? 1 : 0,
                });
            } else {
                if (values.checkbox.checked) {
                    effects.push({type: element.id, level: values.slider.value});
                }
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
        'linear-gradient(to right, ' +
        color +
        ' 0%, ' +
        color +
        ' ' +
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
    if (!values.slider) {
        values.checkbox.addEventListener('click', setEffect, false);
    } else {
        values.slider.addEventListener((isInternetExplorer() ? 'change' : 'input'), changeValue, false);
        if (isInternetExplorer()) {
            element.classList.add('ie-support');
        }
        if (isChrome()) {
            chromeProgressBar(values.slider);
        }
        values.checkbox.addEventListener('click', changeCheckbox, false);
    }
}));

/* Drag n Drop */
/**
 * @param {HTMLImageElement} image
 * @typedef {Object} Formatter
 * @property {HTMLImageElement} image
 * @property {Number} sx
 * @property {Number} sy
 * @property {Number} sWidth
 * @property {Number} sHeight
 * @property {Number} dx
 * @property {Number} dy
 * @property {Number} dWidth
 * @property {Number} dHeight
 * @return {Formatter}
 */
function formatImage(image) {
    const formatter = {
        image: image,
        sx: 0,
        sy: 0,
        sWidth: image.width,
        sHeight: image.height,
        dx: 0,
        dy: 0,
        dWidth: effectCanvas.width,
        dHeight: effectCanvas.height,
    };
    if (image.height > image.width) {
        effectCanvas.width = format.vertical.width;
        formatter.dWidth = format.vertical.width;
        formatter.sx = (image.width - (image.height * 9 / 16)) / 2;
        formatter.sWidth = image.height * 9 / 16;
    } else {
        effectCanvas.width = format.horizontal.width;
        formatter.dWidth = format.horizontal.width;
        formatter.sy = (image.height - (image.width * 9 / 16)) / 2;
        formatter.sHeight = image.width * 9 / 16;
    }
    return formatter;
}
/**
 * @param {HTMLImageElement} preImage
 */
const imagePreview = function drawImageOnDisplay(preImage) {
    originContext.clearRect(0, 0, originCanvas.width, originCanvas.height);
    originContext.drawImage(preImage, 0, 0, originCanvas.width, effectCanvas.width);

    const formatter = formatImage(preImage);

    effectContext.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    effectContext.drawImage(
        formatter.image,
        formatter.sx,
        formatter.sy,
        formatter.sWidth,
        formatter.sHeight,
        formatter.dx,
        formatter.dy,
        formatter.dWidth,
        formatter.dHeight);
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
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
        const image = new Image();
        image.src = url;

        image.onload = function() {
            originCanvas.width = image.width;
            originCanvas.height = image.height;

            imagePreview(image);

            originImageData = originContext.getImageData(0, 0, originCanvas.width, originCanvas.height);
            effectImageData = effectContext.getImageData(0, 0, effectCanvas.width, effectCanvas.height);

            middlewareImageData = effectContext.createImageData(effectImageData);
            middlewareImageData.data.set(effectImageData.data);
            enableCheckbox();
        };
    };
};

dropArea.addEventListener('drop', handleFiles, false);
window.ImageEffects.loadModule({enginePath: './effects-core/deploy/engine/'});

