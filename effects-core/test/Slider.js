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
const Slider = (function() {
    /**
     * Default settings for slider
     * @type {Settings}
     */
    const defualtSliderSettings = {
        backgroundColor: {mainColor: '#c0c0c0', disabledColor: '#c0c0c0'},
        progressColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderProgressColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        thumbColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderBackgroundColor: {mainColor: '#c0c0c0', disabledColor: '#c0c0c0'},
        width: 128,
        height: 4,
        borderRadius: 2,
        thumbRadius: 6,
        max: 100,
        min: 0,
        startValue: 0,
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
    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Settings} settings
     * @param {Boolean} isEnabled
     */
    function drawBorders(context, settings, isEnabled) {
        context.beginPath();

        const LeftArcStartPoint = new Coordinates(settings.borderRadius, settings.thumbRadius - settings.height / 2);
        const LeftArcMiddlePoint = new Coordinates(0, settings.thumbRadius);
        const LeftArcEndPoint = new Coordinates(settings.borderRadius, settings.thumbRadius + settings.height / 2);

        const RightArcStartPoint = new Coordinates(settings.width - 2 * settings.borderRadius, settings.thumbRadius - settings.height / 2);
        const RightArcMiddlePoint = new Coordinates(settings.width, settings.thumbRadius);
        const RightArcEndPoint = new Coordinates(settings.width - 2 * settings.borderRadius, settings.thumbRadius + settings.height / 2);

        context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);
        context.arcTo(LeftArcMiddlePoint.x, LeftArcMiddlePoint.y, LeftArcEndPoint.x, LeftArcEndPoint.y, settings.borderRadius);
        context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

        context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);

        context.lineTo(RightArcStartPoint.x, RightArcStartPoint.y);
        context.arcTo(RightArcMiddlePoint.x, RightArcMiddlePoint.y, RightArcEndPoint.x, RightArcEndPoint.y, settings.borderRadius);
        context.lineTo(RightArcEndPoint.x, RightArcEndPoint.y);

        context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

        context.strokeStyle = (isEnabled) ? settings.borderBackgroundColor.mainColor : settings.borderBackgroundColor.disabledColor;
        context.stroke();
        context.fillStyle = (isEnabled) ? settings.backgroundColor.mainColor : settings.backgroundColor.disabledColor;
        context.fill();

        context.closePath();
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Settings} settings
     * @param {Boolean} isEnabled
     */
    function drawThumb(context, settings, isEnabled) {
        context.beginPath();
        context.arc(settings.thumbRadius, settings.thumbRadius, settings.thumbRadius, 0, 2*Math.PI);
        context.fillStyle = (isEnabled) ? settings.thumbColor.mainColor : settings.thumbColor.disabledColor;
        context.fill();
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Settings} settings
     * @param {Boolean} isEnabled
     */
    // function update(context, settings, isEnabled) {
    //     context.strokeStyle = 'blue';
    //     context.stroke();
    //     context.fillStyle = 'red';
    //     context.fill();
    // }
    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Settings} settings
     * @param {Boolean} isEnabled
     * @param {Number} value
     */
    function drawProgress(context, settings, isEnabled, value) {
        const total = settings.max - settings.min;
        const percent = (value - settings.min) / total;
        const needWidth = settings.width * percent;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (percent == 0) {
            return;
        }
        const LeftArcStartPoint = new Coordinates(settings.borderRadius, settings.thumbRadius - settings.height / 2);
        const LeftArcMiddlePoint = new Coordinates(0, settings.thumbRadius);
        const LeftArcEndPoint = new Coordinates(settings.borderRadius, settings.thumbRadius + settings.height / 2);

        const RightArcStartPoint = new Coordinates(needWidth - 2 * settings.borderRadius, settings.thumbRadius - settings.height / 2);
        const RightArcMiddlePoint = new Coordinates(needWidth, settings.thumbRadius);
        const RightArcEndPoint = new Coordinates(needWidth - 2 * settings.borderRadius, settings.thumbRadius + settings.height / 2);

        context.beginPath();

        context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);
        context.arcTo(LeftArcMiddlePoint.x, LeftArcMiddlePoint.y, LeftArcEndPoint.x, LeftArcEndPoint.y, settings.borderRadius);
        context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

        context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);

        context.lineTo(RightArcStartPoint.x, RightArcStartPoint.y);
        context.arcTo(RightArcMiddlePoint.x, RightArcMiddlePoint.y, RightArcEndPoint.x, RightArcEndPoint.y, settings.borderRadius);
        context.lineTo(RightArcEndPoint.x, RightArcEndPoint.y);

        context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

        context.strokeStyle = (isEnabled) ? settings.borderProgressColor.mainColor : settings.borderProgressColor.disabledColor;
        context.stroke();
        context.fillStyle = (isEnabled) ? settings.progressColor.mainColor : settings.progressColor.disabledColor;
        context.fill();
        context.closePath();
    }
    return {
        /**
         * Constructor for sliders
         * @param {Settings} settings
         */
        Slider: function(settings) {
            this.settings = settings || defualtSliderSettings;
            settings = this.settings;
            this.isEnabled = this.settings.isEnabledByDefault;
            if (this.settings.borderRadius > this.settings.height / 2) {
                this.settings.borderRadius = this.settings.height / 2;
            }
            if (this.settings.thumbRadius*2 < this.settings.height) {
                this.settings.thumbRadius = this.settings.height / 2;
            }

            this.value = this.settings.startValue;
            let value = this.value;

            const backgoundCanvas = document.createElement('canvas');
            const progressCanvas = document.createElement('canvas');
            const thumbCanvas = document.createElement('canvas');

            backgoundCanvas.width = this.settings.width;
            progressCanvas.width = this.settings.width;
            thumbCanvas.width = this.settings.thumbRadius * 2;

            backgoundCanvas.height = this.settings.thumbRadius * 2;
            progressCanvas.height = this.settings.thumbRadius * 2;
            thumbCanvas.height = this.settings.thumbRadius * 2;

            backgoundCanvas.style.zIndex = 1;
            progressCanvas.style.zIndex = 2;
            thumbCanvas.style.zIndex = 3;

            backgoundCanvas.style.position = 'absolute';
            progressCanvas.style.position = 'absolute';
            thumbCanvas.style.position = 'absolute';

            const bgContext = backgoundCanvas.getContext('2d');
            const pgContext = progressCanvas.getContext('2d');
            drawBorders(bgContext, settings, this.isEnabled);
            drawThumb(thumbCanvas.getContext('2d'), settings, this.isEnabled);
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
                    const moving = (pageX - offset.x - thumbCanvas.width / 2 + window.scrollX);
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
                        // TODO: values,refactoring, fix progressbar
                        value = (percent * 100);
                    }
                    console.log(value);
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
           // update(this.bgContext);
            // TODO: Зависимость от прогресса
            /**
             * @param {HTMLDivElement} div
             */
            this.addToDiv = function(div) {
                div.style.position = 'relative';
                div.style.height = this.settings.thumbRadius * 2 + 'px';
                div.style.margin = '2px';
                div.appendChild(backgoundCanvas);
                div.appendChild(progressCanvas);
                div.appendChild(thumbCanvas);
            };
        },
    };
})();
