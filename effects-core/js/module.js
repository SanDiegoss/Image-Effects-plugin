/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */

// eslint-disable-next-line prefer-const

(function(window) {
    let isModuleLoaded = false;
    /**
     */
    function onLoadModule() {
        isModuleLoaded = true;
        if (window.ImageEffects) {
            window.ImageEffects.onLoadModule && window.ImageEffects.onLoadModule({
                ApplyEffect: ApplyEffect,
            });
        } else {
            postMessage('module is ready');
        }
    };

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
        /* One Image - One Value */
        oIoV: function oneImageOneValue(value, imageData, effect) {
            const module = Module;
            const ptr_ = allocateMemory(module, imageData.data.length);
            setMemory(module, imageData.data, ptr_);

            module['_change_' + effect](ptr_, imageData.height, imageData.width, value);
            const ptr = new Uint8ClampedArray(module.HEAP8.buffer, ptr_, imageData.data.length);

            imageData.data.set(ptr);
            freeMemory(module, ptr_);
        },
        /* --------------------------------------------------------- */
        brightness: function(level, data) {
            this.oIoV(level, data, 'brightness');
        },
        saturation: function(level, data) {
            this.oIoV(level, data, 'saturation');
        },
        /* все эффекты, которые могут быть, будут перечислены тут */
    };

    /**
     * @typedef {Object} Effect
     * @property {String} type
     * @property {Number} level
     * @param {Array<Effect>} effects
     * @param {Uint8ClampedArray} data 
     */
    function ApplyEffect(effects, data) {
        if (isModuleLoaded) {
            effects.forEach(function(item) {
                effect[item.type](item.level, data);
            });
        } else {
            throw new Error('Module is not loaded!');
        }
    };
    window.onmessage = function(e) {
        // console.log(e.data.data);
        const effects = e.data.effects;
        const data = e.data.data;
        ApplyEffect(effects, data);
        postMessage(data);
    };
})(self);

