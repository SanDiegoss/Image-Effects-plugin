/* eslint-disable max-len */
/* eslint-disable indent */
'use strict';
/**
 * @typedef {Object} Color
 * @property {String} mainColor
 * @property {String} disabledColor
 */
/**
 * @typedef {Object} Settings
 * @property {Color} backgroundColor
 * @property {Color} progressColor
 * @property {Color} borderProgressColor
 * @property {Color} thumbColor
 * @property {Color} borderBackgroundColor
 * @property {Number} width
 * @property {Number} height
 * @property {Number} borderRadius
 * @property {Number} thumbRadius
 * @property {Number} max
 * @property {Number} min
 * @property {Number} startValue
 * @property {Boolean} isEnabledByDefault
 */
/**
 * Slider module
 */
// eslint-disable-next-line no-unused-vars
const SliderModule = (function() {
    /**
     * Default settings for slider
     * @type {Settings}
     */
    const defualtSliderSettings = {
        backgroundColor: {mainColor: '#c0c0c0', disabledColor: '#c0c0c0'},
        progressColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderProgressColor: {mainColor: '#444444', disabledColor: 'red'},
        thumbColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderBackgroundColor: {mainColor: '#c0c0c0', disabledColor: 'blue'},
        width: 128,
        height: 4,
        borderRadius: 2,
        thumbRadius: 6,
        max: 100,
        min: 0,
        startValue: 50,
        isEnabledByDefault: false,
    };
    /**
     * @param {Number} x
     * @param {Number} y
     */
    function Coordinates(x, y) {
        this.x = x;
        this.y = y;
    }
    return {
        /**
         * Constructor for sliders
         * @param {Settings} settings
         */
        CSlider: function(settings) {
            settings = settings || defualtSliderSettings;
            let isEnabled = settings.isEnabledByDefault;
            if (settings.borderRadius > settings.height / 2) {
                settings.borderRadius = settings.height / 2;
            }
            if (settings.thumbRadius*2 < settings.height) {
                settings.thumbRadius = settings.height / 2;
            }

            let value = settings.startValue;

            const backgoundCanvas = document.createElement('canvas');
            const progressCanvas = document.createElement('canvas');
            const thumbCanvas = document.createElement('canvas');

            backgoundCanvas.width = settings.width;
            progressCanvas.width = settings.width;
            thumbCanvas.width = settings.thumbRadius * 2;

            backgoundCanvas.height = settings.thumbRadius * 2;
            progressCanvas.height = settings.thumbRadius * 2;
            thumbCanvas.height = settings.thumbRadius * 2;

            backgoundCanvas.style.zIndex = 1;
            progressCanvas.style.zIndex = 2;
            thumbCanvas.style.zIndex = 3;

            backgoundCanvas.style.position = 'absolute';
            progressCanvas.style.position = 'absolute';
            thumbCanvas.style.position = 'absolute';

            const bgContext = backgoundCanvas.getContext('2d');
            const pgContext = progressCanvas.getContext('2d');
            const thContext = thumbCanvas.getContext('2d');
            /**
             */
            function drawBorders() {
                bgContext.beginPath();

                const LeftArcStartPoint = new Coordinates(settings.borderRadius, settings.thumbRadius - settings.height / 2);
                const LeftArcMiddlePoint = new Coordinates(0, settings.thumbRadius);
                const LeftArcEndPoint = new Coordinates(settings.borderRadius, settings.thumbRadius + settings.height / 2);

                const RightArcStartPoint = new Coordinates(settings.width - 2 * settings.borderRadius, settings.thumbRadius - settings.height / 2);
                const RightArcMiddlePoint = new Coordinates(settings.width, settings.thumbRadius);
                const RightArcEndPoint = new Coordinates(settings.width - 2 * settings.borderRadius, settings.thumbRadius + settings.height / 2);

                bgContext.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);
                bgContext.arcTo(LeftArcMiddlePoint.x, LeftArcMiddlePoint.y, LeftArcEndPoint.x, LeftArcEndPoint.y, settings.borderRadius);
                bgContext.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                bgContext.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);

                bgContext.lineTo(RightArcStartPoint.x, RightArcStartPoint.y);
                bgContext.arcTo(RightArcMiddlePoint.x, RightArcMiddlePoint.y, RightArcEndPoint.x, RightArcEndPoint.y, settings.borderRadius);
                bgContext.lineTo(RightArcEndPoint.x, RightArcEndPoint.y);

                bgContext.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                bgContext.strokeStyle = (isEnabled) ? settings.borderBackgroundColor.mainColor : settings.borderBackgroundColor.disabledColor;
                bgContext.stroke();
                bgContext.fillStyle = (isEnabled) ? settings.backgroundColor.mainColor : settings.backgroundColor.disabledColor;
                bgContext.fill();

                bgContext.closePath();
            }
            /**
             */
            function drawThumb() {
                thContext.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);
                thContext.beginPath();
                thContext.arc(settings.thumbRadius, settings.thumbRadius, settings.thumbRadius, 0, 2*Math.PI);
                thContext.fillStyle = (isEnabled) ? settings.thumbColor.mainColor : settings.thumbColor.disabledColor;
                thContext.fill();
                const total = settings.max - settings.min;
                const percent = (value + settings.min) / total;
                const needWidth = (settings.width - settings.thumbRadius*2) * percent;
                thumbCanvas.style.left = needWidth + 'px';
            }
            /**
             */
            function drawProgress() {
                const total = settings.max - settings.min;
                const percent = (value + settings.min) / total;
                const needWidth = (settings.width - settings.thumbRadius) * percent;
                console.log(needWidth);
                pgContext.clearRect(0, 0, progressCanvas.width, progressCanvas.height);
                if (percent == 0) {
                    return;
                }
                const LeftArcStartPoint = new Coordinates(settings.borderRadius, settings.thumbRadius - settings.height / 2);
                const LeftArcMiddlePoint = new Coordinates(0, settings.thumbRadius);
                const LeftArcEndPoint = new Coordinates(settings.borderRadius, settings.thumbRadius + settings.height / 2);

                const RightArcStartPoint = new Coordinates(needWidth + settings.thumbRadius / 2, settings.thumbRadius - settings.height / 2);
                const RightArcEndPoint = new Coordinates(needWidth + settings.thumbRadius / 2, settings.thumbRadius + settings.height / 2);

                pgContext.beginPath();

                pgContext.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);
                pgContext.arcTo(LeftArcMiddlePoint.x, LeftArcMiddlePoint.y, LeftArcEndPoint.x, LeftArcEndPoint.y, settings.borderRadius);
                pgContext.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                pgContext.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);

                pgContext.lineTo(RightArcStartPoint.x, RightArcStartPoint.y);
                pgContext.lineTo(RightArcEndPoint.x, RightArcEndPoint.y);

                pgContext.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                pgContext.strokeStyle = (isEnabled) ? settings.borderProgressColor.mainColor : settings.borderProgressColor.disabledColor;
                pgContext.stroke();
                pgContext.fillStyle = (isEnabled) ? settings.progressColor.mainColor : settings.progressColor.disabledColor;
                pgContext.fill();
                pgContext.closePath();
            }
            /**
             */
            (function update() {
                drawBorders();
                drawProgress();
                drawThumb();
            })();
            thumbCanvas.onpointerdown = function(event) {
                /**
                 * @type {HTMLCanvasElement}
                 */
                event.preventDefault();
                event.stopPropagation();
                moveAt(event.pageX);
                /**
                 * @param {Number} pageX
                 */
                function moveAt(pageX) {
                    const offset = thumbCanvas.parentElement.getBoundingClientRect();
                    const moving = (pageX - offset.left - thumbCanvas.width / 2 + window.pageXOffset);
                    if (moving < 0) {
                        thumbCanvas.style.left = 0;
                        value = settings.min;
                    } else if (moving > progressCanvas.width - thumbCanvas.width) {
                        thumbCanvas.style.left = progressCanvas.width - thumbCanvas.width + 'px';
                        value = settings.max;
                    } else {
                        thumbCanvas.style.left = moving + 'px';
                        const total = settings.max - settings.min;
                        const maxleft = progressCanvas.width - thumbCanvas.width;
                        const percent = moving / maxleft;
                        // TODO: refactoring
                        value = (settings.min + percent * total);
                        value = Math.floor(value);
                    }
                    progressCanvas.setAttribute('value', '' + value);
                    drawProgress(pgContext, settings, true, value);
                }
                /**
                 * @param {PointerEvent} event
                 */
                function onPointerMove(event) {
                    moveAt(event.pageX);
                }
                /**
                 * @param {PointerEvent} event
                 */
                function onPointerUp(event) {
                    document.removeEventListener('pointermove', onPointerMove);
                    document.removeEventListener('pointerup', onPointerUp);
                }
                document.addEventListener('pointermove', onPointerMove, false);
                document.addEventListener('pointerup', onPointerUp, false);
            };
            /**
             * @param {HTMLDivElement} div
             */
            this.addToDiv = function(div) {
                div.style.position = 'relative';
                div.style.height = settings.thumbRadius * 2 + 'px';
                div.style.margin = '2px';
                div.appendChild(backgoundCanvas);
                div.appendChild(progressCanvas);
                div.appendChild(thumbCanvas);
            };
            this.getValue = function() {
                return value;
            };
            this.setValue = function(oValue) {
                value = oValue;
                update();
            };
            this.enable = function() {
                isEnabled = true;
                update();
            };
            this.disable = function() {
                isEnabled = false;
                update();
            };
        },
    };
})();
