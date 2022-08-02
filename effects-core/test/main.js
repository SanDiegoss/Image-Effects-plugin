/* eslint-disable no-invalid-this */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable max-len */
let isImageLoaded = false;
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
 * @param {HTMLDivElement} effectForm
 * @param {Boolean} isCheckboxOnly
 * @param {Settings} settings
 */
function CForm(effectForm, isCheckboxOnly, settings) {
    this.id = effectForm.id;
    this.checkbox = effectForm.firstElementChild;
    this.isCheckboxOnly = isCheckboxOnly;
    if (!this.isCheckboxOnly) {
        this.valueText = effectForm.lastElementChild;
        this.slider = new SliderModule.CSlider(settings, this.valueText.previousElementSibling);

        this.changeValue = function() {
            this.valueText.textContent = this.slider.parent.getAttribute('value');
            setEffect();
        };
        this.getValue = function() {
            return +this.slider.parent.getAttribute('value');
        };
        this.slider.registerEvent('change', this.changeValue.bind(this));
    }
    /**
     * @param {Event} event
     */
    function changeCheckbox(event) {
        if (!this.isCheckboxOnly) {
            if (this.checkbox.checked) {
                this.slider.enable();
            } else {
                this.slider.disable();
            }
        }
        setEffect();
    }
    this.checkbox.addEventListener('click', changeCheckbox.bind(this), false);
}
// eslint-disable-next-line no-unused-vars
const isWorker = true;
/**
 * @type {CForm[]}
 */
const forms = [];
const dropArea = document.getElementById('drop-area');
Array.prototype.forEach.call(document.querySelectorAll('.effect-form'), (function(element) {
    if (document.querySelector('#' + element.id + '> .sliderContainer') == null) {
        forms.push(new CForm(element, true, {}));
    } else {
        forms.push(new CForm(element, false, {}));
    }
}));

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
const bg = new CBackground(effectCanvas);
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
 */
function setEffect() {
    if (effectImageData) {
        effectImageData.data.set(middlewareImageData.data);
        // Формируем пачку эффектов и отдаем ее
        const effects = [];
        forms.forEach(function(element) {
            if (element.isCheckboxOnly) {
                effects.push({
                    type: element.id,
                    level: element.checkbox.checked ? 1 : 0,
                });
            } else {
                if (element.checkbox.checked) {
                    effects.push({
                        type: element.id,
                        level: element.getValue(),
                    });
                }
            }
        });
        window.ImageEffects.Apply({effects: effects, data: effectImageData});
        if (!isWorker) {
            effectContext.putImageData(effectImageData, 0, 0);
        }
    } else {
        throw new Error('No Image!');
    }
}

/* Drag n Drop */
/**
 * Показывает, откуда и сколько надо вырезать
 * @param {HTMLImageElement} image
 * @typedef {Object} Formatter
 * @property {HTMLImageElement} image
 * @property {Number} sx
 * @property {Number} sy
 * @property {Number} sWidth
 * @property {Number} sHeight
 * @return {Formatter}
 */
function formatImage(image) {
    const formatter = {
        image: image,
        sx: 0,
        sy: 0,
        sWidth: image.width,
        sHeight: image.height,
    };
    if (image.height > image.width) {
        formatter.sx = (image.width - (image.height * 9 / 16)) / 2;
        formatter.sWidth = image.height * 9 / 16;
        if (formatter.sx < 0) {
            formatter.sx = 0;
            formatter.sWidth = image.width;
            formatter.sy = (image.height - (image.width * 16 / 9)) / 2;
            formatter.sHeight = image.width * 16 / 9;
        }
    } else {
        formatter.sy = (image.height - (image.width * 9 / 16)) / 2;
        formatter.sHeight = image.width * 9 / 16;
        if (formatter.sy < 0) {
            formatter.sy = 0;
            formatter.sHeight = image.height;
            formatter.sx = (image.width - (image.height * 16 / 9)) / 2;
            formatter.sWidth = image.height * 16 / 9;
        }
    }
    return formatter;
}
/**
 */
function resize() {
    const isVertical = (effectCanvas.width < effectCanvas.height);
    const rect = dropArea.parentElement.getBoundingClientRect();
    const stRect = (isVertical) ? format.vertical.width : format.horizontal.width;
    const panels = document.getElementById('effects-content');
    if (panels.getBoundingClientRect().width < 510) {
        panels.style.flexDirection = 'column';
        panels.style.alignItems = 'center';
        if (panels.getBoundingClientRect().width < 303) {
            panels.style.alignItems = 'flex-start';
        }
    } else {
        panels.style.flexDirection = 'row';
        panels.style.alignItems = 'flex-start';
    }
    if (isImageLoaded) {
        if (rect.width < stRect) {
            dropArea.style.width = rect.width + 'px';
            dropArea.style.height = (isVertical) ? rect.width * 16 / 9 + 'px' : rect.width * 9 / 16 + 'px';
        } else {
            dropArea.style.width = (isVertical) ? format.vertical.width + 'px' : format.horizontal.width + 'px';
            dropArea.style.height = (isVertical) ? format.vertical.height + 'px' : format.horizontal.height + 'px';
        }
        effectCanvas.style.width = dropArea.style.width;
        effectCanvas.style.height = dropArea.style.height;
        return;
    }
    const noImage = dropArea.firstElementChild;
    if (rect.width < format.vertical.height) {
        dropArea.style.width = rect.width + 'px';
        dropArea.style.height = rect.width + 'px';
    } else {
        dropArea.style.width = format.vertical.height + 'px';
        dropArea.style.height = format.vertical.height + 'px';
    }
    noImage.style.width = dropArea.style.width;
    noImage.style.height = dropArea.style.height;
    return;
}
/**
 * @param {HTMLImageElement} preImage
 */
const imagePreview = function drawImageOnDisplay(preImage) {
    originContext.clearRect(0, 0, originCanvas.width, originCanvas.height);
    originContext.drawImage(preImage, 0, 0, originCanvas.width, originCanvas.width);

    const formatter = formatImage(preImage);
    console.log(formatter.sx, formatter.sy, formatter.sWidth, formatter.sHeight);
    effectCanvas.width = formatter.sWidth;
    effectCanvas.height = formatter.sHeight;
    console.log(effectCanvas.width, effectCanvas.height);
    resize();
    effectContext.clearRect(0, 0, effectCanvas.width, effectCanvas.height);

    effectContext.drawImage(
        formatter.image,
        formatter.sx,
        formatter.sy,
        formatter.sWidth,
        formatter.sHeight,
        0,
        0,
        effectCanvas.width,
        effectCanvas.height);
};
/**
 */
function enableCheckbox() {
    const checkboxes = document.querySelectorAll('.checkbox');
    Array.prototype.forEach.call(checkboxes, (function(checkbox) {
        checkbox.removeAttribute('disabled');
    }));
}
const noImageText = document.getElementById('no-image-text');
/**
 * @param {DragEvent} event
 */
const handleFiles = function handleFilesFromForm(event) {
    noImageText.parentElement.style.display = 'none';
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
            isImageLoaded = true;
            originCanvas.width = image.width;
            originCanvas.height = image.height;

            imagePreview(image);

            originImageData = originContext.getImageData(0, 0, originCanvas.width, originCanvas.height);
            effectImageData = effectContext.getImageData(0, 0, effectCanvas.width, effectCanvas.height);

            middlewareImageData = effectContext.createImageData(effectImageData);
            middlewareImageData.data.set(effectImageData.data);
            enableCheckbox();
            bg.enable();
        };
    };
};
window.addEventListener('resize', resize);
dropArea.addEventListener('drop', handleFiles, false);
window.ImageEffects.loadModule({enginePath: './effects-core/deploy/engine/'});

