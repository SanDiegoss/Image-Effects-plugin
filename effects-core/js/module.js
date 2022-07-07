/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */


/* Working with Module */

//polyfill

//module

/**
 * @param {Module} module
 * @param {Number} length
 * @return {Number}
 * Allocate memory for wasm, returns pointer
 */
 function allocateMemory(module, length) {
    const ptr = module._malloc(length);
    return ptr;
}

/**
 * @param {Module} module
 * @param {Number} ptr
 * @return {void}
 * Free memory
 */
function freeMemory(module, ptr) {
    module._free(ptr);
}

/**
 * @param {Module} module
 * @param {Uint8Array} data
 * @param {Number} ptr
 * @return {void}
 * Fill memory
 */
function setMemory(module, data, ptr) {
    module.HEAP8.set(data, ptr);
}

const effect = {
    // TODO: decorator for module memory functions
    do(value, imageData, effect) {
        const module = Module;
        const ptr_ = allocateMemory(module, imageData.data.length);
        setMemory(module, imageData.data, ptr_);

        module[`_change_${effect}`](ptr_, imageData.height, imageData.width, value);
        const ptr = new Uint8ClampedArray(module.HEAP8.buffer, ptr_, imageData.data.length);

        imageData.data.set(ptr);
        
        freeMemory(module, ptr_);
    },
/* все эффекты, которые могут быть, будут перечислены тут */
};

/**
 * @typedef {Object} Effect
 * @property {String} type
 * @property {Number} level
 * @param {Effect} effect 
 * @param {Uint8ClampedArray} data 
 */
function ApplyEffect({type, level}, data) {
    effect.do(level, data, type);
}
