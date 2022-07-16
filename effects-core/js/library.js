/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */
'use strict';

(function(window){
    window.ImageEffects = window.ImageEffects || {};
    window.ImageEffects.isReady = false;
    window.ImageEffects.Apply = function() {
        console.log('Module is not ready');
    };
    window.ImageEffects.onLoadModule = function(exports) {
        window.ImageEffects.isReady = true;
        window.ImageEffects.Apply = exports.ApplyEffect;
    };

    window.ImageEffects.loadModule = function(settings) {
        let url = settings.enginePath ? settings.enginePath : './effects-core/deploy/engine/';

        let useWasm = false;
        const webAsmObj = window['WebAssembly'];
        if (typeof webAsmObj === 'object') {
            if (typeof webAsmObj['Memory'] === 'function') {
                if ((typeof webAsmObj['instantiateStreaming'] === 'function') || (typeof webAsmObj['instantiate'] === 'function')) {
                    useWasm = true;
                }
            }
        }
        url += (useWasm ? 'effects.js' : 'effects_ie.js');
        // eslint-disable-next-line no-var
        const worker = new Worker(url);
        return worker;
        // var script = document.createElement('script');
        // script.type = 'text/javascript';
        // script.src = url;
        // script.onload = function() {
        //     console.log((useWasm ? 'wasm' : 'asmjs') + ' module will be used');
        // };
        // script.onerror = function() {
        //     // TODO: попробовать загрузить еще сколько-то раз (максимальное число попыток  - зашито в коде - например 5)
        // };
        // document.head.appendChild(script);
    };
})(self);
