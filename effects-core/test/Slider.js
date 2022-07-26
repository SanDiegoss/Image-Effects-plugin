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
 * @property {Color} thumbColor
 * @property {Color} borderColor
 * @property {Number} width
 * @property {Number} height
 * @property {Number} borderRadius
 * @property {Number} thumbRadius
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
        thumbColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderColor: {mainColor: '#c0c0c0', disabledColor: '#c0c0c0'},
        width: 128,
        height: 4,
        borderRadius: 2,
        thumbRadius: 6,
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

        context.strokeStyle = (isEnabled) ? settings.borderColor.mainColor : settings.borderColor.disabledColor;
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
    return {
        /**
         * Constructor for sliders
         * @param {Settings} settings
         */
        Slider: function(settings) {
            this.settings = settings || defualtSliderSettings;
            this.isEnabled = this.settings.isEnabledByDefault;
            if (this.settings.borderRadius > this.settings.height / 2) {
                this.settings.borderRadius = this.settings.height / 2;
            }

            this.backgoundCanvas = document.createElement('canvas');
            this.progressCanvas = document.createElement('canvas');
            this.thumbCanvas = document.createElement('canvas');

            this.backgoundCanvas.width = this.settings.width;
            this.progressCanvas.width = this.settings.width;
            this.thumbCanvas.width = this.settings.thumbRadius * 2;

            this.backgoundCanvas.height = this.settings.thumbRadius * 2;
            this.progressCanvas.height = this.settings.height;
            this.thumbCanvas.height = this.settings.thumbRadius * 2;

            this.backgoundCanvas.style.zIndex = 1;
            this.progressCanvas.style.zIndex = 2;
            this.thumbCanvas.style.zIndex = 3;

            this.backgoundCanvas.style.position = 'absolute';
            this.progressCanvas.style.position = 'absolute';
            this.thumbCanvas.style.position = 'absolute';

            this.progressCanvas.style.top = this.settings.thumbRadius - this.settings.height / 2 + 'px';

            this.bgContext = this.backgoundCanvas.getContext('2d');
            this.bgContext.imageSmoothingEnabled = false;
            drawBorders(this.bgContext, this.settings, this.isEnabled);
            drawThumb(this.thumbCanvas.getContext('2d'), this.settings, this.isEnabled);
            // TODO: Зависимость от прогресса
            this.draw = function() {
            };
            /**
             * @param {HTMLDivElement} div
             */
            this.addToDiv = function(div) {
                div.style.position = 'relative';
                div.style.height = this.settings.thumbRadius * 2 + 'px';
                div.style.margin = '2px';
                div.appendChild(this.backgoundCanvas);
                div.appendChild(this.progressCanvas);
                div.appendChild(this.thumbCanvas);
            };
        },
    };
})();
